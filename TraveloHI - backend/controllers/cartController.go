package controllers

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
	"gopkg.in/gomail.v2"
)

type FlightCartInput struct {
	SelectedSeats []models.Seat
	ExtraBaggage  float64
	UserID        uint
}

type HotelCartInput struct {
	SelectedRoom models.RoomDetail
	CheckInDate  string
	CheckOutDate string
	UserID       uint
}

type UpdateDateInput struct {
	CheckInDate  string
	CheckOutDate string
	CartID       uint
}

type CheckPromoInput struct {
	UserID         uint
	PromoCode      string
	TotalCartPrice float64
}

type TransactionInput struct {
	CartID         uint
	UserID         uint
	PromoCode      string
	TotalCartPrice float64
	PaymentMethod  string
}

type TransactionCreditCardInput struct {
	CartID           uint
	UserID           uint
	PromoCode        string
	TotalCartPrice   float64
	PaymentMethod    string
	SelectedBankName string
	Name             string
	Number           string
	CVV              string
	ExpiredMonth     string
	ExpiredYear      string
}

type ActiveTickets struct {
	HotelCarts  []models.HotelCart
	FlightCarts []models.FlightCart
}

type HotelReviewInput struct {
	HotelID           uint
	UserID            uint
	Cleanliness       string
	CleanlinessRating string
	Comfort           string
	ComfortRating     string
	Location          string
	LocationRating    string
	Service           string
	ServicenRating    string
	IsAnonymous       bool
}

func AddFlightToCart(c *fiber.Ctx) error {
	// FLOW
	// 1. dapetin semua info dari frontend
	// 2. bikin tiketnya
	// 3. tiket kalo udah jadi, buat cart
	// kondisi
	// kalo cart belum pernah kebuat, buat cart
	// kalo cart udah ada, append datanya aja
	// kalo user dah cart, mark cart sebagai paid, lalu buat cart baru

	db := database.GetInstance()

	var data FlightCartInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	cookie := c.Cookies("jwt")

	_, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Not authenticated",
		})
	}

	if len(data.SelectedSeats) <= 0 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Must choose a seat",
		})
	}

	var tickets []models.Ticket

	for _, seat := range data.SelectedSeats {
		if !seat.IsAvailable {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Must choose an available seat",
			})
		}

		ticket := models.Ticket{
			SeatID:        seat.ID,
			BaggageWeight: data.ExtraBaggage,
		}

		if err := db.Create(&ticket).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to create ticket",
			})
		}

		tickets = append(tickets, ticket)

		// mark seat jadi not available
		// db.Model(&user).Update("password", newPassword)
		if err := db.Model(&models.Seat{}).Where("id = ?", seat.ID).Update("is_available", false).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Failed to update seat",
			})
		}

	}

	// ticket dah dibuat, sekarang masukin ke cart/buat cart
	// cari cart dolo dari user
	// kalo cart ga exist (?)
	var cart models.Cart
	if err := db.Model(&models.Cart{}).Where("user_id = ? and status = ?", data.UserID, "Unpaid").First(&cart).Error; err != nil {
		cart = models.Cart{
			UserID: data.UserID,
			Status: "Unpaid",
		}
		if err := db.Create(&cart).Error; err != nil {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"message": "Failed to create a new cart",
			})
		}
	}

	for _, ticket := range tickets {
		// add to cart buat tiketnya
		flightCart := models.FlightCart{
			TicketID: ticket.ID,
			CartID:   cart.ID,
		}
		if err := db.Create(&flightCart).Error; err != nil {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"message": "Failed to add ticket to cart",
			})
		}
	}

	// cart dah dicari

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func GetCart(c *fiber.Ctx) error {

	db := database.GetInstance()

	id := c.Query("id")

	var cart models.Cart
	if err := db.Model(&models.Cart{}).
		Where("user_id = ? and status = ?", id, "Unpaid").
		Preload("HotelCarts").
		Preload("HotelCarts.Hotel").
		Preload("HotelCarts.RoomDetail").
		Preload("FlightCarts").
		Preload("FlightCarts.Ticket").
		Preload("FlightCarts.Ticket").
		Preload("FlightCarts.Ticket.Seat").
		Preload("FlightCarts.Ticket.Seat.Flight").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City.Country").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City.Country").
		Preload("FlightCarts.Ticket.Seat.Flight.Airline").
		Preload("FlightCarts.Ticket.Seat.Flight.Airplane").
		First(&cart).Error; err != nil {
		return c.JSON(fiber.Map{
			"message": "No Cart",
		})
	}

	return c.JSON(&cart)
}

func AddHotelToCart(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data HotelCartInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	cookie := c.Cookies("jwt")

	_, err := jwt.ParseWithClaims(cookie, &jwt.StandardClaims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})

	if err != nil {
		c.Status(fiber.StatusUnauthorized)
		return c.JSON(fiber.Map{
			"message": "Not authenticated",
		})
	}

	if data.CheckInDate == "" {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Must fill check in date",
		})
	}

	if data.CheckOutDate == "" {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Must fill check out date",
		})
	}

	checkIn, err := time.Parse("2006-01-02", data.CheckInDate)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Error parsing check in date",
		})
	}

	checkOut, err := time.Parse("2006-01-02", data.CheckOutDate)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Error parsing check out date",
		})
	}

	today := time.Now()

	if checkIn.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check in must happen after today",
		})
	}

	if checkOut.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check Out must happen after today",
		})
	}

	if checkOut.Before(checkIn) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check Out must happen after check in",
		})
	}

	// capacity validation !!!

	// create reservation
	var cart models.Cart
	if err := db.Model(&models.Cart{}).Where("user_id = ? and status = ?", data.UserID, "Unpaid").First(&cart).Error; err != nil {
		cart = models.Cart{
			UserID: data.UserID,
			Status: "Unpaid",
		}
		if err := db.Create(&cart).Error; err != nil {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"message": "Failed to create a new cart",
			})
		}
	}

	hotelCart := models.HotelCart{
		CartID:       cart.ID,
		HotelID:      data.SelectedRoom.HotelID,
		RoomDetailID: data.SelectedRoom.ID,
		CheckInDate:  data.CheckInDate,
		CheckOutDate: data.CheckOutDate,
	}

	if err := db.Create(&hotelCart).Error; err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Failed to adding hotel to cart",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func UpdateReservationDate(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data UpdateDateInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.CheckInDate == "" {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Must fill check in date",
		})
	}

	if data.CheckOutDate == "" {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Must fill check out date",
		})
	}

	checkIn, err := time.Parse("2006-01-02", data.CheckInDate)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Error parsing check in date",
		})
	}

	checkOut, err := time.Parse("2006-01-02", data.CheckOutDate)
	if err != nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(fiber.Map{
			"message": "Error parsing check out date",
		})
	}

	today := time.Now()

	if checkIn.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check in must happen after today",
		})
	}

	if checkOut.Before(today) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check Out must happen after today",
		})
	}

	if checkOut.Before(checkIn) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Check Out must happen after check in",
		})
	}

	// cari cart lalu update
	if err := db.Model(&models.HotelCart{}).
		Where("cart_id = ?", data.CartID).
		Update("check_in_date", data.CheckInDate).
		Update("check_out_date", data.CheckOutDate).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error updating",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})

}

// RemoveHotelFromCart godoc
// @Summary Remove Hotel from Cart
// @Description Deletes a hotel from the user's cart based on the hotel cart ID
// @Tags cart
// @Accept  json
// @Produce  json
// @Param  id query string true "Hotel Cart ID"
// @Success 200 {object} map[string]string "message: success"
// @Failure 400 {object} map[string]string "message: Error deleting hotel"
// @Router /api/remove_hotel_from_cart [delete]
func RemoveHotelFromCart(c *fiber.Ctx) error {

	db := database.GetInstance()

	id := c.Query("id")

	if err := db.Delete(&models.HotelCart{}, id).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error deleting hotel",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func RemoveFlightFromCart(c *fiber.Ctx) error {

	db := database.GetInstance()

	flightCartId := c.Query("flight_cart_id")
	ticketId := c.Query("ticket_id")
	seatId := c.Query("seat_id")

	// fmt.Println(flightCartId)
	// fmt.Println(ticketId)
	// fmt.Println(seatId)

	// cari seat, ubah jadi available
	if err := db.Model(&models.Seat{}).Where("id = ?", seatId).Update("is_available", true).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error updating seat",
		})
	}

	// delete cart
	if err := db.Delete(&models.FlightCart{}, flightCartId).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error deleting flight cart",
		})
	}

	// delete tiket
	if err := db.Delete(&models.Ticket{}, ticketId).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error deleting ticket",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func CheckPromo(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data CheckPromoInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.PromoCode == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Fill in promo code field",
		})
	}

	var promo models.Promo
	if err := db.Model(&models.Promo{}).Where("code ilike ?", data.PromoCode).First(&promo).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code does not exist!",
		})
	}

	// promo dah dapet, cek avaibility
	// promonya expired ato blom
	sDate, errS := time.Parse("2006-01-02", promo.StartDate)
	eDate, errE := time.Parse("2006-01-02", promo.EndDate)

	if errS != nil || errE != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing start and end date",
		})
	}

	today := time.Now()

	if today.Before(sDate) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code is not active",
		})
	}

	if today.After(eDate) {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code expired",
		})
	}

	var userPromo models.UserPromo
	if err := db.Model(&models.UserPromo{}).Where("promo_id = ? and user_id = ?", promo.ID, data.UserID).First(&userPromo).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code is not available",
		})
	}

	if userPromo.IsUsed {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Promo code has been used",
		})
	}

	finalPrice := (100 - promo.Percentage) / 100 * data.TotalCartPrice

	return c.JSON(fiber.Map{
		"price":   finalPrice,
		"message": "Promo code valid",
	})
}

func PayWithWallet(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data TransactionInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.PaymentMethod != "HI-Wallet" && data.PaymentMethod != "Credit Card" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Choose a valid method",
		})
	}

	// cari cart
	var cart models.Cart
	if err := db.Model(&models.Cart{}).
		Where("id = ? and status = ?", data.CartID, "Unpaid").
		Preload("HotelCarts").
		Preload("HotelCarts.Hotel").
		Preload("HotelCarts.RoomDetail").
		Preload("FlightCarts").
		Preload("FlightCarts.Ticket").
		Preload("FlightCarts.Ticket.Seat").
		Preload("FlightCarts.Ticket.Seat.Flight").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute").
		Preload("FlightCarts.Ticket.Seat.Flight.Airline").
		Preload("FlightCarts.Ticket.Seat.Flight.Airplane").
		Preload("HotelCarts").
		First(&cart).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "No Cart",
		})
	}

	// validate user
	var user models.User
	if err := db.Model(&models.User{}).Where("id = ?", data.UserID).First(&user).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	// validate expired
	currentTime := time.Now()

	// hotel
	for _, hotelCart := range cart.HotelCarts {
		checkIn, err := time.Parse("2006-01-02", hotelCart.CheckInDate)

		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing check in date",
			})
		}
		if currentTime.After(checkIn) {

			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Cannot check out expired hotel reservation",
			})

		}
	}

	// flight
	for _, flightCart := range cart.FlightCarts {
		// validate flight
		departureTime := flightCart.Ticket.Seat.Flight.DepartureTime

		if currentTime.After(departureTime) {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Cannot check out expired flight",
			})
		}
	}

	// promo validation
	var percentage float64
	var promo models.Promo

	if data.PromoCode != "" {
		if err := db.Model(&models.Promo{}).Where("code ilike ?", data.PromoCode).First(&promo).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code does not exist!",
			})
		}

		// promo dah dapet, cek avaibility
		// promonya expired ato blom
		sDate, errS := time.Parse("2006-01-02", promo.StartDate)
		eDate, errE := time.Parse("2006-01-02", promo.EndDate)

		if errS != nil || errE != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing start and end date",
			})
		}

		today := time.Now()

		if today.Before(sDate) {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code is not active",
			})
		}

		if today.After(eDate) {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code expired",
			})
		}

		var userPromo models.UserPromo
		if err := db.Model(&models.UserPromo{}).Where("promo_id = ? and user_id = ?", promo.ID, data.UserID).First(&userPromo).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code is not available",
			})
		}

		if userPromo.IsUsed {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code has been used",
			})
		}
		percentage = promo.Percentage
	} else {
		percentage = 0
	}

	finalPrice := (100 - percentage) / 100 * data.TotalCartPrice
	// deduct wallet

	if user.WalletAmount < finalPrice {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Wallet not enough!",
		})
	}

	if err := db.Model(&models.User{}).
		Where("id = ?", data.UserID).
		Update("wallet_amount", user.WalletAmount-finalPrice).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error deducting price",
		})
	}

	if err := db.Model(&models.UserPromo{}).
		Where("promo_id = ? and user_id = ?", promo.ID, data.UserID).
		Update("is_used", true).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error updating promo code",
		})
	}

	// udah checkout, mark cart sebagai paid
	if err := db.Model(&models.Cart{}).Where("id = ?", data.CartID).Update("status", "Paid").Update("transaction_date", currentTime).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error updating cart",
		})
	}

	mail := gomail.NewMessage()

	mail.SetHeader("From", "josejonathan.tano@gmail.com")
	mail.SetHeader("To", user.Email)
	mail.SetHeader("Subject", "TraveloHI Invoice")

	var itemsSummary strings.Builder
	for _, hotelCart := range cart.HotelCarts {
		itemsSummary.WriteString(fmt.Sprintf("Hotel: %s, Room: %s, Check-in: %s, Check-out: %s\n", hotelCart.Hotel.Name, hotelCart.RoomDetail.Name, hotelCart.CheckInDate, hotelCart.CheckOutDate))
	}
	for _, flightCart := range cart.FlightCarts {
		itemsSummary.WriteString(fmt.Sprintf("Flight: %s, Seat: %s, Departure: %s\n", flightCart.Ticket.Seat.Flight.Code, flightCart.Ticket.Seat.Code, flightCart.Ticket.Seat.Flight.DepartureTime))
	}
	body := fmt.Sprintf("Thank you for using TraveloHI!\n\nHere is the summary of your purchased items:\n\n%s\nTotal Price: %.2f", itemsSummary.String(), finalPrice)
	mail.SetBody("text/plain", body)

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "josejonathan.tano@gmail.com", "yqxn lxpv uqui pqqp")

	if err := dialer.DialAndSend(mail); err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed on sending OTP to email",
		})
	}

	return c.JSON(fiber.Map{
		"message": "success",
	})
}

func PayWithCreditCard(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data TransactionCreditCardInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.PaymentMethod != "HI-Wallet" && data.PaymentMethod != "Credit Card" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Choose a valid method",
		})
	}

	// cari cart
	var cart models.Cart
	if err := db.Model(&models.Cart{}).
		Where("id = ? and status = ?", data.CartID, "Unpaid").
		Preload("HotelCarts").
		Preload("HotelCarts.Hotel").
		Preload("HotelCarts.RoomDetail").
		Preload("FlightCarts").
		Preload("FlightCarts.Ticket").
		Preload("FlightCarts.Ticket.Seat").
		Preload("FlightCarts.Ticket.Seat.Flight").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute").
		Preload("FlightCarts.Ticket.Seat.Flight.Airline").
		Preload("FlightCarts.Ticket.Seat.Flight.Airplane").
		Preload("HotelCarts").
		First(&cart).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "No Cart",
		})
	}

	// validate user
	var user models.User
	if err := db.Model(&models.User{}).Where("id = ?", data.UserID).First(&user).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "User not found",
		})
	}

	// validate expired
	currentTime := time.Now()

	// hotel
	for _, hotelCart := range cart.HotelCarts {
		checkIn, err := time.Parse("2006-01-02", hotelCart.CheckInDate)

		if err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing check in date",
			})
		}
		if currentTime.After(checkIn) {

			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Cannot check out expired hotel reservation",
			})

		}
	}

	// flight
	for _, flightCart := range cart.FlightCarts {
		// validate flight
		departureTime := flightCart.Ticket.Seat.Flight.DepartureTime

		if currentTime.After(departureTime) {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Cannot check out expired flight",
			})
		}
	}

	// validate credit card
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

	// validate credit card exist ato ga
	var creditCard models.CreditCard
	if err := db.Model(&models.CreditCard{}).
		Where("user_id = ? and bank_id = ? and name ilike ? and number = ? and cvv = ? and expired_month = ? and expired_year = ?", data.UserID, bank.ID, data.Name, data.Number, data.CVV, data.ExpiredMonth, data.ExpiredYear).
		First(&creditCard).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Credit card not found!",
		})
	}

	if data.PromoCode != "" {
		var promo models.Promo
		if err := db.Model(&models.Promo{}).Where("code ilike ?", data.PromoCode).First(&promo).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code does not exist!",
			})
		}

		// promo dah dapet, cek avaibility
		// promonya expired ato blom
		sDate, errS := time.Parse("2006-01-02", promo.StartDate)
		eDate, errE := time.Parse("2006-01-02", promo.EndDate)

		if errS != nil || errE != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error parsing start and end date",
			})
		}

		today := time.Now()

		if today.Before(sDate) {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code is not active",
			})
		}

		if today.After(eDate) {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code expired",
			})
		}

		var userPromo models.UserPromo
		if err := db.Model(&models.UserPromo{}).Where("promo_id = ? and user_id = ?", promo.ID, data.UserID).First(&userPromo).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code is not available",
			})
		}

		if userPromo.IsUsed {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Promo code has been used",
			})
		}

		if err := db.Model(&models.UserPromo{}).
			Where("promo_id = ? and user_id = ?", promo.ID, data.UserID).
			Update("is_used", true).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "Error updating promo code",
			})
		}
	}

	return c.JSON(fiber.Map{
		"message": "Success",
	})
}

func GetAllActiveTickets(c *fiber.Ctx) error {

	db := database.GetInstance()

	// butuh user id
	id := c.Query("id")
	search := c.Query("search")
	search = fmt.Sprintf("%%%s%%", search)

	active := c.Query("active")

	// cari cart user yang paid
	var carts []models.Cart
	// filter based on hotel name, airline name, or flight code

	today := time.Now()

	var activeTickets ActiveTickets

	if active == "hotels" {
		// cari cart user yang paid
		if err := db.Model(&models.Cart{}).
			Joins("join hotel_carts on hotel_carts.cart_id = carts.id").
			Joins("join room_details on hotel_carts.room_detail_id = room_details.id").
			Joins("join hotels on room_details.hotel_id = hotels.id").
			Where("carts.user_id = ? and carts.status = ? and hotels.name ilike ?", id, "Paid", search).
			Where("hotel_carts.deleted_at is null").
			Preload("HotelCarts").
			Preload("HotelCarts.Hotel").
			Preload("HotelCarts.RoomDetail").
			Order("transaction_date desc").
			Find(&carts).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "User has no transaction",
			})
		}

		for _, cart := range carts {

			// iterate hotel cart
			for _, hotelCart := range cart.HotelCarts {
				// cek check in date
				checkIn, err := time.Parse("2006-01-02", hotelCart.CheckInDate)

				if err != nil {
					c.Status(fiber.StatusBadRequest)
					return c.JSON(fiber.Map{
						"message": "Error parsing check in date",
					})
				}

				if today.Before(checkIn) || today.Equal(checkIn) {
					activeTickets.HotelCarts = append(activeTickets.HotelCarts, hotelCart)
				}
			}
		}
	} else {
		if err := db.Model(&models.Cart{}).
			Joins("join flight_carts on flight_carts.cart_id = carts.id").
			Joins("join tickets on flight_carts.ticket_id = tickets.id").
			Joins("join seats on tickets.seat_id = seats.id").
			Joins("join flights on seats.flight_id = flights.id").
			Joins("join airlines on flights.airline_id = airlines.id").
			Where("carts.user_id = ? and carts.status = ?", id, "Paid").
			Where("airlines.name ilike ? or flights.code ilike ?", search, search).
			Where("flight_carts.deleted_at is null").
			Group("carts.id").
			Preload("FlightCarts").
			Preload("FlightCarts.Ticket").
			Preload("FlightCarts.Ticket.Seat").
			Preload("FlightCarts.Ticket.Seat.Flight").
			Preload("FlightCarts.Ticket.Seat.Flight.Airline").
			Preload("FlightCarts.Ticket.Seat.Flight.Airplane").
			Preload("FlightCarts.Ticket.Seat.Flight.Airplane.Airline").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City.Country").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City.Country").
			Order("transaction_date desc").
			Find(&carts).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "User has no transaction",
			})
		}
		for _, cart := range carts {
			// iterate flight cart flight
			for _, flightCart := range cart.FlightCarts {
				// cek departure date
				departureDate := flightCart.Ticket.Seat.Flight.DepartureTime.Truncate(24 * time.Hour)

				if today.Before(departureDate) || today.Equal(departureDate) {
					activeTickets.FlightCarts = append(activeTickets.FlightCarts, flightCart)
				}
			}
		}
	}

	return c.JSON(&activeTickets)

}

func GetAllHistory(c *fiber.Ctx) error {

	db := database.GetInstance()

	// butuh user id
	id := c.Query("id")
	search := c.Query("search")
	search = fmt.Sprintf("%%%s%%", search)

	active := c.Query("active")
	// offset, _ := strconv.Atoi(c.Query("offset"))
	// limit, _ := strconv.Atoi(c.Query("limit"))

	// var totalItems int64

	// filter based on hotel name, airline name, or flight code
	var carts []models.Cart
	if active == "hotels" {
		if err := db.Model(&models.Cart{}).
			Joins("join hotel_carts on hotel_carts.cart_id = carts.id").
			Joins("join room_details on hotel_carts.room_detail_id = room_details.id").
			Joins("join hotels on room_details.hotel_id = hotels.id").
			Where("carts.user_id = ? and carts.status = ? and hotels.name ilike ?", id, "Paid", search).
			Where("hotel_carts.deleted_at is null").
			Preload("HotelCarts").
			Preload("HotelCarts.Hotel").
			Preload("HotelCarts.RoomDetail").
			Order("transaction_date desc").
			Find(&carts).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "User has no transaction",
			})
		}
	} else {

		if err := db.Model(&models.Cart{}).
			Joins("join flight_carts on flight_carts.cart_id = carts.id").
			Joins("join tickets on flight_carts.ticket_id = tickets.id").
			Joins("join seats on tickets.seat_id = seats.id").
			Joins("join flights on seats.flight_id = flights.id").
			Joins("join airlines on flights.airline_id = airlines.id").
			Where("carts.user_id = ? and carts.status = ?", id, "Paid").
			Where("airlines.name ilike ? or flights.code ilike ?", search, search).
			Where("flight_carts.deleted_at is null").
			Group("carts.id").
			Preload("FlightCarts").
			Preload("FlightCarts.Ticket").
			Preload("FlightCarts.Ticket.Seat").
			Preload("FlightCarts.Ticket.Seat.Flight").
			Preload("FlightCarts.Ticket.Seat.Flight.Airline").
			Preload("FlightCarts.Ticket.Seat.Flight.Airplane").
			Preload("FlightCarts.Ticket.Seat.Flight.Airplane.Airline").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City.Country").
			Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City.Country").
			Order("transaction_date desc").
			Find(&carts).Error; err != nil {
			c.Status(fiber.StatusBadRequest)
			return c.JSON(fiber.Map{
				"message": "User has no transaction",
			})
		}
	}

	return c.JSON(&carts)
}

func GetTotalActiveTickets(c *fiber.Ctx) error {

	db := database.GetInstance()

	// butuh user id
	id := c.Query("id")

	var count uint

	// cari cart user yang paid

	// filter based on hotel name, airline name, or flight code
	var carts []models.Cart
	if err := db.Model(&models.Cart{}).
		Where("user_id = ? and status = ?", id, "Paid").
		Preload("HotelCarts").
		Preload("HotelCarts.Hotel").
		Preload("HotelCarts.RoomDetail").
		Preload("FlightCarts").
		Preload("FlightCarts.Ticket").
		Preload("FlightCarts.Ticket.Seat").
		Preload("FlightCarts.Ticket.Seat.Flight").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Origin.City.Country").
		Preload("FlightCarts.Ticket.Seat.Flight.FlightRoute.Destination.City.Country").
		Preload("FlightCarts.Ticket.Seat.Flight.Airline").
		Preload("FlightCarts.Ticket.Seat.Flight.Airplane").
		Preload("HotelCarts").
		Find(&carts).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "User has no transaction",
		})
	}

	today := time.Now()

	for _, cart := range carts {

		// iterate hotel cart
		for _, hotelCart := range cart.HotelCarts {
			// cek check in date
			checkIn, err := time.Parse("2006-01-02", hotelCart.CheckInDate)

			if err != nil {
				c.Status(fiber.StatusBadRequest)
				return c.JSON(fiber.Map{
					"message": "Error parsing check in date",
				})
			}

			if today.Before(checkIn) || today.Equal(checkIn) {
				count++
			}
		}

		// iterate flight cart flight
		for _, flightCart := range cart.FlightCarts {
			// cek departure date
			departureDate := flightCart.Ticket.Seat.Flight.DepartureTime.Truncate(24 * time.Hour)

			if today.Before(departureDate) || today.Equal(departureDate) {
				count++
			}
		}

	}

	return c.JSON(&count)

}

func AddHotelReview(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data HotelReviewInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.Cleanliness == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Cleanliness field must be filled",
		})
	}
	if data.CleanlinessRating == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Cleanliness rating field must be filled",
		})
	}
	if data.Comfort == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Comfort field must be filled",
		})
	}
	if data.ComfortRating == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Comfort rating field must be filled",
		})
	}
	if data.Location == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Location field must be filled",
		})
	}
	if data.LocationRating == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Location rating field must be filled",
		})
	}
	if data.Service == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Location field must be filled",
		})
	}
	if data.LocationRating == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Location rating field must be filled",
		})
	}

	cleanlinessRating, _ := strconv.ParseInt(data.CleanlinessRating, 10, 64)
	comfortRating, _ := strconv.ParseInt(data.ComfortRating, 10, 64)
	locationRating, _ := strconv.ParseInt(data.LocationRating, 10, 64)
	serviceRating, _ := strconv.ParseInt(data.ServicenRating, 10, 64)

	if cleanlinessRating < 0 || cleanlinessRating > 5 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Rating must be between 0 - 5",
		})
	}
	if comfortRating < 0 || comfortRating > 5 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Rating must be between 0 - 5",
		})
	}
	if locationRating < 0 || locationRating > 5 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Rating must be between 0 - 5",
		})
	}
	if serviceRating < 0 || serviceRating > 5 {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Rating must be between 0 - 5",
		})
	}

	if err := db.Model(&models.Hotel{}).Where("id = ?", data.HotelID).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error finding hotel",
		})
	}
	if err := db.Model(&models.User{}).Where("id = ?", data.UserID).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error finding user",
		})
	}

	var temp models.HotelReview
	if err := db.Model(&models.HotelReview{}).Where("user_id = ? and hotel_id = ?", data.UserID, data.HotelID).First(&temp).Error; err == nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "You have already given a review for this hotel!",
		})
	}

	hotelReview := models.HotelReview{
		HotelID:           data.HotelID,
		UserID:            data.UserID,
		Cleanliness:       data.Cleanliness,
		CleanlinessRating: uint(cleanlinessRating),
		Comfort:           data.Comfort,
		ComfortRating:     uint(comfortRating),
		Location:          data.Location,
		LocationRating:    uint(locationRating),
		Service:           data.Service,
		ServiceRating:     uint(serviceRating),
		IsAnonymous:       data.IsAnonymous,
	}

	if err := db.Create(&hotelReview).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error creating review",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Successfuly create a hotel review",
	})
}
