FROM debian:bookworm AS build

# Install Rust and build dependencies
RUN apt-get update && \
    apt-get install -y curl build-essential pkg-config libssl-dev && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /app

# Copy source code
COPY ./server ./server
COPY ./libs ./libs

# Set the working directory to the project root for cargo build
WORKDIR /app

# Build the project with proper cache mounts
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/app/target \
    cargo build --release --package sonar_api --manifest-path ./server/api/Cargo.toml

# Use debian:bookworm-slim instead of distroless for newer glibc
FROM debian:bookworm-slim AS bin

# Install minimal required packages
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app/bin

# Copy the binary from the correct target location
COPY --from=build /app/server/api/target/release/ .

ENTRYPOINT [ "/app/bin/sonar_api" ]
