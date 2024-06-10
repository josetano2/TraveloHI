package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func InsertPromo(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["code"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code must be filled!",
		})

	}

	var promotemp models.Promo
	if err := db.Where("code ilike ?", data["code"]).First(&promotemp).Error; err == nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code duplicate",
		})
	}

	floatPercentage, err := strconv.ParseFloat(data["percentage"], 64)

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing float",
		})
	}

	if floatPercentage <= 0 || floatPercentage >= 100 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo percentage must be 1-100!",
		})
	}

	sDate, errS := time.Parse("2006-01-02", data["startDate"])
	eDate, errE := time.Parse("2006-01-02", data["endDate"])

	if errS != nil || errE != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing start and end date",
		})
	}

	today := time.Now()

	if sDate.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Start date must happen after today",
		})
	}

	if eDate.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "End date must happen after today",
		})
	}

	if eDate.Before(sDate) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "End date must happen after start date",
		})
	}

	promo := models.Promo{
		Code:       data["code"],
		StartDate:  data["startDate"],
		EndDate:    data["endDate"],
		Image:      data["image"],
		Percentage: floatPercentage,
	}

	if err := db.Create(&promo).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to create promo",
		})
	}

	// buat promonya untuk setiap user yang udah pernah daftar
	var users []models.User

	if err := db.Find(&users).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error finding user",
		})
	}

	for _, user := range users {
		userPromo := models.UserPromo{
			UserID:  user.ID,
			PromoID: promo.ID,
		}
		if err := db.Create(&userPromo).Error; err != nil {
			return err
		}
	}

	return c.JSON(fiber.Map{
		"message": "Promo created",
	})

}

func GetAllPromos(c *fiber.Ctx) error {

	db := database.GetInstance()

	var promos []models.Promo

	today := time.Now()

	if err := db.Find(&promos).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error fetching promos",
		})
	}

	var activePromos []models.Promo

	for _, promo := range promos {
		startDate, errS := time.Parse("2006-01-02", promo.StartDate)

		if errS != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing start date",
			})
		}
		endDate, errE := time.Parse("2006-01-02", promo.EndDate)
		if errE != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing end date",
			})
		}

		if (today.After(startDate) || today.Equal(startDate)) && (today.Before(endDate) || today.Equal(endDate)) {
			activePromos = append(activePromos, promo)
		}

	}

	return c.JSON(&activePromos)

}

func UpdatePromo(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["code"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code must be filled!",
		})

	}

	floatPercentage, err := strconv.ParseFloat(data["percentage"], 64)

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing float",
		})
	}

	if floatPercentage <= 0 || floatPercentage >= 100 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo percentage must be 1-100!",
		})
	}

	sDate, errS := time.Parse("2006-01-02", data["startDate"])
	eDate, errE := time.Parse("2006-01-02", data["endDate"])

	if errS != nil || errE != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing start and end date",
		})
	}

	today := time.Now()

	if sDate.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Start date must happen after today",
		})
	}

	if eDate.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "End date must happen after today",
		})
	}

	if eDate.Before(sDate) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "End date must happen after start date",
		})
	}

	var promo models.Promo
	if err := db.Where("id = ?", data["id"]).First(&promo).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "Error fetching promo",
		})
	}

	if err := db.Model(&promo).
		Update("code", data["code"]).
		Update("start_date", data["startDate"]).
		Update("end_date", data["endDate"]).
		Update("image", data["image"]).
		Update("percentage", floatPercentage).
		Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "Error updating promo",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ActivePromos(c *fiber.Ctx) error {

	db := database.GetInstance()

	var promos []models.Promo

	db.Where("is_active = ?", true).Find(&promos)

	// if err := database.DB.Where("is_active = ?", true).Find(&promos); err != nil {
	// 	c.Status(fiber.StatusBadRequest)
	// 	return c.JSON(fiber.Map{
	// 		"message": "no active promos",
	// 	})
	// }

	return c.JSON(promos)

}
