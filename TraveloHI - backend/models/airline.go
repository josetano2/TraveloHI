package models

import "gorm.io/gorm"

type Airline struct {
	gorm.Model
	Name         string
	Image        string
	Multiplier   float64
	Code         string
	BaggageFee   uint
	FlightRoutes []FlightRoute `gorm:"many2many:airline_routes;"`
}
