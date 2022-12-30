package auth

import (
	"fmt"

	aws "github.com/aws/aws-sdk-go/aws"
	session "github.com/aws/aws-sdk-go/aws/session"
	cognitoidentityprovider "github.com/aws/aws-sdk-go/service/cognitoidentityprovider"
	"github.com/fadur/cognitoBackend/internal/utils"
)

func Register(password string, email string, username string) (*string, error) {

	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(utils.GetEnv("AWS_DEFAULT_REGION", "eu-west-1")),
	}))

	svc := cognitoidentityprovider.New(sess)

	// cognito signup input struct
	input := &cognitoidentityprovider.SignUpInput{
		ClientId: aws.String(utils.GetEnv("COGNITO_CLIENT_ID", "")),
		Password: aws.String(password),
		Username: aws.String(username),
		UserAttributes: []*cognitoidentityprovider.AttributeType{
			{
				Name:  aws.String("email"),
				Value: aws.String(email),
			},
		},
	}

	// cognito signup output struct
	result, err := svc.SignUp(input)
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	return result.UserSub, nil
}

func ConfirmUser(code string, username string) error {

	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String("eu-west-1"),
	}))

	svc := cognitoidentityprovider.New(sess)

	fmt.Println("Confirming user")
	fmt.Println(code)
	fmt.Println(username)
	fmt.Println(utils.GetEnv("COGNITO_CLIENT_ID", ""))

	input := &cognitoidentityprovider.ConfirmSignUpInput{
		ConfirmationCode: aws.String(code),
		ClientId:         aws.String(utils.GetEnv("COGNITO_CLIENT_ID", "")),
		Username:         aws.String(username),
	}

	_, err := svc.ConfirmSignUp(input)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}
