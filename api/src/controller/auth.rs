use crate::{ServerState, response::ApiError};
use argon2::password_hash::PasswordVerifier;
use axum::{
    Json, debug_handler,
    extract::{FromRequestParts, State},
    http::{StatusCode, request::Parts},
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use service::{
    auth::{AuthService, JwtDecodeError},
    user::UserService,
};
use std::sync::Arc;

pub fn create_router() -> axum::Router<Arc<ServerState>> {
    axum::Router::new()
        .route("/", post(authenticate))
        .route("/whoami", get(whoami))
        .route("/refresh", post(refresh_jwt))
}

#[derive(Debug, Clone, Deserialize)]
pub struct AuthRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthResponse {
    user: UserResponse,
    token: String,
    refresh_token: String,
}

pub async fn authenticate(
    State(state): State<Arc<ServerState>>,
    Json(req): Json<AuthRequest>,
) -> Result<(StatusCode, Json<AuthResponse>), (StatusCode, Json<ApiError>)> {
    let user = match UserService::find_user_by_email(&state.db, &req.email).await {
        Ok(Some(user)) => user,
        Ok(None) => {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(ApiError::new("No such user exists.")),
            ));
        }
        Err(err) => {
            tracing::error!(error = %err, "Failed to query user in database!");
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to authenticate user.")),
            ));
        }
    };

    match tokio::task::spawn_blocking(move || {
        let argon2 = argon2::Argon2::default();
        argon2.verify_password(
            req.password.as_bytes(),
            &argon2::PasswordHash::new(&user.hash).expect("Invalid password hash"),
        )
    })
    .await
    .expect("Failed to wait for tokio task")
    {
        Err(argon2::password_hash::Error::Password) => {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(ApiError::new("Incorrect password")),
            ));
        }
        Err(err) => {
            tracing::error!(error = %err, "Failed to verify user password");
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Password verification process failed")),
            ));
        }
        _ => (),
    }

    let secret = hex::encode(rand::random::<[u8; 16]>());
    if let Err(err) = AuthService::create_refresh_token(&state.db, user.id, secret.clone()).await {
        tracing::error!(error = %err, "Failed to generate refresh token");
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ApiError::new("Failed to create refresh token")),
        ));
    }

    match AuthService::generate_jwt(user.id, user.username.clone(), user.email.clone()).await {
        Ok(token) => Ok((
            StatusCode::OK,
            Json(AuthResponse {
                token,
                user: UserResponse {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
                refresh_token: secret,
            }),
        )),
        Err(err) => {
            tracing::error!(error = %err, "Failed to generate JWT");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to generate token")),
            ))
        }
    }
}

#[debug_handler]
pub async fn whoami(_: State<Arc<ServerState>>, user: UserResponse) -> Json<UserResponse> {
    Json(user)
}

#[derive(Debug, Clone, Deserialize)]
pub struct RefreshTokenRequest {
    pub secret: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct RefreshTokenResponse {
    pub secret: String,
    pub token: String,
}

pub async fn refresh_jwt(
    State(state): State<Arc<ServerState>>,
    Json(req): Json<RefreshTokenRequest>,
) -> Result<(StatusCode, Json<RefreshTokenResponse>), (StatusCode, Json<ApiError>)> {
    let refresh_token = AuthService::find_refresh_token_by_secret(&state.db, &req.secret)
        .await
        .map_err(|err| {
            tracing::error!(error = %err, "Failed to fetch refresh token from database");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to query database.")),
            )
        })?
        .ok_or((
            StatusCode::UNAUTHORIZED,
            Json(ApiError::new("Expired or invalid refresh token")),
        ))?;

    let user = UserService::find_user_by_id(&state.db, refresh_token.user_id)
        .await
        .map_err(|err| {
            tracing::error!(error = %err, "Failed to find user in database");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to find user in database.")),
            )
        })?
        .ok_or((
            StatusCode::BAD_REQUEST,
            Json(ApiError::new("The associated user does not exist.")),
        ))?;

    let secret = hex::encode(rand::random::<[u8; 16]>());
    if let Err(err) = AuthService::create_refresh_token(&state.db, user.id, secret.clone()).await {
        tracing::error!(error = %err, "Failed to create refresh token");
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ApiError::new("Failed to generate new refresh token")),
        ));
    }

    let token = AuthService::generate_jwt(user.id, user.username, user.email)
        .await
        .map_err(|err| {
            tracing::error!(error = %err, "Failed to generate JWT");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to generate JWT")),
            )
        })?;

    match AuthService::use_refresh_token(&state.db, refresh_token.id).await {
        Ok(_) => Ok((StatusCode::OK, Json(RefreshTokenResponse { secret, token }))),
        Err(err) => {
            tracing::error!(error = %err, "Failed to invalidate refresh token");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to invalidate refresh token")),
            ))
        }
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct UserResponse {
    pub id: i32,
    pub username: String,
    pub email: String,
}

impl FromRequestParts<Arc<ServerState>> for UserResponse {
    type Rejection = (StatusCode, Json<ApiError>);

    async fn from_request_parts(
        parts: &mut Parts,
        _: &Arc<ServerState>,
    ) -> Result<Self, Self::Rejection> {
        let token = parts
            .headers
            .get(axum::http::header::AUTHORIZATION)
            .ok_or((
                StatusCode::UNAUTHORIZED,
                Json(ApiError::new("No authorization header present")),
            ))?
            .to_str()
            .map_err(|_| {
                (
                    StatusCode::BAD_REQUEST,
                    Json(ApiError::new("Invalid authorization header")),
                )
            })?
            .strip_prefix("Bearer ")
            .ok_or((
                StatusCode::BAD_REQUEST,
                Json(ApiError::new("Invalid authorization header")),
            ))?;

        let token_data =
            AuthService::decode_jwt(token.to_string())
                .await
                .map_err(|err| match err {
                    JwtDecodeError::JWT(_) => (
                        StatusCode::BAD_REQUEST,
                        Json(ApiError::new("Invalid token")),
                    ),
                    err @ JwtDecodeError::IO(_) => {
                        tracing::error!(error = %err, "Failed to decode JWT");
                        (
                            StatusCode::INTERNAL_SERVER_ERROR,
                            Json(ApiError::new("Failed to decode token")),
                        )
                    }
                })?;

        Ok(UserResponse {
            id: token_data.claims.user_id,
            username: token_data.claims.username,
            email: token_data.claims.email,
        })
    }
}
