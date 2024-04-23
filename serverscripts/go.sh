#!/bin/bash
# Update package lists

sudo yum update -y


# Install required dependencies
sudo yum install -y gcc tar gzip


# Download Go binary
GO_VERSION="1.20.2"
GO_ARCH="arm64"
GO_ARCHIVE="go${GO_VERSION}.linux-${GO_ARCH}.tar.gz"
GO_URL="https://golang.org/dl/${GO_ARCHIVE}"


wget "${GO_URL}"

# Extract Go binary
sudo tar -C /usr/local -xzf "${GO_ARCHIVE}"


# Add Go bin directory to PATH
echo 'export PATH=$PATH:/usr/local/go/bin' | sudo tee -a /etc/profile.d/go.sh
source /etc/profile.d/go.sh


# Verify installation
go version

# Cleanup
rm "${GO_ARCHIVE}"

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