package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func CountrySeeders() {
	countries := []models.Country{
		{Name: "Indonesia"},
		{Name: "South Korea"},
		{Name: "Japan"},
		{Name: "Finland"},
		{Name: "Brazil"},
	}

	db := database.GetInstance()

	for _, country := range countries {
		db.FirstOrCreate(&country, models.Country{Name: country.Name})
	}

}
