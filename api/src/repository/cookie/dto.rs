#[derive(Debug)]
pub struct CreateCookie {
    pub user_id: i32,
    pub expires: u64,
    pub secret: String,
}

pub struct Cookie {
    pub id: i32,
    pub user_id: i32,
    pub expires: u64,
    pub secret: String,
}
