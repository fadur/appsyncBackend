package cmd

import (
	"fmt"

	"github.com/fadur/appDeck/internal/api"
	"github.com/spf13/cobra"
)

// initCmd represents the init command
func init() {
	rootCmd.AddCommand(ListTodosCmd)
}

// ListTodosCmd represents the listTodos command
var ListTodosCmd = &cobra.Command{
	Use:   "list",
	Short: "List all todos",
	Long:  `List all todos`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("listTodos called")
		api.GetTodos()
	},
}
