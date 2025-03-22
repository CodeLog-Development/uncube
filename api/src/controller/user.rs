use crate::{ServerState, response::ApiError};
use argon2::password_hash::{PasswordHasher, SaltString};
use axum::{Json, extract::State, http::StatusCode, routing::post};
use serde::Deserialize;
use std::sync::Arc;

pub fn create_router() -> axum::Router<Arc<ServerState>> {
    axum::Router::new().route("/", post(create_user))
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateUserRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

pub async fn create_user(
    State(state): State<Arc<ServerState>>,
    Json(req): Json<CreateUserRequest>,
) -> Result<StatusCode, (StatusCode, Json<ApiError>)> {
    let hash = tokio::task::spawn_blocking(move || {
        let argon2 = argon2::Argon2::default();
        let salt = SaltString::generate(rand::rngs::OsRng);
        argon2
            .hash_password(req.password.as_bytes(), &salt)
            .map(|x| x.to_string())
    })
    .await
    .expect("Failed to wait for tokio task")
    .expect("Failed to hash password");

    match service::user::UserService::find_user_by_username_or_email(
        &state.db,
        &req.username,
        &req.email,
    )
    .await
    {
        Ok(Some(_)) => {
            return Err((
                StatusCode::BAD_REQUEST,
                Json(ApiError::new(
                    "A user with that username or email already exists",
                )),
            ));
        }
        Err(err) => {
            tracing::error!(error = %err, "Failed to query user for duplicate users");
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to check for existing users")),
            ));
        }
        _ => (),
    }

    match service::user::UserService::create_user(
        &state.db,
        service::user::CreateUser {
            username: req.username,
            email: req.email,
            hash,
        },
    )
    .await
    {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(err) => {
            tracing::error!(error = %err, "Failed to create user");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to create user.")),
            ))
        }
    }
}
