package models

import "gorm.io/gorm"

type Airplane struct {
	gorm.Model
	AirlineID   uint
	Airline     Airline
	Name        string
	Type        string
	IsAvailable bool `gorm:"default:false"`
	Capacity    uint
}
