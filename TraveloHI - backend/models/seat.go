package models

import "gorm.io/gorm"

type Seat struct {
	gorm.Model
	FlightID    uint
	Flight      Flight
	Code        string
	Class       string
	IsAvailable bool `gorm:"default:true"`
}
