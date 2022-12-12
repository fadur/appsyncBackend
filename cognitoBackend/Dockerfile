# golang builder image
FROM golang:1.14.2-alpine3.11 AS builder
# set working directory
WORKDIR /var/task
# copy go mod and sum files
COPY go.mod go.sum ./

# copy zscaler cert to container and update ca-certificates
COPY ./ZscalerRootCertificate-2048-SHA256.crt /usr/local/share/ca-certificates/zscaler.crt
RUN cat /usr/local/share/ca-certificates/zscaler.crt >> /etc/ssl/certs/ca-certificates.crt && \
    apk update && apk add ca-certificates && update-ca-certificates

# download dependencies
RUN go mod download
# copy the source from the current directory to the working Directory inside the container
COPY . .
# build the application
RUN go build -o cognitoBackend

# final stage
FROM alpine:3.11
# copy the pre-built binary file from the previous stage
COPY --from=builder /var/task/cognitoBackend /var/task/cognitoBackend


# command to run on container start
CMD ["/var/task/cognitoBackend"]

EXPOSE 3000
