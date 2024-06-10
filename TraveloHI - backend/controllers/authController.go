package controllers

import (
	"regexp"
	"strconv"
	"time"
	"unicode"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

const SecretKey = "secret"

func Register(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["firstName"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "First name must be filled",
		})
	}

	if data["lastName"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Last name must be filled",
		})
	}

	if data["dob"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Date of birth must be filled",
		})
	}

	if data["email"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email must be filled",
		})
	}

	if data["gender"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Gender must be filled",
		})
	}

	if data["password"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password must be filled",
		})
	}

	if data["confirmPassword"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Confirm password must be filled",
		})
	}

	if data["answer"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Answer must be filled",
		})
	}

	if data["pfp"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Must upload a profile picture",
		})
	}

	nameRegex := regexp.MustCompile(`^[a-zA-Z]{6,}$`)

	if !nameRegex.MatchString(data["firstName"]) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "First name must only consist of letters and must be more than 5 characters long",
		})
	}

	if !nameRegex.MatchString(data["lastName"]) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Last name must only consist of letters and must be more than 5 characters long",
		})
	}

	if !is13YearsOld(data["dob"]) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Must be at least 13 years old",
		})
	}

	if data["gender"] != "Male" && data["gender"] != "Female" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Gender must be between male or female",
		})
	}

	if len(data["password"]) < 8 || len(data["password"]) > 30 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password must be between 8-30 characters long",
		})
	}

	if !isPasswordValid(data["password"]) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password must atleast contain 1 lowercase, 1 uppercase, 1 number, and 1 special character",
		})
	}

	if data["password"] != data["confirmPassword"] {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password and confirm password must be the same",
		})
	}

	var user models.User
	if err := db.Where("email = ?", data["email"]).First(&user).Error; err == nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email duplicate",
		})
	}

	password, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 14)

	user = models.User{
		FirstName:      data["firstName"],
		LastName:       data["lastName"],
		Email:          data["email"],
		DOB:            data["dob"],
		Gender:         data["gender"],
		Password:       password,
		Question:       data["question"],
		Answer:         data["answer"],
		ProfilePicture: data["pfp"],
		Newsletter:     data["newsletter"],
	}

	mail := gomail.NewMessage()

	mail.SetHeader("From", "josejonathan.tano@gmail.com")
	mail.SetHeader("To", data["email"])
	mail.SetHeader("Subject", "Succesfully registered to TraveloHI")
	mail.SetBody("text/plain", "Your email has been succesfully registered!")

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "josejonathan.tano@gmail.com", "yqxn lxpv uqui pqqp")

	if err := dialer.DialAndSend(mail); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email fail",
		})
	}

	db.Create(&user)

	return c.JSON(user)
}

func Login(c *fiber.Ctx) error {

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

	if data["password"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password must be filled",
		})
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[com]{3}$`)

	if !emailRegex.MatchString(data["email"]) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email is not in the right format! ([email name]@[domain].com)",
		})
	}

	var user models.User

	db.Where("email = ?", data["email"]).First(&user)

	if user.IsLoggedIn {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "User is already logged in",
		})
	}

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	if user.IsBanned {
		c.Status(fiber.StatusMethodNotAllowed)
		return c.JSON(fiber.Map{
			"message": "User is banned",
		})
	}

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["password"])); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Incorrect password",
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

	db.Model(&user).Update("is_logged_in", true)

	return c.JSON(fiber.Map{
		"message": "Success",
	})

}

func User(c *fiber.Ctx) error {

	db := database.GetInstance()

	cookie := c.Cookies("jwt")

	token, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Not authenticated",
		})
	}

	claims := token.Claims.(*jwt.StandardClaims)

	var user models.User
	db.Where("id = ?", claims.Issuer).First(&user)

	return c.JSON(user)
}

func Logout(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// remove cookie
	cookie := fiber.Cookie{
		Name:     "jwt",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		HTTPOnly: true,
	}

	c.Cookie(&cookie)

	var user models.User

	db.Where("email = ?", data["email"]).First(&user)
	db.Model(&user).Update("is_logged_in", false)

	return c.JSON(fiber.Map{
		"message": "logout",
	})

}

// Question godoc
// @Summary Show question
// @Description get question based on user email
// @Tags question
// @Accept  json
// @Produce  json
// @Param  email body string true "User Email"
// @Success 200 {object} map[string]interface{} "Returns the user's question"
// @Failure 400 {object} map[string]string "Email must be filled / Email is not in the right format"
// @Failure 404 {object} map[string]string "User not found"
// @Failure 405 {object} map[string]string "User is banned"
// @Router /api/question [post]
func Question(c *fiber.Ctx) error {

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

	var user models.User

	db.Where("email = ?", data["email"]).First(&user)

	if user.ID == 0 {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	if user.IsBanned {
		c.Status(fiber.StatusMethodNotAllowed)
		return c.JSON(fiber.Map{
			"message": "User is banned",
		})
	}

	return c.JSON(fiber.Map{
		"Question": user.Question,
	})
}

func Answer(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["answer"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Answer must be filled",
		})
	}

	var user models.User

	db.Where("email = ?", data["email"]).First(&user)
	answer := data["answer"]

	if answer != user.Answer {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Wrong answer",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func ChangePassword(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data["newPassword"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password must be filled",
		})
	}

	if data["confNewPassword"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Confirm password must be filled",
		})
	}

	if !isPasswordValid(data["newPassword"]) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password must atleast contain 1 lowercase, 1 uppercase, 1 number, and 1 special character",
		})
	}

	if len(data["newPassword"]) < 8 || len(data["newPassword"]) > 30 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password must be between 8-30 characters long",
		})
	}

	if data["newPassword"] != data["confNewPassword"] {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Password and confirm password must be the same",
		})
	}

	var user models.User

	db.Where("email = ?", data["email"]).First(&user)

	if err := bcrypt.CompareHashAndPassword(user.Password, []byte(data["newPassword"])); err == nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "New password cannot be the same as the previous password",
		})
	}

	newPassword, _ := bcrypt.GenerateFromPassword([]byte(data["newPassword"]), 14)

	db.Model(&user).Update("password", newPassword)

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func UpdateProfile(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data map[string]string

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	var user models.User
	if err := db.Where("id = ?", data["id"]).First(&user).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error finding user",
		})
	}

	if data["firstName"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "First name must be filled",
		})
	}

	if data["lastName"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Last name must be filled",
		})
	}

	if data["dob"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Date of birth must be filled",
		})
	}

	if data["email"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Email must be filled",
		})
	}

	if data["phoneNumber"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Phone number must be filled",
		})
	}
	if data["address"] == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Address must be filled",
		})
	}

	if err := db.Model(&user).
		Update("first_name", data["firstName"]).
		Update("last_name", data["lastName"]).
		Update("email", data["email"]).
		Update("dob", data["dob"]).
		Update("profile_picture", data["pfp"]).
		Update("address", data["address"]).
		Update("phone_number", data["phoneNumber"]).
		Update("newsletter", data["newsletter"]).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error Updating",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func is13YearsOld(dob string) bool {

	newDob, err := time.Parse("2006-01-02", dob)

	if err != nil {
		return false
	}

	today := time.Now()

	yearDiff := today.Year() - newDob.Year()

	if today.YearDay() < newDob.AddDate(yearDiff, 0, 0).YearDay() {
		yearDiff--
	}

	if yearDiff < 13 {
		return false
	}
	return true

}

func isPasswordValid(password string) bool {

	lowerChecker := false
	upperChecker := false
	numberChecker := false
	specialChecker := false

	for _, p := range password {
		if unicode.IsLower(p) {
			lowerChecker = true
		}
		if unicode.IsUpper(p) {
			upperChecker = true
		}
		if unicode.IsNumber(p) {
			numberChecker = true
		}
		if unicode.IsPunct(p) || unicode.IsSymbol(p) {
			specialChecker = true
		}
	}

	if lowerChecker && upperChecker && numberChecker && specialChecker {
		return true
	}
	return false
}
