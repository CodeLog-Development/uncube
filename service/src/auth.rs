use ::entity::refresh_token;
use sea_orm::*;
use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use thiserror::Error;

pub struct AuthService;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub user_id: i32,
    pub username: String,
    pub email: String,
    pub exp: u64,
    pub iss: String,
    pub iat: u64,
}

#[derive(Debug, Error)]
pub enum JwtGenerationError {
    #[error("I/O Error: {0}")]
    IO(#[from] tokio::io::Error),
    #[error("JWT Error: {0}")]
    JWT(#[from] jsonwebtoken::errors::Error),
    #[error("Time calculation error: {0}")]
    Time(#[from] std::time::SystemTimeError),
}

#[derive(Debug, Error)]
pub enum JwtDecodeError {
    #[error("I/O Error: {0}")]
    IO(#[from] tokio::io::Error),
    #[error("JWT Error: {0}")]
    JWT(#[from] jsonwebtoken::errors::Error),
}

#[derive(Debug, Error)]
pub enum RefreshTokenError {
    #[error("DB Error: {0}")]
    DB(#[from] DbErr),
    #[error("Time calculation error: {0}")]
    Time(#[from] std::time::SystemTimeError),
    #[error("Failed to convert u64 timestamp to i64")]
    Conversion(<i64 as TryInto<u64>>::Error),
}

impl AuthService {
    pub async fn generate_jwt(
        user_id: i32,
        username: String,
        email: String,
    ) -> Result<String, JwtGenerationError> {
        let bytes = tokio::fs::read("./priv.pem").await?;
        let encoding_key = jsonwebtoken::EncodingKey::from_rsa_pem(&bytes)?;
        let header = jsonwebtoken::Header::new(jsonwebtoken::Algorithm::RS256);
        let now = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs();
        Ok(jsonwebtoken::encode(
            &header,
            &Claims {
                user_id,
                username,
                email,
                iat: now,
                exp: now + 60 * 5,
                iss: "Uncube API".to_string(),
            },
            &encoding_key,
        )?)
    }

    pub async fn decode_jwt(
        jwt: String,
    ) -> Result<jsonwebtoken::TokenData<Claims>, JwtDecodeError> {
        let bytes = tokio::fs::read("./pub.pem").await?;
        let decoding_key = jsonwebtoken::DecodingKey::from_rsa_pem(&bytes)?;
        let mut validation = jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::RS256);
        validation.validate_exp = true;
        Ok(jsonwebtoken::decode(&jwt, &decoding_key, &validation)?)
    }

    pub async fn create_refresh_token(
        db: &DatabaseConnection,
        user_id: i32,
        secret: String,
    ) -> Result<refresh_token::ActiveModel, RefreshTokenError> {
        Ok(refresh_token::ActiveModel {
            user_id: Set(user_id),
            secret: Set(secret),
            expires: Set(<u64 as TryInto<i64>>::try_into(
                SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs(),
            )
            .map_err(RefreshTokenError::Conversion)?
                + 7 * 24 * 60 * 60),
            ..Default::default()
        }
        .save(db)
        .await?)
    }

    pub async fn find_refresh_token_by_secret(
        db: &DatabaseConnection,
        secret: &str,
    ) -> Result<Option<refresh_token::Model>, RefreshTokenError> {
        let current_timestamp: i64 = SystemTime::now()
            .duration_since(UNIX_EPOCH)?
            .as_secs()
            .try_into()
            .map_err(RefreshTokenError::Conversion)?;

        Ok(refresh_token::Entity::find()
            .filter(
                refresh_token::Column::Secret
                    .eq(secret)
                    .and(refresh_token::Column::Expires.gte(current_timestamp))
                    .and(refresh_token::Column::Used.eq(false)),
            )
            .one(db)
            .await?)
    }

    pub async fn use_refresh_token(
        db: &DatabaseConnection,
        token_id: i32,
    ) -> Result<refresh_token::ActiveModel, DbErr> {
        refresh_token::ActiveModel {
            id: Set(token_id),
            used: Set(true),
            ..Default::default()
        }
        .save(db)
        .await
    }
}
