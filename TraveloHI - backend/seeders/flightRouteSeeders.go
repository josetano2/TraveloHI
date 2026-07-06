package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func FlightRouteSeeders() {
	db := database.GetInstance()

	routes := []struct {
		Origin      string
		Destination string
		Duration    float64
		Price       float64
		Airlines    []string
	}{
		{Origin: "CGK", Destination: "DPS", Duration: 1.5, Price: 850000, Airlines: []string{"AirAsia", "Scoot"}},
		{Origin: "DPS", Destination: "CGK", Duration: 1.5, Price: 850000, Airlines: []string{"AirAsia", "Scoot"}},
		{Origin: "CGK", Destination: "BDO", Duration: 0.75, Price: 450000, Airlines: []string{"AirAsia"}},
		{Origin: "BDO", Destination: "CGK", Duration: 0.75, Price: 450000, Airlines: []string{"AirAsia"}},
		{Origin: "CGK", Destination: "ICN", Duration: 7.5, Price: 4500000, Airlines: []string{"XiamenAir", "Scoot"}},
		{Origin: "ICN", Destination: "CGK", Duration: 7.5, Price: 4500000, Airlines: []string{"XiamenAir", "Scoot"}},
		{Origin: "CGK", Destination: "NRT", Duration: 7.0, Price: 5200000, Airlines: []string{"AirAsia", "XiamenAir"}},
		{Origin: "NRT", Destination: "CGK", Duration: 7.0, Price: 5200000, Airlines: []string{"AirAsia", "XiamenAir"}},
		{Origin: "DPS", Destination: "NRT", Duration: 6.5, Price: 4900000, Airlines: []string{"Scoot"}},
		{Origin: "NRT", Destination: "DPS", Duration: 6.5, Price: 4900000, Airlines: []string{"Scoot"}},
		{Origin: "ICN", Destination: "NRT", Duration: 2.5, Price: 1800000, Airlines: []string{"XiamenAir"}},
		{Origin: "NRT", Destination: "ICN", Duration: 2.5, Price: 1800000, Airlines: []string{"XiamenAir"}},
		{Origin: "HEL", Destination: "OUL", Duration: 1.0, Price: 1200000, Airlines: []string{"AirAsia"}},
		{Origin: "OUL", Destination: "HEL", Duration: 1.0, Price: 1200000, Airlines: []string{"AirAsia"}},
		{Origin: "CGK", Destination: "GRU", Duration: 22.0, Price: 12000000, Airlines: []string{"Scoot"}},
		{Origin: "GRU", Destination: "CGK", Duration: 22.0, Price: 12000000, Airlines: []string{"Scoot"}},
	}

	for _, r := range routes {
		var origin, destination models.Airport
		if err := db.Where("code = ?", r.Origin).First(&origin).Error; err != nil {
			continue
		}
		if err := db.Where("code = ?", r.Destination).First(&destination).Error; err != nil {
			continue
		}

		route := models.FlightRoute{
			OriginID:      origin.ID,
			DestinationID: destination.ID,
			Duration:      r.Duration,
			Price:         r.Price,
		}
		db.FirstOrCreate(&route, models.FlightRoute{OriginID: origin.ID, DestinationID: destination.ID})

		for _, airlineName := range r.Airlines {
			var airline models.Airline
			if err := db.Where("name = ?", airlineName).First(&airline).Error; err != nil {
				continue
			}
			db.Model(&route).Association("Airlines").Append(&airline)
		}
	}
}
