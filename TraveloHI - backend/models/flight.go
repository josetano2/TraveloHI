package models

import (
	"time"

	"gorm.io/gorm"
)

type Flight struct {
	gorm.Model
	FlightRouteID   uint
	FlightRoute     FlightRoute
	AirlineID       uint
	Airline         Airline
	AirplaneID      uint
	Airplane        Airplane
	ArrivalTime     time.Time
	DepartureTime   time.Time
	IncludedBaggage float64
	Code            string
}
