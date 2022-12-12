package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fadur/cognitoBackend/internal/auth"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type RegisterResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	var user User

	// handles post request
	if r.Method == http.MethodPost {
		// decode json body
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(
				RegisterResponse{
					Success: false,
					Message: "Invalid JSON",
				},
			)
			return
		}
		// create user
		sub, err := auth.Register(user.Password, user.Email, user.Username)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(
				RegisterResponse{
					Success: false,
					Message: err.Error(),
				},
			)
			return
		}
		// return success
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(RegisterResponse{
			Success: true,
			Message: fmt.Sprintf("User created with sub: %s", sub),
		})
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(
			RegisterResponse{
				Success: false,
				Message: "Method not allowed",
			},
		)
	}

}
