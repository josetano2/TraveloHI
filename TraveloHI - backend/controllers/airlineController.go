package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func GetAllAirlines(c *fiber.Ctx) error {

	db := database.GetInstance()

	var airlines []models.Airline

	db.Find(&airlines)

	return c.JSON(&airlines)

}


