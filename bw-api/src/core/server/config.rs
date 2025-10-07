use std::{net::IpAddr, time::Duration};
use clap::{ Parser};
use humantime::parse_duration;

/// # Server Args
#[derive(Parser, Debug, Clone, Copy)]
pub struct ServerArgs {
    #[arg(
        name("host"), 
        long("host"), 
        env("HOST"), 
        default_value_t = [0,0,0,0].into(), 
        help("Server host address (default: 0.0.0.0)")
    )]
    host: IpAddr,

    #[arg(
        name("port"),
        long("port"),
        env("PORT"),
        help("port")
    )]
    port: u16,

    #[arg(
        name("SHUTDOWN"), 
        long("shutdown"), 
        env("SHUTDOWN_PERIOD"), 
        default_value = "30s", 
        value_parser = parse_duration, 
        help("Graceful shutdown period (default: 30s)"))]
    shutdown_period: Option<Duration>,
}

impl ServerArgs {
    pub fn host(&self) -> IpAddr {
        self.host
    }

    pub fn port(&self) -> u16 {
        self.port
    }

    pub fn shutdown_period(&self) -> Option<Duration> {
        self.shutdown_period
    }
}