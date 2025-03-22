use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct ApiError {
    pub error: String,
}

impl ApiError {
    pub fn new(msg: &(impl ToString + ?Sized)) -> Self {
        Self {
            error: msg.to_string(),
        }
    }
}
