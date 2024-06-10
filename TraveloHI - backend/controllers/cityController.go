package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func City(c *fiber.Ctx) error {

	db := database.GetInstance()

	var cities []models.City

	db.Preload("Country").Find(&cities)

	return c.JSON(&cities)

}
