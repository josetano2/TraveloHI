package seeders

import (
	"encoding/json"

	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
	"gorm.io/datatypes"
)

func HotelSeeders() {
	db := database.GetInstance()

	type roomSeed struct {
		Name         string
		Price        float32
		Capacity     uint
		Guest        uint
		Bed          string
		IsBreakfast  bool
		IsFreeWifi   bool
		IsRefundable bool
		IsReschedule bool
		IsSmoking    bool
		Images       []string
	}

	hotels := []struct {
		Name        string
		Description string
		Rating      float64
		Address     string
		City        string
		Images      []string
		Facilities  []string
		Rooms       []roomSeed
	}{
		{
			Name:        "The Ritz-Carlton Jakarta",
			Description: "A luxury 5-star hotel in the heart of Jakarta, offering world-class amenities and stunning city views.",
			Rating:      4.8,
			Address:     "Jl. DR. Ide Anak Agung Gde Agung No.1, Jakarta",
			City:        "Jakarta",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel1_main.jpg"},
			Facilities:  []string{"WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "24-Hour Front Desk", "Parking", "AC"},
			Rooms: []roomSeed{
				{Name: "Deluxe Room", Price: 2500000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room1_deluxe.jpg"}},
				{Name: "Club Room", Price: 3800000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room1_club.jpg"}},
				{Name: "Suite", Price: 7500000, Capacity: 4, Guest: 4, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: false, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room1_suite.jpg"}},
			},
		},
		{
			Name:        "Aloft Jakarta SCBD",
			Description: "A modern, vibrant hotel located in the SCBD business district offering stylish rooms and great connectivity.",
			Rating:      4.3,
			Address:     "Jl. Jenderal Sudirman No.52-53, Jakarta",
			City:        "Jakarta",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel2_main.jpg"},
			Facilities:  []string{"WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "AC", "Parking"},
			Rooms: []roomSeed{
				{Name: "Urban Room", Price: 1200000, Capacity: 2, Guest: 2, Bed: "Queen", IsBreakfast: false, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room2_urban.jpg"}},
				{Name: "Cool Corner Room", Price: 1600000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: false, IsFreeWifi: true, IsRefundable: true, IsReschedule: false, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room2_corner.jpg"}},
			},
		},
		{
			Name:        "The Mulia Bali",
			Description: "An iconic beachfront resort in Nusa Dua, Bali, offering breathtaking ocean views and world-class facilities.",
			Rating:      4.9,
			Address:     "Jl. Raya Nusa Dua Selatan, Bali",
			City:        "Bali",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel3_main.jpg"},
			Facilities:  []string{"WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "24-Hour Front Desk", "Parking", "Airport Transfer", "AC"},
			Rooms: []roomSeed{
				{Name: "Ocean Suite", Price: 8500000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room3_ocean.jpg"}},
				{Name: "Garden Villa", Price: 12000000, Capacity: 4, Guest: 4, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: false, IsReschedule: false, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room3_villa.jpg"}},
				{Name: "Deluxe Room", Price: 3200000, Capacity: 2, Guest: 2, Bed: "Twin", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room3_deluxe.jpg"}},
			},
		},
		{
			Name:        "Padma Resort Ubud",
			Description: "A tranquil jungle retreat in Ubud offering stunning valley views and authentic Balinese hospitality.",
			Rating:      4.7,
			Address:     "Banjar Carik, Desa Puhu, Payangan, Ubud, Bali",
			City:        "Bali",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel4_main.jpg"},
			Facilities:  []string{"WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "AC", "Airport Transfer"},
			Rooms: []roomSeed{
				{Name: "Valley View Room", Price: 2800000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room4_valley.jpg"}},
				{Name: "Pool Villa", Price: 6500000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: false, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room4_pool.jpg"}},
			},
		},
		{
			Name:        "Lotte Hotel Seoul",
			Description: "A prestigious 5-star hotel in the center of Seoul, blending Korean tradition with modern luxury.",
			Rating:      4.7,
			Address:     "30 Eulji-ro, Jung-gu, Seoul",
			City:        "Seoul",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel5_main.jpg"},
			Facilities:  []string{"WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "24-Hour Front Desk", "Parking", "AC", "Meeting Facilities"},
			Rooms: []roomSeed{
				{Name: "Standard Room", Price: 2200000, Capacity: 2, Guest: 2, Bed: "Queen", IsBreakfast: false, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room5_standard.jpg"}},
				{Name: "Deluxe City View", Price: 3100000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: false, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room5_deluxe.jpg"}},
				{Name: "Executive Suite", Price: 6800000, Capacity: 4, Guest: 4, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: false, IsReschedule: false, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room5_suite.jpg"}},
			},
		},
		{
			Name:        "Park Hyatt Tokyo",
			Description: "An iconic hotel perched on floors 39-52 of the Shinjuku Park Tower, offering panoramic views of Tokyo.",
			Rating:      4.8,
			Address:     "3-7-1-2 Nishi Shinjuku, Tokyo",
			City:        "Tokyo",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel6_main.jpg"},
			Facilities:  []string{"WiFi", "Swimming Pool", "Fitness Center", "Restaurant", "24-Hour Front Desk", "AC", "Meeting Facilities"},
			Rooms: []roomSeed{
				{Name: "Park Room", Price: 4500000, Capacity: 2, Guest: 2, Bed: "Queen", IsBreakfast: false, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room6_park.jpg"}},
				{Name: "Park Deluxe Room", Price: 6200000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: false, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room6_deluxe.jpg"}},
			},
		},
		{
			Name:        "Crowne Plaza Helsinki",
			Description: "A stylish hotel in the heart of Helsinki city center, ideal for business and leisure travelers.",
			Rating:      4.4,
			Address:     "Mannerheimintie 50, Helsinki",
			City:        "Helsinki",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel7_main.jpg"},
			Facilities:  []string{"WiFi", "Restaurant", "24-Hour Front Desk", "Fitness Center", "AC", "Meeting Facilities", "Parking"},
			Rooms: []roomSeed{
				{Name: "Standard Room", Price: 1800000, Capacity: 2, Guest: 2, Bed: "Twin", IsBreakfast: false, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room7_standard.jpg"}},
				{Name: "Superior Room", Price: 2400000, Capacity: 2, Guest: 2, Bed: "King", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room7_superior.jpg"}},
			},
		},
		{
			Name:        "Bandung City Hotel",
			Description: "A cozy mid-range hotel located in central Bandung, perfect for exploring the city's cultural and culinary scene.",
			Rating:      4.1,
			Address:     "Jl. Asia Afrika No.140, Bandung",
			City:        "Bandung",
			Images:      []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/hotel8_main.jpg"},
			Facilities:  []string{"WiFi", "Restaurant", "Parking", "AC", "24-Hour Front Desk"},
			Rooms: []roomSeed{
				{Name: "Standard Room", Price: 650000, Capacity: 2, Guest: 2, Bed: "Queen", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room8_standard.jpg"}},
				{Name: "Family Room", Price: 1100000, Capacity: 4, Guest: 4, Bed: "Twin", IsBreakfast: true, IsFreeWifi: true, IsRefundable: true, IsReschedule: true, IsSmoking: false, Images: []string{"https://res.cloudinary.com/dau03r7yn/image/upload/v1708742806/room8_family.jpg"}},
			},
		},
	}

	for _, h := range hotels {
		var city models.City
		if err := db.Where("name = ?", h.City).First(&city).Error; err != nil {
			continue
		}

		imagesJSON, _ := json.Marshal(h.Images)

		hotel := models.Hotel{
			Name:        h.Name,
			Description: h.Description,
			Rating:      h.Rating,
			Address:     h.Address,
			CityID:      city.ID,
			Images:      datatypes.JSON(imagesJSON),
		}

		var existing models.Hotel
		if err := db.Where("name = ?", h.Name).First(&existing).Error; err != nil {
			db.Create(&hotel)
			existing = hotel
		}

		for _, facilityName := range h.Facilities {
			var facility models.Facility
			if err := db.Where("name = ?", facilityName).First(&facility).Error; err == nil {
				db.Model(&existing).Association("Facilities").Append(&facility)
			}
		}

		for _, r := range h.Rooms {
			roomImagesJSON, _ := json.Marshal(r.Images)
			room := models.RoomDetail{
				HotelID:      existing.ID,
				Name:         r.Name,
				Price:        r.Price,
				Capacity:     r.Capacity,
				Guest:        r.Guest,
				Bed:          r.Bed,
				IsBreakfast:  r.IsBreakfast,
				IsFreeWifi:   r.IsFreeWifi,
				IsRefundable: r.IsRefundable,
				IsReschedule: r.IsReschedule,
				IsSmoking:    r.IsSmoking,
				Images:       datatypes.JSON(roomImagesJSON),
			}
			db.FirstOrCreate(&room, models.RoomDetail{HotelID: existing.ID, Name: r.Name})
		}
	}
}
