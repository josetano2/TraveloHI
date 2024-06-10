package controllers

import (
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

type HotelInput struct {
	Name               string
	Description        string
	Rating             float32
	Address            string
	CityName           string
	Images             []string
	SelectedFacilities []uint
}

type RoomDetailInput struct {
	HotelID      uint
	Name         string
	Price        float32
	Capacity     uint
	IsBreakfast  bool
	IsFreeWifi   bool
	IsRefundable bool
	IsReschedule bool
	IsSmoking    bool
	Guest        uint
	Bed          string
	Images       []string
}

type SearchResults struct {
	Countries []models.Country
	Cities    []models.City
	Hotels    []models.Hotel
}

type HotelWithPrice struct {
	models.Hotel
	MinPrice float32
}

func AddHotel(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data HotelInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.Name == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Hotel name must be filled",
		})
	}

	var hotelTemp models.Hotel
	if err := db.Where("name ilike ?", data.Name).First(&hotelTemp).Error; err == nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Hotel name duplicate",
		})
	}

	if data.Description == "" {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Description must be filled",
		})
	}

	var city models.City

	if err := db.Where("name = ?", data.CityName).First(&city).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "City not found",
		})
	}

	imagesJSON, err := json.Marshal(data.Images)

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to encode images",
		})
	}

	hotel := models.Hotel{
		Name:        data.Name,
		Description: data.Description,
		Address:     data.Address,
		CityID:      city.ID,
		Images:      imagesJSON,
	}

	if err := db.Create(&hotel).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to create hotel",
		})
	}

	for _, id := range data.SelectedFacilities {
		var facility models.Facility
		if err := db.First(&facility, id).Error; err != nil {
			return c.JSON(fiber.Map{
				"message": "Facility error",
			})
		} else {
			db.Model(&hotel).Association("Facilities").Append(&facility)
		}
	}

	return c.JSON(&hotel)

}

func GetAllHotels(c *fiber.Ctx) error {

	db := database.GetInstance()

	var hotels []models.Hotel

	db.Find(&hotels)

	return c.JSON(&hotels)

}

func AddRoomDetail(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data RoomDetailInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	imagesJSON, err := json.Marshal(data.Images)

	if err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to encode images",
		})
	}

	roomDetail := models.RoomDetail{
		HotelID:      data.HotelID,
		Name:         data.Name,
		Price:        data.Price,
		Capacity:     data.Capacity,
		IsBreakfast:  data.IsBreakfast,
		IsFreeWifi:   data.IsFreeWifi,
		IsRefundable: data.IsRefundable,
		IsReschedule: data.IsReschedule,
		IsSmoking:    data.IsSmoking,
		Guest:        data.Guest,
		Bed:          data.Bed,
		Images:       imagesJSON,
	}

	db.Create(&roomDetail)

	return c.JSON(&roomDetail)

}

func SearchSuggestions(c *fiber.Ctx) error {

	db := database.GetInstance()

	search := c.Query("search")
	search = fmt.Sprintf("%%%s%%", search)

	var countries []models.Country

	if err := db.Table("countries").
		// Select("name as country_name").
		Where("name ILIKE ?", search).
		Find(&countries).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (country)",
		})
	}

	var cities []models.City

	if err := db.Table("cities").
		// Select("cities.name as city_name, countries.name as country_name").
		Joins("join countries on cities.country_id = countries.id").
		Where("cities.name ILIKE ?", search).
		Or("countries.name ILIKE ?", search).
		Preload("Country").
		Find(&cities).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (city)",
		})
	}

	var hotels []models.Hotel

	if err := db.Table("hotels").
		Joins("join cities on hotels.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Where("hotels.name ILIKE ?", search).
		Or("cities.name ILIKE ?", search).
		Or("countries.name ILIKE ?", search).
		Preload("City").
		Preload("City.Country").
		Find(&hotels).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (hotel)",
		})
	}

	res := SearchResults{
		Countries: countries,
		Cities:    cities,
		Hotels:    hotels,
	}

	return c.JSON(&res)

}

func SearchHotels(c *fiber.Ctx) error {

	db := database.GetInstance()

	search := c.Query("search")
	search = fmt.Sprintf("%%%s%%", search)

	var hotels []models.Hotel

	if err := db.Model(&models.Hotel{}).
		Joins("join cities on hotels.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Joins("join hotel_facilities on hotels.id = hotel_facilities.hotel_id").
		Joins("join facilities on facilities.id = hotel_facilities.facility_id").
		Where("hotels.name ILIKE ?", search).
		Or("cities.name ILIKE ?", search).
		Or("countries.name ILIKE ?", search).
		Group("hotels.id, cities.id, countries.id").
		Preload("City").
		Preload("City.Country").
		Preload("Facilities").
		Find(&hotels).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (hotel)",
		})
	}

	var hotelsWithPrice []HotelWithPrice

	for _, hotel := range hotels {
		var minPrice float32

		db.Table("room_details").
			Select("MIN(price) as min_price").
			Where("hotel_id = ?", hotel.ID).
			Pluck("min_price", &minPrice)

		hotelWithPrice := HotelWithPrice{
			Hotel:    hotel,
			MinPrice: minPrice,
		}
		hotelsWithPrice = append(hotelsWithPrice, hotelWithPrice)
	}

	return c.JSON(&hotelsWithPrice)

}

func GetHotelDetail(c *fiber.Ctx) error {

	db := database.GetInstance()

	id := c.Query("id")

	var hotel models.Hotel

	if err := db.Preload("City").
		Preload("City.Country").
		Preload("Facilities").
		Preload("RoomDetails").
		Where("id = ?", id).
		First(&hotel).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (hotel)",
		})
	}

	var minPrice float32

	db.Table("room_details").
		Select("MIN(price) as min_price").
		Where("hotel_id = ?", hotel.ID).
		Pluck("min_price", &minPrice)

	hotelWithPrice := HotelWithPrice{
		Hotel:    hotel,
		MinPrice: minPrice,
	}

	return c.JSON(&hotelWithPrice)
}
