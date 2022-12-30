package views

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/rivo/tview"
)

type Verification struct {
	code     string
	username string
}

func (user *Verification) verify() {
	fmt.Println("Verify called")
	fmt.Println(user)
	url := "https://hprq9svrac.eu-west-1.awsapprunner.com/verify-email"
	method := "POST"

	// json payload
	payload := strings.NewReader(fmt.Sprintf(`{"username": "%s", "code": "%s"}`, user.username, user.code))
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
	fmt.Println(string(body))
}

func Verify(username string) {
	user := Verification{}
	user.username = username
	app := tview.NewApplication()
	form := tview.NewForm().
		AddInputField("Verification Code", "", 6, nil, func(text string) {
			user.code = text
		}).
		AddButton("Verify", func() {
			app.Stop()
		})
	if err := app.SetRoot(form, true).Run(); err != nil {
		panic(err)
	}
	user.verify()
}
