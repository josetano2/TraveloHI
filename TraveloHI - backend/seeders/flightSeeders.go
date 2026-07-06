package seeders

import (
	"fmt"
	"time"

	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func FlightSeeders() {
	db := database.GetInstance()

	flights := []struct {
		RouteOrigin      string
		RouteDestination string
		AirlineName      string
		AirplaneName     string
		DepartureTime    time.Time
		ArrivalTime      time.Time
		IncludedBaggage  float64
		Code             string
	}{
		{
			RouteOrigin: "CGK", RouteDestination: "DPS",
			AirlineName: "AirAsia", AirplaneName: "AirAsia A320",
			DepartureTime:   time.Date(2026, 6, 1, 6, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 1, 7, 30, 0, 0, time.UTC),
			IncludedBaggage: 20, Code: "AK-101",
		},
		{
			RouteOrigin: "CGK", RouteDestination: "DPS",
			AirlineName: "Scoot", AirplaneName: "Scoot 777",
			DepartureTime:   time.Date(2026, 6, 1, 14, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 1, 15, 30, 0, 0, time.UTC),
			IncludedBaggage: 20, Code: "TR-201",
		},
		{
			RouteOrigin: "DPS", RouteDestination: "CGK",
			AirlineName: "AirAsia", AirplaneName: "AirAsia A330",
			DepartureTime:   time.Date(2026, 6, 2, 8, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 2, 9, 30, 0, 0, time.UTC),
			IncludedBaggage: 20, Code: "AK-102",
		},
		{
			RouteOrigin: "CGK", RouteDestination: "ICN",
			AirlineName: "XiamenAir", AirplaneName: "XiamenAir 787",
			DepartureTime:   time.Date(2026, 6, 5, 9, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 5, 16, 30, 0, 0, time.UTC),
			IncludedBaggage: 30, Code: "MF-301",
		},
		{
			RouteOrigin: "ICN", RouteDestination: "CGK",
			AirlineName: "Scoot", AirplaneName: "Scoot 787-9",
			DepartureTime:   time.Date(2026, 6, 12, 11, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 12, 18, 30, 0, 0, time.UTC),
			IncludedBaggage: 30, Code: "TR-202",
		},
		{
			RouteOrigin: "CGK", RouteDestination: "NRT",
			AirlineName: "AirAsia", AirplaneName: "AirAsia A350",
			DepartureTime:   time.Date(2026, 6, 10, 7, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 10, 14, 0, 0, 0, time.UTC),
			IncludedBaggage: 30, Code: "AK-103",
		},
		{
			RouteOrigin: "NRT", RouteDestination: "CGK",
			AirlineName: "XiamenAir", AirplaneName: "XiamenAir 757",
			DepartureTime:   time.Date(2026, 6, 20, 10, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 20, 17, 0, 0, 0, time.UTC),
			IncludedBaggage: 30, Code: "MF-302",
		},
		{
			RouteOrigin: "ICN", RouteDestination: "NRT",
			AirlineName: "XiamenAir", AirplaneName: "XiamenAir 737",
			DepartureTime:   time.Date(2026, 6, 8, 13, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 8, 15, 30, 0, 0, time.UTC),
			IncludedBaggage: 20, Code: "MF-303",
		},
		{
			RouteOrigin: "CGK", RouteDestination: "BDO",
			AirlineName: "AirAsia", AirplaneName: "AirAsia A320",
			DepartureTime:   time.Date(2026, 6, 3, 7, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 3, 7, 45, 0, 0, time.UTC),
			IncludedBaggage: 15, Code: "AK-104",
		},
		{
			RouteOrigin: "DPS", RouteDestination: "NRT",
			AirlineName: "Scoot", AirplaneName: "Scoot A320neo",
			DepartureTime:   time.Date(2026, 6, 15, 6, 0, 0, 0, time.UTC),
			ArrivalTime:     time.Date(2026, 6, 15, 12, 30, 0, 0, time.UTC),
			IncludedBaggage: 25, Code: "TR-203",
		},
	}

	for _, f := range flights {
		var origin, destination models.Airport
		if err := db.Where("code = ?", f.RouteOrigin).First(&origin).Error; err != nil {
			continue
		}
		if err := db.Where("code = ?", f.RouteDestination).First(&destination).Error; err != nil {
			continue
		}

		var route models.FlightRoute
		if err := db.Where("origin_id = ? AND destination_id = ?", origin.ID, destination.ID).First(&route).Error; err != nil {
			continue
		}

		var airline models.Airline
		if err := db.Where("name = ?", f.AirlineName).First(&airline).Error; err != nil {
			continue
		}

		var airplane models.Airplane
		if err := db.Where("name = ?", f.AirplaneName).First(&airplane).Error; err != nil {
			continue
		}

		flight := models.Flight{
			FlightRouteID:   route.ID,
			AirlineID:       airline.ID,
			AirplaneID:      airplane.ID,
			DepartureTime:   f.DepartureTime,
			ArrivalTime:     f.ArrivalTime,
			IncludedBaggage: f.IncludedBaggage,
			Code:            f.Code,
		}

		var existing models.Flight
		if err := db.Where("code = ?", f.Code).First(&existing).Error; err != nil {
			db.Create(&flight)
			SeatSeeders(flight.ID, airplane.Capacity)
		}
	}
}

func SeatSeeders(flightID uint, capacity uint) {
	db := database.GetInstance()

	classes := []struct {
		Class string
		Share float64
		Rows  []string
	}{
		{Class: "First", Share: 0.05, Rows: []string{"A", "B", "C", "D"}},
		{Class: "Business", Share: 0.15, Rows: []string{"A", "B", "C", "D", "E", "F"}},
		{Class: "Economy", Share: 0.80, Rows: []string{"A", "B", "C", "D", "E", "F"}},
	}

	row := 1
	for _, cls := range classes {
		seatsInClass := int(float64(capacity) * cls.Share)
		cols := cls.Rows
		rowsNeeded := seatsInClass / len(cols)
		if rowsNeeded == 0 {
			rowsNeeded = 1
		}

		for r := 0; r < rowsNeeded; r++ {
			for _, col := range cols {
				code := fmt.Sprintf("%d%s", row+r, col)
				seat := models.Seat{
					FlightID:    flightID,
					Code:        code,
					Class:       cls.Class,
					IsAvailable: true,
				}
				db.FirstOrCreate(&seat, models.Seat{FlightID: flightID, Code: code})
			}
		}
		row += rowsNeeded
	}
}
