use argon2::password_hash::{PasswordHasher, SaltString};
use axum::{extract::State, http::StatusCode, routing::post, Json};
use serde::Deserialize;
use serde::Serialize;
use std::sync::Arc;

use crate::repository::user::dto::CreateUser;
use crate::response::ApiResponse;
use crate::{repository::user::UserRepository, ServerState};

pub fn create_router() -> axum::Router<Arc<ServerState>> {
    axum::Router::new().route("/", post(create_user))
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub username: String,
    pub email: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct CreateUserRequest {
    username: String,
    email: String,
    password: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct CreateUserResponse;

pub async fn create_user(
    State(state): State<Arc<ServerState>>,
    Json(req): Json<CreateUserRequest>,
) -> (StatusCode, Json<ApiResponse<CreateUserResponse>>) {
    let hash = tokio::task::spawn_blocking(move || {
        let argon2 = argon2::Argon2::default();
        let salt = SaltString::generate(rand::rngs::OsRng);
        argon2
            .hash_password(req.password.as_bytes(), &salt)
            .map(|x| x.to_string())
    })
    .await
    .expect("Failed to wait for blocking task.")
    .expect("Failed to compute password hash.");

    let user_repo = UserRepository::new(&state.pool);
    match user_repo
        .create_user(CreateUser {
            email: req.email,
            username: req.username,
            hash,
        })
        .await
    {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ApiResponse::Ok(CreateUserResponse)),
        ),
        Err(err) => {
            tracing::error!(error = %err, "Failed to insert user into database!");
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiResponse::Err("Failed to create user".to_string())),
            )
        }
    }
}
