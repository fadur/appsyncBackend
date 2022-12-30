package views

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/rivo/tview"
)

type SignUpValues struct {
	username string
	password string
	email    string
}

type SingUpResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// register method for signupvalues
func (user *SignUpValues) register() {
	fmt.Println("Register called")
	fmt.Println(user)

	url := "https://hprq9svrac.eu-west-1.awsapprunner.com/register"
	method := "POST"

	// json payload
	payload := strings.NewReader(fmt.Sprintf(`{"username": "%s", "password": "%s", "email": "%s"}`, user.username, user.password, user.email))
	req, err := http.NewRequest(method, url, payload)
	if err != nil {
		fmt.Println(err)
	}
	req.Header.Add("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println(err)
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		fmt.Println(err)
	}
	// unmarshal response
	var response SingUpResponse
	json.Unmarshal(body, &response)

	if response.Success {
		fmt.Println("User registered successfully")
		Verify(user.username)
	} else {
		fmt.Println("User registration failed")
	}
}

func SignUp() {
	app := tview.NewApplication()
	user := SignUpValues{}
	form := tview.NewForm().
		AddInputField("Username", "", 20, nil, func(text string) {
			user.username = text
		}).
		AddInputField("Email", "", 20, nil, func(text string) {
			user.email = text
		}).
		AddPasswordField("Password", "", 20, '*', func(text string) {
			user.password = text
		}).
		AddButton("Sign Up", func() {
			app.Stop()
		}).
		AddButton("Cancel", func() {
			app.Stop()
		})

	if err := app.SetRoot(form, true).Run(); err != nil {
		panic(err)
	}
	fmt.Println("Sign Up called")
	user.register()

}
