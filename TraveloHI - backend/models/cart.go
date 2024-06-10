package models

import (
	"time"

	"gorm.io/gorm"
)

type Cart struct {
	gorm.Model
	UserID          uint
	User            User
	Status          string // unpaid, paid, expired
	TransactionDate time.Time
	HotelCarts      []HotelCart
	FlightCarts     []FlightCart
}
