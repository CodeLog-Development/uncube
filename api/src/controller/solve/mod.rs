use super::auth::UserResponse;
use crate::{ServerState, response::ApiError};
use axum::{Json, extract::State, http::StatusCode, routing::post};
use request::CreateSolveRequest;
use service::solve::{CreateSolveError, SolveService};
use std::sync::Arc;

pub mod request;

pub fn create_router() -> axum::Router<Arc<ServerState>> {
    axum::Router::new().route("/", post(create_solve))
}

pub async fn create_solve(
    State(state): State<Arc<ServerState>>,
    user: UserResponse,
    Json(req): Json<CreateSolveRequest>,
) -> Result<StatusCode, (StatusCode, Json<ApiError>)> {
    match SolveService::create_solve(&state.db, user.id, req.time, req.scramble, req.puzzle).await {
        Ok(_) => Ok(StatusCode::CREATED),
        Err(CreateSolveError::InvalidPuzzle) => Err((
            StatusCode::BAD_REQUEST,
            Json(ApiError::new("No such puzzle exists")),
        )),
        Err(err @ CreateSolveError::DB(_)) => {
            tracing::error!(error = %err, "Failed to insert solve into database");
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ApiError::new("Failed to create solve")),
            ))
        }
    }
}
