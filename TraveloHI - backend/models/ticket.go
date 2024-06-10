package models

import "gorm.io/gorm"

type Ticket struct {
	gorm.Model
	BaggageWeight float64
	SeatID        uint
	Seat          Seat
}
