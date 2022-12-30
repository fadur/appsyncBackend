package cmd

import (
	"github.com/fadur/appDeck/internal/views"
	"github.com/spf13/cobra"
)

// initCmd represents the init command
func init() {
	rootCmd.AddCommand(LoginCmd)
}

// LoginCmd represents the login command
var LoginCmd = &cobra.Command{
	Use:   "login",
	Short: "Login to your account",
	Long:  `Login to your account`,
	Run: func(cmd *cobra.Command, args []string) {
		views.Login()
	},
}
