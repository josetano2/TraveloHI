package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func AirplaneSeeders() {
	db := database.GetInstance()

	airplanes := []struct {
		Name        string
		Type        string
		AirlineName string
		Capacity    uint
	}{
		{Name: "AirAsia A320", Type: "Airbus A320", AirlineName: "AirAsia", Capacity: 204},
		{Name: "XiamenAir 787", Type: "Boeing 787", AirlineName: "XiamenAir", Capacity: 198},
		{Name: "Scoot 777", Type: "Boeing 777", AirlineName: "Scoot", Capacity: 210},
		{Name: "AirAsia A330", Type: "Airbus A330", AirlineName: "AirAsia", Capacity: 204},
		{Name: "XiamenAir 737", Type: "Boeing 737", AirlineName: "XiamenAir", Capacity: 180},
		{Name: "Scoot A320neo", Type: "Airbus A320neo", AirlineName: "Scoot", Capacity: 204},
		{Name: "AirAsia A350", Type: "Airbus A350", AirlineName: "AirAsia", Capacity: 204},
		{Name: "XiamenAir 757", Type: "Boeing 757", AirlineName: "XiamenAir", Capacity: 216},
		{Name: "Scoot 787-9", Type: "Boeing 787-9", AirlineName: "Scoot", Capacity: 204},
	}

	for _, airplane := range airplanes {
		var airline models.Airline

		if err := db.Where("name = ?", airplane.AirlineName).First(&airline).Error; err != nil {
			panic("Could not find airline")
		}

		airplane := models.Airplane{
			AirlineID: airline.ID,
			Name:      airplane.Name,
			Type:      airplane.Type,
			Capacity:  airplane.Capacity,
		}
		db.FirstOrCreate(&airplane, models.Airplane{Name: airplane.Name})
	}
}
