package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func GetAllAirports(c *fiber.Ctx) error {

	db := database.GetInstance()

	var airports []models.Airport

	db.Preload("City").Find(&airports)

	return c.JSON(&airports)

}
