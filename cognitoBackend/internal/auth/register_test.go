package auth

import (
	"testing"

	aws "github.com/aws/aws-sdk-go/aws"
	cognitoidentityprovider "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider/cognitoidentityprovideriface"
)

type mockCognitoClient struct {
	cognitoidentityprovideriface.CognitoIdentityProviderAPI
}

type User struct {
	Username string
	Password string
	Email    string
}

// mock sign up response
func (m *mockCognitoClient) SignUp(input *cognitoidentityprovider.SignUpInput) (*cognitoidentityprovider.SignUpOutput, error) {
	return &cognitoidentityprovider.SignUpOutput{
		UserConfirmed: aws.Bool(true),
		UserSub:       aws.String("test-sub"),
	}, nil
}

func TestRegister(t *testing.T) {
	// create mock client
	mockClient := &mockCognitoClient{}
	// create mock user
	user := User{
		Username: "test-username",
		Password: "test-password",
		Email:    "test-email",
	}
	// register user
	sub, err := Register(mockClient, user.Password, user.Email, user.Username)
	if err != nil {
		t.Errorf("Error registering user: %s", err)
	}
	// check sub
	if sub != "test-sub" {
		t.Errorf("Expected sub to be test-sub, got %s", sub)
	}

}
