package models

import "gorm.io/gorm"

type FlightCart struct {
	gorm.Model
	CartID   uint
	Cart     Cart
	TicketID uint
	Ticket   Ticket
}
