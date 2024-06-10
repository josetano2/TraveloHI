package controllers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func GetAirlineAirplane(c *fiber.Ctx) error {

	db := database.GetInstance()

	airline := c.Query("airline")
	airline = fmt.Sprintf("%%%s%%", airline)

	var airplanes []models.Airplane

	if err := db.Model(&models.Airplane{}).
		Joins("join airlines on airplanes.airline_id = airlines.id").
		Where("airlines.name ilike ?", airline).
		Preload("Airline").
		Find(&airplanes).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch airplane",
		})
	}

	return c.JSON(&airplanes)

}
