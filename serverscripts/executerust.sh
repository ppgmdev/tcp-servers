#!/bin/bash
source $HOME/.cargo/env

# Create a new Rust project
cargo new hello_world_server

# Navigate to the project directory
cd hello_world_server

# Replace the main.rs file with the server code
cat > src/main.rs << 'EOF'
use std::net::TcpListener;
use std::io::prelude::*;
use std::net::TcpStream;

fn main() {
    let listener = TcpListener::bind("0.0.0.0:8080").unwrap();

    for stream in listener.incoming() {
        let stream = stream.unwrap();

        handle_connection(stream);
    }
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    stream.read(&mut buffer).unwrap();

    let response = "HTTP/1.1 200 OK\r\n\r\nHello, World!";
    stream.write(response.as_bytes()).unwrap();
    stream.flush().unwrap();
}
EOF

# Build the project
cargo build --release

# Run the server in the background
nohup ./target/release/hello_world_server &