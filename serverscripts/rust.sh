#!/bin/bash

# Update packages and install development tools
sudo yum update -y
sudo yum install gcc -y

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Create a new Rust project
bash -c 'source $HOME/.cargo/env; cargo new hello_world_server'

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
bash -c 'source $HOME/.cargo/env; cargo build --release'

# Run the server in the background
nohup ./target/release/hello_world_server &