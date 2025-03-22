use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct CreateSolveRequest {
    pub time: f64,
    pub scramble: Option<String>,
    pub puzzle: String,
}
