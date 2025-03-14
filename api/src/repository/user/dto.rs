#[derive(Debug)]
pub struct CreateUser {
    pub username: String,
    pub email: String,
    pub hash: String,
}

#[derive(Debug)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub hash: String,
}
