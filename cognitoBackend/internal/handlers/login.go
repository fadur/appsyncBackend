package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fadur/cognitoBackend/internal/auth"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Token   string `json:"token"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		fmt.Println("Error decoding request: req was %v", r.Body)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LoginResponse{
			Success: false,
			Message: "Invalid request",
			Token:   "",
		})
		return
	}
	defer r.Body.Close()

	// Call the login function
	token, err := auth.Login(req.Username, req.Password)
	fmt.Println(token)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(LoginResponse{
			Success: false,
			Message: fmt.Sprintf("Error logging in: %s", err.Error()),
			Token:   "",
		})
		return
	}

	// Return the response
	json.NewEncoder(w).Encode(LoginResponse{
		Success: true,
		Message: "Logged in",
		Token:   token,
	})
	w.WriteHeader(http.StatusOK)
	return
}
