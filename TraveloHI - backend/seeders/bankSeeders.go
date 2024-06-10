package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func BankSeeders() {

	db := database.GetInstance()

	banks := []models.Bank{
		{Name: "BCA"},
		{Name: "CIMB Niaga"},
		{Name: "Mandiri"},
		{Name: "BNI"},
		{Name: "Danamon"},
	}

	for _, bank := range banks {
		db.FirstOrCreate(&bank, models.Bank{Name: bank.Name})
	}
}
