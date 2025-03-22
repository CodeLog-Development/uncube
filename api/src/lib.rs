#![warn(missing_debug_implementations, clippy::pedantic, rust_2018_idioms)]
#![allow(clippy::missing_panics_doc, clippy::missing_errors_doc)]

use axum::{BoxError, Json, error_handling::HandleErrorLayer, http::StatusCode};
use migration::{Migrator, MigratorTrait};
use response::ApiError;
use service::sea_orm::{Database, DatabaseConnection};
use std::{sync::Arc, time::Duration};
use tower::{ServiceBuilder, buffer::BufferLayer, limit::RateLimitLayer};
use tower_http::{cors::CorsLayer, trace::TraceLayer};

#[derive(Debug)]
pub struct ServerState {
    db: DatabaseConnection,
}

pub mod controller;
pub mod response;

#[cfg(debug_assertions)]
pub const ORIGIN_URL: &str = "http://localhost:5173";

#[tokio::main]
pub async fn start() {
    tracing_subscriber::fmt().init();

    if let Err(err) = dotenvy::dotenv() {
        tracing::warn!(error = %err, "Failed to load .env");
    }

    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL not set in .env");
    let host = std::env::var("HOST")
        .unwrap_or("127.0.0.1".to_string())
        .parse::<std::net::IpAddr>()
        .expect("Invalid host IP");
    let port = std::env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse::<u16>()
        .expect("Invalid host port");

    let db = Database::connect(db_url)
        .await
        .expect("Failed to connect to database");

    Migrator::up(&db, None)
        .await
        .expect("Failed to run migrations");

    let listener = tokio::net::TcpListener::bind(format!("{host}:{port}"))
        .await
        .expect("Failed to bind TCP socket");

    let cors_layer = CorsLayer::new()
        .allow_origin(
            ORIGIN_URL
                .parse::<axum::http::HeaderValue>()
                .expect("Failed to parse ORIGIN_URL"),
        )
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::AUTHORIZATION,
        ])
        .allow_methods([
            axum::http::Method::GET,
            axum::http::Method::POST,
            axum::http::Method::PATCH,
            axum::http::Method::DELETE,
            axum::http::Method::PUT,
            axum::http::Method::OPTIONS,
        ]);

    let router = axum::Router::new()
        .nest(
            "/api/v1/",
            axum::Router::new()
                .nest("/user", controller::user::create_router())
                .nest("/auth", controller::auth::create_router())
                .nest("/solve", controller::solve::create_router()),
        )
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|err: BoxError| async move {
                    tracing::error!(error = %err, "A handler panicked whilst handling a request");
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(ApiError::new("Unknown error")),
                    )
                }))
                .layer(BufferLayer::new(1024))
                .layer(RateLimitLayer::new(100, Duration::from_secs(60)))
                .layer(TraceLayer::new_for_http())
                .layer(cors_layer),
        )
        .with_state(Arc::new(ServerState { db }));

    if let Err(err) = axum::serve(listener, router).await {
        tracing::error!(error = %err, "Axum server panicked");
    }

    todo!()
}

pub fn main() {
    start();
}
