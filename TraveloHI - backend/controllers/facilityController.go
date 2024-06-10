package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

// Facility
// @Summary Show facility
// @Description get list of facility
// @Tags facility
// @Accept  json
// @Produce  json
// @Success 200 {array} models.Facility
// @Router /api/facility [get]
func Facility(c *fiber.Ctx) error {

	db := database.GetInstance()

	var facilities []models.Facility

	db.Find(&facilities)

	return c.JSON(&facilities)

}
