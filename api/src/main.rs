use std::sync::Arc;

use axum::http::HeaderValue;
use tower::ServiceBuilder;
use tower_http::cors::{AllowOrigin, CorsLayer};
use tracing::level_filters::LevelFilter;

pub mod controllers;
pub mod repository;
pub mod response;

#[derive(Debug)]
pub struct ServerState {
    pub pool: sqlx::MySqlPool,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(LevelFilter::TRACE)
        .init();

    if let Err(err) = dotenvy::dotenv() {
        tracing::error!(error = %err, "Failed to load .env");
    }

    let db_uri = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let pool = sqlx::MySqlPool::connect(&db_uri)
        .await
        .expect("Failed to connect to database");

    let cors = CorsLayer::new()
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::OPTIONS,
            axum::http::Method::PUT,
            axum::http::Method::PATCH,
            axum::http::Method::DELETE,
        ])
        .allow_origin(AllowOrigin::from([
            HeaderValue::from_str("localhost:8080").unwrap()
        ]))
        .allow_credentials(true);

    let router = axum::Router::new()
        .nest(
            "/api/v1",
            axum::Router::new()
                .nest("/user", controllers::user::create_router())
                .nest("/auth", controllers::auth::create_router()),
        )
        .layer(
            ServiceBuilder::new()
                .layer(tower_http::trace::TraceLayer::new_for_http())
                .layer(cors),
        )
        .with_state(Arc::new(ServerState { pool }));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();
    tracing::info!("Axum listening on 127.0.0.1:8080");

    if let Err(err) = axum::serve(listener, router).await {
        tracing::error!(error = %err, "Axum server panicked.");
    }
}
