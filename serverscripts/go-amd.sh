#!/bin/bash

# Update the package lists for upgrades and new package installations
yum update -y

# Install wget to download Go
yum install -y wget

# Download Go
wget https://golang.org/dl/go1.17.linux-amd64.tar.gz

# Extract the downloaded archive
tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz

# Set Go environment variables
echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
echo 'export GOPATH=$HOME/go' >> /etc/profile
echo 'export PATH=$PATH:$GOPATH/bin' >> /etc/profile

# Apply the changes
source /etc/profile

# Verify the installation
go version

export GOCACHE=/root/go/cache

# Create a directory for the Go server
mkdir -p go-server/

# Write the Go server code
cat << 'EOF' > go-server/server.go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, World!")
    })

    fmt.Println("Server listening on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        fmt.Printf("Failed to start server: %v\n", err)
    }
}
EOF

# Build the Go server
go run go-server/server.go &
#!/bin/bash

# Update the package lists for upgrades and new package installations
yum update -y

# Install wget to download Go
yum install -y wget

# Download Go
wget https://golang.org/dl/go1.17.linux-amd64.tar.gz

# Extract the downloaded archive
tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz

# Set Go environment variables
echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile
echo 'export GOPATH=$HOME/go' >> /etc/profile
echo 'export PATH=$PATH:$GOPATH/bin' >> /etc/profile

# Apply the changes
source /etc/profile

# Verify the installation
go version

export GOCACHE=/root/go/cache

# Create a directory for the Go server
mkdir -p go-server/

# Write the Go server code
cat << 'EOF' > go-server/server.go
package main

import (
    "fmt"
    "net/http"
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, World!")
    })

    fmt.Println("Server listening on :8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        fmt.Printf("Failed to start server: %v\n", err)
    }
}
EOF

# Build the Go server
go run go-server/server.go &