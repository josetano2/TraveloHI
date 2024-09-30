package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
	"github.com/joho/godotenv"
	"github.com/josetano2/travelohi/controllers"
	"github.com/josetano2/travelohi/database"
	_ "github.com/josetano2/travelohi/docs"
	"github.com/josetano2/travelohi/routes"
	"github.com/josetano2/travelohi/seeders"
)

// @title TraveloHI
// @version 1.0
// @description TraveloHI API
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8080
// @BasePath /
func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	database.Connect()
	seeders.Seeders()
	controllers.ResetUser()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		// frontend bisa menerima cookie dan bisa membalikkan cookie
		AllowOrigins: "http://localhost:5173",
		// AllowOrigins:     "*",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowCredentials: true,
	}))

	app.Get("/swagger/*", swagger.HandlerDefault)

	app.Get("/swagger/*", swagger.New(swagger.Config{ // custom
		URL:         "http://example.com/doc.json",
		DeepLinking: false,
		// Expand ("list") or Collapse ("none") tag groups by default
		DocExpansion: "none",
		// Prefill OAuth ClientId on Authorize popup
		OAuth: &swagger.OAuthConfig{
			AppName:  "OAuth Provider",
			ClientId: "21bb4edc-05a7-4afc-86f1-2e151e4ba6e2",
		},
		// Ability to change OAuth2 redirect uri location
		OAuth2RedirectUrl: "http://localhost:8080/swagger/oauth2-redirect.html",
	}))

	routes.Setup(app)

	app.Listen(":8080")
}
