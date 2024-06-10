package controllers

import (
	"fmt"
	"regexp"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
	"github.com/josetano2/travelohi/util"
	"gopkg.in/gomail.v2"
)

func SendOTP(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["email"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email must be filled",
		})
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[com]{3}$`)

	if !emailRegex.MatchString(data["email"]) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email is not in the right format! ([email name]@[domain].com)",
		})
	}

	db.Where("email = ?", data["email"]).Delete(&models.OTP{})

	now := time.Now()
	err := db.Where("expires_at < ?", now).Delete(&models.OTP{}).Error
	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error removing otp",
		})
	}

	var user models.User
	if err := db.Where("email = ?", data["email"]).First(&user).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email not found",
		})
	}

	code, err := util.CreateOTP()

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "OTP failed",
		})
	}

	expirationTime := time.Now().Add(time.Minute * 10)

	otp := models.OTP{
		Email:     data["email"],
		OTP:       code,
		ExpiresAt: expirationTime,
	}

	mail := gomail.NewMessage()

	mail.SetHeader("From", "josejonathan.tano@gmail.com")
	mail.SetHeader("To", data["email"])
	mail.SetHeader("Subject", "TraveloHI Login OTP Code")

	body := fmt.Sprintf("Welcome to TraveloHI!\n\nYour OTP code is: %s\nPlease use this code to complete your login process.\n", code)
	mail.SetBody("text/plain", body)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "josejonathan.tano@gmail.com", "yqxn lxpv uqui pqqp")

	if err := dialer.DialAndSend(mail); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed on sending OTP to email",
		})
	}

	db.Create(&otp)
	return c.JSON(otp)
}

func VerifyOTP(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["otp"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "OTP must be filled",
		})
	}

	var otp models.OTP

	if err := db.Where("email = ? AND expires_at > ?", data["email"], time.Now()).First(&otp).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "OTP does not exist or expired",
		})
	}

	if otp.OTP != data["otp"] {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "OTP mismatch",
		})
	}

	if err := db.Delete(&models.OTP{}, "email = ?", data["email"]).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error deleting otp",
		})
	}

	var user models.User
	if err := db.Where("email = ?", data["email"]).First(&user).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.StandardClaims{
		Issuer:    strconv.Itoa(int(user.ID)),
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(SecretKey))

	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Could not login",
		})
	}

	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	return c.JSON(fiber.Map{
		"message": "Success",
	})

}
