use crate::config::Config;
use axum::routing::{get, post};

mod auth {}
mod invoice;
mod items;

pub struct Router;

impl Router {
    pub fn router() -> axum::Router<Config> {
        axum::Router::new()
            // Auth
            .route("/auth", post(invoice::post_handler))
            .route("/signup", post(invoice::post_handler))
            //
            // Invoice
            .route("/invoice", post(invoice::post_handler))
            //
            // Item
            .route("/items", get(items::list_handler))
            .route("/items", post(items::create_handler))
            .route("/items/{id}", get(items::get_handler))
            .route("/items/{id}", post(items::update_handler))
    }
}
