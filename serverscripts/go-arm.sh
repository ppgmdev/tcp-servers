#!/bin/bash

# Update the package lists for upgrades and new package installations
yum update -y

# Install wget to download Go
yum install -y wget

# Download Go for ARM64
wget https://golang.org/dl/go1.17.linux-arm64.tar.gz

# Extract the downloaded archive
tar -C /usr/local -xzf go1.17.linux-arm64.tar.gz

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
        "net"
        "runtime"
        "sync"
        "sync/atomic"
)

func main() {
        // Set the number of logical CPUs to use
        numCPUs := runtime.NumCPU()
        runtime.GOMAXPROCS(numCPUs)

        // Start the server
        addr := ":8080"
        listener, err := net.Listen("tcp", addr)
        if err != nil {
                fmt.Printf("Failed to listen on %s: %v\n", addr, err)
                return
        }
        fmt.Printf("Server listening on %s\n", addr)

        // Use a WaitGroup to wait for all goroutines to finish
        var wg sync.WaitGroup

        // Use an atomic counter to keep track of the number of requests
        var requestCount int64

        // Accept incoming connections concurrently
        for i := 0; i < numCPUs; i++ {
                wg.Add(1)
                go func() {
                        defer wg.Done()
                        for {
                                conn, err := listener.Accept()
                                if err != nil {
                                        fmt.Printf("Failed to accept connection: %v\n", err)
                                        continue
                                }

                                // Increment the request counter
                                atomic.AddInt64(&requestCount, 1)

                                // Handle the request concurrently
                                go handleRequest(conn)
                        }
                }()
        }

        // Wait for all goroutines to finish
        wg.Wait()
}

func handleRequest(conn net.Conn) {
        defer conn.Close()

        // Read and discard the request data
        buf := make([]byte, 1024)
        _, err := conn.Read(buf)
        if err != nil {
                fmt.Printf("Failed to read request: %v\n", err)
                return
        }

        // Write a simple response
        _, err = conn.Write([]byte("OK\n"))
        if err != nil {
                fmt.Printf("Failed to write response: %v\n", err)
                return
        }
}
EOF

# Build the Go server
go run go-server/server.go &