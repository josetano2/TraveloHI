package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func AirlineSeeders() {

	db := database.GetInstance()

	airlines := []models.Airline{
		{Name: "AirAsia", Code: "AK", Image: "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/airasia_vo1dkh.png", Multiplier: 1.2, BaggageFee: 450000},
		{Name: "XiamenAir", Code: "MF", Image: "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742805/xiamen_crevfo.png", Multiplier: 1.12, BaggageFee: 532000},
		{Name: "Scoot", Code: "TR", Image: "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/scoot_wofckh.png", Multiplier: 1.32, BaggageFee: 420000},
	}

	for _, airline := range airlines {
		db.FirstOrCreate(&airline, models.Airline{Name: airline.Name})
	}

}

