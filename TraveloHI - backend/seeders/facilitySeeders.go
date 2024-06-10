package seeders

import (
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

func FacilitySeeders() {

	db := database.GetInstance()

	facilities := []models.Facility{
		{Name: "WiFi"},
		{Name: "Swimming Pool"},
		{Name: "Parking"},
		{Name: "Restaurant"},
		{Name: "24-Hour Front Desk"},
		{Name: "Elevator"},
		{Name: "Wheelchair Access"},
		{Name: "Fitness Center"},
		{Name: "Meeting Facilities"},
		{Name: "Airport Transfer"},
		{Name: "AC"},
	}

	for _, facility := range facilities {
		db.FirstOrCreate(&facility, models.Facility{Name: facility.Name})
	}

}
