package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

type CreditCardInput struct {
	SelectedBankName string
	UserID           uint
	Name             string
	Number           string
	CVV              string
	ExpiredMonth     string
	ExpiredYear      string
}

func GetAllBanks(c *fiber.Ctx) error {

	db := database.GetInstance()

	var banks []models.Bank

	if err := db.Find(&banks).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error fetching banks",
		})
	}

	return c.JSON(&banks)

}

func AddCreditCard(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data CreditCardInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.SelectedBankName == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Must select bank name!",
		})
	}

	if data.Name == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Card name must be filled!",
		})
	}

	if data.Number == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Card number must be filled!",
		})
	}

	if data.CVV == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "CVV must be filled!",
		})
	}

	if len(data.CVV) != 3 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "CVV must only consist 3 digit",
		})
	}

	if data.ExpiredMonth == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Expired month must be filled!",
		})
	}

	if data.ExpiredYear == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Expired year must be filled!",
		})
	}

	month, err := strconv.ParseInt(data.ExpiredMonth, 10, 64)

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing month",
		})
	}

	year, err := strconv.ParseInt(data.ExpiredYear, 10, 64)

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing year",
		})
	}

	if month < 1 || month > 12 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Choose a valid month",
		})
	}

	if year < 2000 || year > 2500 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Choose a valid year",
		})
	}

	// search bank id
	var bank models.Bank
	if err := db.Model(&models.Bank{}).Where("name ilike ?", data.SelectedBankName).First(&bank).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error finding bank",
		})
	}

	// insert
	creditCard := models.CreditCard{
		UserID:       data.UserID,
		BankID:       bank.ID,
		Name:         data.Name,
		Number:       data.Number,
		CVV:          data.CVV,
		ExpiredMonth: uint(month),
		ExpiredYear:  uint(year),
	}

	if err := db.Create(&creditCard).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error creating credit card",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Successfully add credit card",
	})

}
