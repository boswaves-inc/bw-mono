use crate::{
    core::{
        charge_bee::{CBArgs, CBClient},
        server::ServerArgs, tradingview::{TVArgs, TVClient},
    },
    tracing::TracingArgs,
};
use clap::Parser;

#[derive(Parser, Clone)]
pub struct Args {
    #[command(flatten)]
    server: ServerArgs,

    #[command(flatten)]
    tracing: TracingArgs,

    #[command(flatten)]
    charge_bee: CBArgs,

    #[command(flatten)]
    tradingview: TVArgs,
}

impl Args {
    pub fn charge_bee(&self) -> CBArgs {
        self.charge_bee.clone()
    }

    pub fn tracing(&self) -> TracingArgs {
        self.tracing.clone()
    }

    pub fn tradingview(&self) -> TVArgs {
        self.tradingview.clone()
    }

    pub fn server(&self) -> ServerArgs {
        self.server.clone()
    }
}

#[derive(Clone)]
pub struct Config {
    args: Args,
    charge_bee: CBClient,
    tradingview: TVClient,
}

impl Config {
    pub fn from_args(args: Args) -> Self {
        let charge_bee = CBClient::from(args.charge_bee.clone());
        let tradingview = TVClient::from(args.tradingview.clone());

        Self { args, charge_bee, tradingview }
    }

    pub fn args(&self) -> Args {
        self.args.clone()
    }

    pub fn charge_bee(&self) -> CBClient {
        self.charge_bee.clone()
    }

    pub fn tradingview(&self) -> TVClient {
        self.tradingview.clone()
    }
}
