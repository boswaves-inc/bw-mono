use clap::Parser;
use lombok::Getter;

mod client;
mod item;

pub use item::*;
pub use client::CBClient;

use thiserror::Error;


#[derive(Parser, Debug, Clone, Getter)]
pub struct CBArgs {
    #[arg(name("cb-family"), long("cb-family"), env("CB_FAMILY"))]
    family: String,

    #[arg(name("cb-website"), long("cb-website"), env("CB_WEBSITE"))]
    website: String,

    #[arg(name("cb-api-key"), long("cb-api-key"), env("CB_API_KEY"))]
    api_key: String,
}

#[derive(Error, Debug)]
pub enum CBError {
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),

    #[error("{message}: ({error_msg}) - {error_code}")]
    Request {
        error_code: String,
        error_msg: String,
        message: String,
    },
}
