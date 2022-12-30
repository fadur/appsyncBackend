package views

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"github.com/rivo/tview"
)

type LoginValues struct {
	username string
	password string
}

type LoginResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Token   string `json:"token"`
}

func (user *LoginValues) login() {
	fmt.Println("Login called")
	url := "https://hprq9svrac.eu-west-1.awsapprunner.com/login"
	method := "POST"

	// json payload
	payload := strings.NewReader(fmt.Sprintf(`{"username": "%s", "password": "%s"}`, user.username, user.password))
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
	var response LoginResponse
	json.Unmarshal(body, &response)

	if response.Success {
		fmt.Println("User logged in successfully")
		writeToken(response.Token)

	} else {
		fmt.Println("User login failed")
	}
}

func writeToken(token string) {
	// write token to file for future use saved in home directory
	homedir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println(err)
	}
	file, err := os.Create(homedir + "/.appDeck-token")
	if err != nil {
		fmt.Println(err)
	}
	defer file.Close()
	file.WriteString(token)
}

func Login() {
	app := tview.NewApplication()
	user := LoginValues{}
	form := tview.NewForm().
		AddInputField("Username", "", 20, nil, func(username string) {
			user.username = username
		}).
		AddPasswordField("Password", "", 20, '*', func(password string) {
			user.password = password
		}).
		AddButton("Login", func() {
			app.Stop()
		}).
		AddButton("Sign Up", func() {
			app.Stop()
		}).
		AddButton("Forgot Password", func() {
			app.Stop()
		}).
		AddButton("Cancel", func() {
			app.Stop()
		})

	if err := app.SetRoot(form, true).Run(); err != nil {
		panic(err)
	}
	user.login()
}
