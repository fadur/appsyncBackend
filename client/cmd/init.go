package cmd

import (
	"fmt"

	view "github.com/fadur/appDeck/internal/views"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(initCmd)
}

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Initialize the project",
	Long:  `Initialize the project`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("init called")
		view.SignUp()
	},
}
