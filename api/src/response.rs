use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum ApiResponse<T> {
    Ok(T),
    Err(String),
}
