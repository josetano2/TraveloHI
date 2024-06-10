package controllers

import (
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
	"gopkg.in/gomail.v2"
)

func GetAllUsers(c *fiber.Ctx) error {

	db := database.GetInstance()

	var users []models.User

	db.Preload("Users").Find(&users)

	return c.JSON(&users)

}

// BanUser godoc
// @Summary Ban User
// @Description Ban or unban a user based on their ID
// @Tags user
// @Accept  json
// @Produce  json
// @Param  id query int true "User ID"
// @Success 200 {object} models.User "User object showing updated ban status"
// @Failure 400 {string} string "Invalid ID provided"
// @Failure 404 {string} string "User not found"
// @Router /api/ban_user [put]
func BanUser(c *fiber.Ctx) error {

	db := database.GetInstance()

	id, _ := strconv.ParseInt(c.Query("id"), 10, 64)
	fmt.Println(id)

	var user models.User

	db.Where("id = ?", id).First(&user)

	db.Model(&user).Update("is_banned", !user.IsBanned)

	return c.JSON(&user)

}

func GetAllSubscribedUsers(c *fiber.Ctx) error {
	db := database.GetInstance()

	var users []models.User

	db.Preload("Users").Where("newsletter = ?", "true").Find(&users)

	return c.JSON(&users)
}

func SendNewsletter(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var users []models.User

	db.Preload("Users").Where("newsletter = ?", "true").Find(&users)

	for _, user := range users {
		// send email
		mail := gomail.NewMessage()

		mail.SetHeader("From", "josejonathan.tano@gmail.com")
		mail.SetHeader("To", user.Email)
		mail.SetHeader("Subject", data["title"])
		mail.SetBody("text/plain", data["message"])

		dialer := gomail.NewDialer("smtp.gmail.com", 587, "josejonathan.tano@gmail.com", "yqxn lxpv uqui pqqp")

		if err := dialer.DialAndSend(mail); err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed on sending newsletter to mail",
			})
		}

	}

	return c.JSON(fiber.Map{
		"message": "Newsletter sent",
	})

}

func GameReward(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]uint

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	if err := db.Model(&models.User{}).Where("id = ?", data["id"]).First(&user).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	if err := db.Model(&user).Update("wallet_amount", user.WalletAmount+100000).Error; err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Error updating",
		})
	}
	return c.JSON(fiber.Map{
		"message": "Reward has been sent",
	})
}

func ResetUser() {

	db := database.GetInstance()

	db.Model(&models.User{}).Where("is_logged_in = ?", true).Update("is_logged_in", false)

}
