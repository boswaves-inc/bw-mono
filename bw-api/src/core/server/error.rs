use std::string::FromUtf8Error;

use axum::{http::StatusCode, response::{IntoResponse, Response}};
use base64::DecodeError;
use thiserror::Error;
// use crate::core::server::blob::BlobError;

#[derive(Error, Debug)]
pub enum ServerError {
    #[error(transparent)]
    Axum(#[from] axum::Error),

    #[error(transparent)]
    Base64Dec(#[from] DecodeError),

    // #[error(transparent)]
    // Blob(#[from] BlobError),

    #[error(transparent)]
    Utf8(#[from] FromUtf8Error),

    #[error(transparent)]
    Io(#[from] std::io::Error),

    #[error(transparent)]
    Clap(#[from] clap::Error),

    #[error(transparent)]
    Serde(#[from] serde_json::Error),

    #[error("{0}")]
    Custom(String),
}

impl IntoResponse for ServerError {
    fn into_response(self) -> Response {
        match self {
            _ => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("internal_server_error"),
            )
                .into_response(),
        }
    }
}