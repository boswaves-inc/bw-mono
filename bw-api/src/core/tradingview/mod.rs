// https://www.tradingview.com/api/v1/ideas/wfiPZo7I

use clap::Parser;
use lombok::Getter;
use thiserror::Error;

mod client;
mod script;

pub use client::*;
pub use script::*;

#[derive(Parser, Debug, Clone, Getter)]
pub struct TVArgs {
    #[arg(name("tv-username"), long("tv-username"), env("TV_USERNAME"))]
    username: String,
}

#[derive(Error, Debug)]
pub enum TVError {
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
}
