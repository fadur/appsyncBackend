package auth

import (
	"fmt"

	aws "github.com/aws/aws-sdk-go/aws"
	session "github.com/aws/aws-sdk-go/aws/session"
	cognitoidentityprovider "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/fadur/cognitoBackend/internal/utils"
)

func Login(username string, password string) (string, error) {

	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(utils.GetEnv("AWS_DEFAULT_REGION", "eu-west-1")),
	}))

	cognitoClient := cognitoidentityprovider.New(sess)

	params := map[string]*string{
		"USERNAME": aws.String(username),
		"PASSWORD": aws.String(password),
	}
	fmt.Println(username, password)
	user, err := cognitoClient.InitiateAuth(&cognitoidentityprovider.InitiateAuthInput{
		AuthFlow:       aws.String("USER_PASSWORD_AUTH"),
		AuthParameters: params,
		ClientId:       aws.String(utils.GetEnv("COGNITO_CLIENT_ID", "")),
	})
	if err != nil {
		return "Error: ", err
	}
	fmt.Println(user)
	var token string
	token = *user.AuthenticationResult.AccessToken
	return token, nil
}
