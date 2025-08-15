# Build stage
FROM rust:1.70 as builder

WORKDIR /app
COPY . .

RUN cargo build --release

# Runtime stage
FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/backend /usr/local/bin/
COPY --from=builder /app/.env /app/

WORKDIR /app
EXPOSE 8080

CMD ["backend"]