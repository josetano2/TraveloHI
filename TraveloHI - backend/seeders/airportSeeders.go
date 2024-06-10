package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func AirportSeeders() {

	db := database.GetInstance()

	airports := []struct {
		Name string
		City string
		Code string
	}{
		{Name: "Soekarno-Hatta International Airport", City: "Jakarta", Code: "CGK"},
		{Name: "Husein Sastranegara International Airport", City: "Bandung", Code: "BDO"},
		{Name: "Ngurah Rai International Airport", City: "Bali", Code: "DPS"},
		{Name: "Incheon International Airport", City: "Seoul", Code: "ICN"},
		{Name: "Narita International Airport", City: "Tokyo", Code: "NRT"},
		{Name: "Kansai International Airport", City: "Kyoto", Code: "UKY"},
		{Name: "Helsinki Airport", City: "Helsinki", Code: "HEL"},
		{Name: "Oulu Airport", City: "Oulu", Code: "OUL"},
		{Name: "Sao Paolo International Airport", City: "Sao Paolo", Code: "GRU"},
	}

	for _, airport := range airports {
		var city models.City
		if err := db.Where("name = ?", airport.City).First(&city).Error; err != nil {
			continue
		}
		newAirport := models.Airport{Name: airport.Name, CityID: city.ID, Code: airport.Code}
		db.FirstOrCreate(&newAirport, models.Airport{Code: airport.Code})
	}
}
