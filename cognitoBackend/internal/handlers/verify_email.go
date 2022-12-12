package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/fadur/cognitoBackend/internal/auth"
)

type VerifyEmailRequest struct {
	Username string `json:"username"`
	Code     string `json:"code"`
}

type VerifyEmailResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func VerifyEmail(w http.ResponseWriter, r *http.Request) {
	var req VerifyEmailRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(VerifyEmailResponse{
			Success: false,
			Message: "Invalid request",
		})
	}
	defer r.Body.Close()

	// Call the verify email function
	err = auth.ConfirmUser(req.Code, req.Username)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(VerifyEmailResponse{
			Success: false,
			Message: fmt.Sprintf("Error verifying email: %s", err.Error()),
		})
	}

	// Return the response
	json.NewEncoder(w).Encode(VerifyEmailResponse{
		Success: true,
		Message: "Email verified",
	})
	w.WriteHeader(http.StatusOK)
}
