use sea_orm_migration::{prelude::*, schema::*};

use crate::m20220101_000001_create_table::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Puzzle::Table)
                    .if_not_exists()
                    .col(pk_auto(Puzzle::Id))
                    .col(string(Puzzle::Name).not_null())
                    .col(string(Puzzle::Code).not_null())
                    .to_owned(),
            )
            .await?;

        manager
            .create_table(
                Table::create()
                    .table(Solve::Table)
                    .if_not_exists()
                    .col(pk_auto(Solve::Id))
                    .col(timestamp(Solve::CreatedAt).not_null())
                    .col(integer(Solve::OwnerId).not_null())
                    .col(double(Solve::Time).not_null())
                    .col(string(Solve::Scramble))
                    .col(integer(Solve::PuzzleId))
                    .foreign_key(
                        ForeignKey::create()
                            .from(Solve::Table, Solve::PuzzleId)
                            .to(Puzzle::Table, Puzzle::Id),
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .from(Solve::Table, Solve::OwnerId)
                            .to(User::Table, User::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Solve::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Puzzle {
    Table,
    Id,
    Name,
    Code,
}

#[derive(DeriveIden)]
enum Solve {
    Table,
    Id,
    CreatedAt,
    OwnerId,
    Time,
    Scramble,
    PuzzleId,
}
