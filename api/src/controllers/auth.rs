use crate::{
    repository::{
        cookie::{dto::CreateCookie, CookieRepository},
        user::{dto::User, UserRepository},
    },
    response::ApiResponse,
    ServerState,
};
use argon2::{password_hash::PasswordVerifier, PasswordHash};
use axum::{
    extract::{FromRequestParts, State},
    http::{request::Parts, StatusCode},
    response::AppendHeaders,
    routing::post,
    Json,
};
use serde::{Deserialize, Serialize};
use std::{
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

use super::user::UserResponse;

pub fn create_router() -> axum::Router<Arc<ServerState>> {
    axum::Router::new().route("/", post(authenticate))
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    user: UserResponse,
}

#[derive(Debug, Clone, Deserialize)]
pub struct AuthRequest {
    pub email: String,
    pub password: String,
}

pub async fn authenticate(
    State(state): State<Arc<ServerState>>,
    Json(req): Json<AuthRequest>,
) -> (
    StatusCode,
    AppendHeaders<Vec<(String, String)>>,
    Json<ApiResponse<AuthResponse>>,
) {
    let repo = UserRepository::new(&state.pool);
    let user = match repo.by_email(&req.email).await {
        Ok(user) => user,
        Err(err) => {
            tracing::error!(error = %err, "Failed to find user");
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                AppendHeaders(vec![]),
                Json(ApiResponse::Err(
                    "Failed to query user details.".to_string(),
                )),
            );
        }
    };

    let argon2 = argon2::Argon2::default();
    if tokio::task::spawn_blocking(move || {
        let hash = PasswordHash::new(&user.hash).expect("Failed to parse user password hash");
        argon2.verify_password(req.password.as_bytes(), &hash)
    })
    .await
    .expect("Failed to wait for tokio task")
    .is_err()
    {
        return (
            StatusCode::BAD_REQUEST,
            AppendHeaders(vec![]),
            Json(ApiResponse::Err(
                "Incorrect username or password".to_string(),
            )),
        );
    }

    let secret = hex::encode(rand::random::<[u8; 16]>());
    let expires = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Failed to calculate system time")
        .as_secs()
        + 7 * 24 * 60 * 60;
    let user_id = user.id;
    let cookie = CreateCookie {
        user_id,
        expires,
        secret: secret.clone(),
    };

    let repo = CookieRepository::new(&state.pool);
    match repo.create_cookie(cookie).await {
        Ok(_) => {
            let header = format!(
                "uncube={};HttpOnly;{}SameSite=Strict;Max-Age={};Path=/",
                secret,
                {
                    #[cfg(not(debug_assertions))]
                    {
                        "Secure;"
                    }
                    #[cfg(debug_assertions)]
                    {
                        ""
                    }
                },
                7 * 24 * 60 * 60
            );
            (
                StatusCode::OK,
                AppendHeaders(vec![("Set-Cookie".to_string(), header)]),
                Json(ApiResponse::Ok(AuthResponse {
                    user: UserResponse {
                        username: user.username,
                        email: user.email,
                    },
                })),
            )
        }
        Err(err) => {
            tracing::error!(error = %err, "Failed to create cookie");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                AppendHeaders(vec![]),
                Json(ApiResponse::Err("Failed to create auth token.".to_string())),
            )
        }
    }
}

impl FromRequestParts<Arc<ServerState>> for User {
    type Rejection = (StatusCode, Json<ApiResponse<()>>);

    async fn from_request_parts(
        parts: &mut Parts,
        state: &Arc<ServerState>,
    ) -> Result<Self, Self::Rejection> {
        let secret = parts
            .headers
            .iter()
            .find(|x| x.0 == axum::http::header::COOKIE)
            .ok_or((
                StatusCode::UNAUTHORIZED,
                Json(ApiResponse::<()>::Err(
                    "No authorization cookie.".to_string(),
                )),
            ))?
            .1
            .to_str()
            .map_err(|_| {
                (
                    StatusCode::BAD_REQUEST,
                    Json(ApiResponse::<()>::Err("Invalid cookie header".to_string())),
                )
            })?
            .strip_prefix("uncube=")
            .ok_or((
                StatusCode::BAD_REQUEST,
                Json(ApiResponse::<()>::Err("Invalid cookie header".to_string())),
            ))?;

        let user_repo = UserRepository::new(&state.pool);
        match user_repo.by_cookie_secret(secret).await {
            Ok(Some(user)) => Ok(user),
            Ok(None) => Err((
                StatusCode::UNAUTHORIZED,
                Json(ApiResponse::<()>::Err(
                    "Invalid or expired cookie ".to_string(),
                )),
            )),
            Err(err) => {
                tracing::error!(error = %err, "Failed to retrieve user from database");
                Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(ApiResponse::<()>::Err(
                        "Failed to authenticate user".to_string(),
                    )),
                ))
            }
        }
    }
}
