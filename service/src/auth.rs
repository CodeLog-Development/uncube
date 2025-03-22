use std::time::{SystemTime, UNIX_EPOCH};

use serde::{Deserialize, Serialize};
use thiserror::Error;

pub struct AuthService;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub user_id: i32,
    pub exp: u64,
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

impl AuthService {
    pub async fn generate_jwt(user_id: i32) -> Result<String, JwtGenerationError> {
        let bytes = tokio::fs::read("./priv.pem").await?;
        let encoding_key = jsonwebtoken::EncodingKey::from_rsa_pem(&bytes)?;
        let header = jsonwebtoken::Header::new(jsonwebtoken::Algorithm::RS256);
        Ok(jsonwebtoken::encode(
            &header,
            &Claims {
                user_id,
                exp: SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs() + 7 * 24 * 60 * 60,
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
}
