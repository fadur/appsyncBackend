package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/fadur/cognitoBackend/internal/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Post("/register", handlers.Register)
	r.Post("/verify-email", handlers.VerifyEmail)
	r.Post("/login", handlers.Login)

	fmt.Println("Listening on port 3000")
	err := http.ListenAndServe(":3000", r)
	if err != nil {
		log.Fatal(err)
	}
}
