package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func PromoSeeders() {
	db := database.GetInstance()

	promos := []models.Promo{
		{
			Code:       "WELCOME10",
			StartDate:  "2026-06-01",
			EndDate:    "2026-06-30",
			Image:      "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/promo_welcome.jpg",
			Percentage: 10,
		},
		{
			Code:       "SUMMER25",
			StartDate:  "2026-06-15",
			EndDate:    "2026-08-31",
			Image:      "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/promo_summer.jpg",
			Percentage: 25,
		},
		{
			Code:       "BALI20",
			StartDate:  "2026-06-01",
			EndDate:    "2026-07-31",
			Image:      "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/promo_bali.jpg",
			Percentage: 20,
		},
		{
			Code:       "FLASH50",
			StartDate:  "2026-06-10",
			EndDate:    "2026-06-12",
			Image:      "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/promo_flash.jpg",
			Percentage: 50,
		},
		{
			Code:       "JAPAN15",
			StartDate:  "2026-07-01",
			EndDate:    "2026-09-30",
			Image:      "https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/promo_japan.jpg",
			Percentage: 15,
		},
	}

	for _, promo := range promos {
		db.FirstOrCreate(&promo, models.Promo{Code: promo.Code})
	}
}
