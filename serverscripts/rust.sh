#!/bin/bash

# Update packages and install development tools
sudo yum update -y
sudo yum install gcc -y

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
exec $SHELL