package models

import "gorm.io/gorm"

type FlightRoute struct {
	gorm.Model
	OriginID      uint
	Origin        Airport `gorm:"foreignKey:OriginID"`
	DestinationID uint
	Destination   Airport `gorm:"foreignKey:DestinationID"`
	Duration      float64
	Price         float64
	Airlines      []Airline `gorm:"many2many:airline_routes;"`
}
