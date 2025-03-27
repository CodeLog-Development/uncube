use ::entity::{puzzle, solve};
use sea_orm::{prelude::*, *};
use thiserror::Error;

pub struct SolveService;

#[derive(Debug, Error)]
pub enum CreateSolveError {
    #[error("No such puzzle type exists")]
    InvalidPuzzle,
    #[error("DB Error: {0}")]
    DB(#[from] DbErr),
}

impl SolveService {
    pub async fn create_solve(
        db: &DatabaseConnection,
        user_id: i32,
        time: f64,
        scramble: Option<String>,
        puzzle: String,
    ) -> Result<solve::ActiveModel, CreateSolveError> {
        let puzzle = puzzle::Entity::find()
            .filter(puzzle::Column::Code.eq(puzzle))
            .one(db)
            .await?
            .ok_or(CreateSolveError::InvalidPuzzle)?;

        Ok(solve::ActiveModel {
            time: Set(time),
            scramble: Set(scramble),
            created_at: Set(Default::default()),
            owner_id: Set(user_id),
            puzzle_id: Set(puzzle.id),
            ..Default::default()
        }
        .save(db)
        .await?)
    }
}
