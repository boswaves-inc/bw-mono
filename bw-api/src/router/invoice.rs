use axum::{debug_handler, extract::State, Form, Json};
use serde::{Deserialize, Serialize};

use crate::{config::Config, error::Error};

#[derive(Deserialize, Serialize, Clone)]
pub struct PostReq{
    script: String,
    premium: bool
}

#[derive(Deserialize, Serialize, Clone)]
pub struct AuthRes{

}

#[debug_handler]
pub async fn post_handler(
    State(config): State<Config>,
    Form(req): Form<PostReq>,
) -> Result<Json<AuthRes>, Error> {

    todo!()
}