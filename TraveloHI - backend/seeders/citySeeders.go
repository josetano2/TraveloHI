package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func CitySeeders() {

	db := database.GetInstance()

	cities := map[string][]string{
		"Indonesia":   {"Jakarta", "Bali", "Bandung"},
		"South Korea": {"Seoul", "Incheon"},
		"Japan":       {"Tokyo", "Kyoto"},
		"Finland":     {"Helsinki", "Oulu"},
		"Brazil":      {"Sao Paolo"},
	}

	for countryName, cityNames := range cities {
		var country models.Country

		if err := db.Where("name = ?", countryName).First(&country).Error; err != nil {
			panic("Could not find country")
		}

		for _, cityName := range cityNames {
			city := models.City{
				Name:      cityName,
				CountryID: country.ID,
			}
			db.FirstOrCreate(&city, models.City{
				Name:      cityName,
				CountryID: country.ID,
			})
		}
	}

}
