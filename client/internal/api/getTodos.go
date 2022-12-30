package api

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"os"

	"github.com/machinebox/graphql"
)

// GetTodos represents the getTodos command
func GetTodos() {
	query := `query getTodos {
		getTodos {
			items {
				id
				title
			}
		}
	}`

	api_url := "https://ln3lmc3nmnfdzni32mgd3coyry.appsync-api.eu-west-1.amazonaws.com/graphql"
	host := "https://ln3lmc3nmnfdzni32mgd3coyry.appsync-api.eu-west-1.amazonaws.com"
	// api_id := "6d6rgqdjobbfbgoukubv7n7psi"
	// read the token from the file
	home, err := os.UserHomeDir()
	if err != nil {
		log.Fatal(err)
	}
	token, err := ioutil.ReadFile(home + "/.appDeck-token")

	// add the token to the header
	client := graphql.NewClient(api_url)

	// make the request
	req := graphql.NewRequest(query)
	req.Header.Set("Authorization", "Bearer "+string(token))
	req.Header.Set("Content-Type", "application/graphql")
	req.Header.Set("host", host)
	ctx := context.Background()

	var respData map[string]interface{}
	if err := client.Run(ctx, req, &respData); err != nil {
		log.Fatal(err)
	}
	fmt.Println(respData)

}
