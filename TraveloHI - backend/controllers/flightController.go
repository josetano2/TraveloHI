package controllers

import (
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/database"
	"github.com/josetano2/travelohi/models"
)

type FlightRouteInput struct {
	OriginAirportName      string
	DestinationAirportName string
	Duration               float64
	Price                  float64
	SelectedAirlines       []uint
}

type FlightDetail struct {
	Flight models.Flight
	Seats  []models.Seat
}

func AddFlightRoute(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data FlightRouteInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	if data.OriginAirportName == data.DestinationAirportName {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Origin and destination could not be the same",
		})
	}

	var origin models.Airport

	if err := db.Where("name = ?", data.OriginAirportName).First(&origin).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Origin airport not found",
		})
	}

	var destination models.Airport

	if err := db.Where("name = ?", data.DestinationAirportName).First(&destination).Error; err != nil {
		c.Status(fiber.StatusNotFound)
		return c.JSON(fiber.Map{
			"message": "Destination airport not found",
		})
	}

	// if err := db.Where("name = ?", data.OriginAirportName)..First	(&origin).Error;

	flightRoute := models.FlightRoute{
		OriginID:      origin.ID,
		DestinationID: destination.ID,
		Duration:      data.Duration,
		Price:         data.Price,
	}

	fmt.Println("a")

	if err := db.Create(&flightRoute).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to create flight route",
		})
	}
	fmt.Println("b")

	for _, id := range data.SelectedAirlines {
		var airline models.Airline
		if err := db.First(&airline, id).Error; err != nil {
			c.Status(fiber.StatusInternalServerError)
			return c.JSON(fiber.Map{
				"message": "Route error",
			})
		} else {
			db.Model(&flightRoute).Association("Airlines").Append(&airline)
		}
	}

	return c.JSON(&flightRoute)

}

func GetAllFlightRoutes(c *fiber.Ctx) error {

	db := database.GetInstance()

	var flightRoutes []models.FlightRoute

	db.Preload("Origin").Preload("Destination").Preload("Origin.City").Preload("Destination.City").Find(&flightRoutes)

	return c.JSON(&flightRoutes)

}

func GetAvailableAirlineRoutes(c *fiber.Ctx) error {

	db := database.GetInstance()

	name := c.Query("name")
	name = fmt.Sprintf("%%%s%%", name)

	var flightRoutes []models.FlightRoute

	if err := db.Model(&models.FlightRoute{}).
		Joins("join airline_routes on flight_routes.id = airline_routes.flight_route_id").
		Joins("join airlines on airlines.id = airline_routes.airline_id").
		Joins("join airports as origin on flight_routes.origin_id = origin.id").
		Joins("join airports as destination on flight_routes.destination_id = destination.id").
		Joins("join cities as origin_city on origin_city.id = origin.city_id").
		Joins("join cities as destination_city on destination_city.id = destination.city_id").
		Where("airlines.name ilike ?", name).
		Preload("Airlines").
		Preload("Origin").
		Preload("Destination").
		Preload("Origin.City").
		Preload("Destination.City").Find(&flightRoutes).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch flight route",
		})
	}

	return c.JSON(&flightRoutes)

}

type FlightInput struct {
	SelectedRouteID     uint
	SelectedAirlineName string
	SelectedAirplaneID  uint
	DepartureTime       string
	FreeBaggage         float64
}

func AddFlight(c *fiber.Ctx) error {

	db := database.GetInstance()

	var data FlightInput

	if err := c.BodyParser(&data); err != nil {
		return err
	}

	// fmt.Println(data.SelectedRouteID, data.SelectedAirlineName, data.SelectedAirplaneID, data.DepartureTime, data.FreeBaggage)

	var airline models.Airline

	name := fmt.Sprintf("%%%s%%", data.SelectedAirlineName)

	if err := db.Model(&models.Airline{}).Where("name ilike ?", name).First(&airline).Error; err != nil {
		fmt.Println(name)
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to find airline",
		})
	}

	var airplane models.Airplane
	if err := db.Model(&models.Airplane{}).Where("id = ?", data.SelectedAirplaneID).First(&airplane).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to find airplane",
		})
	}

	// get route duration

	var flightRoute models.FlightRoute
	if err := db.Model(&models.FlightRoute{}).Where("id = ?", data.SelectedRouteID).First(&flightRoute).Error; err != nil {
		fmt.Println("route")
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to find route",
		})
	}

	departureTime, err := time.Parse("2006-01-02T15:04", data.DepartureTime)
	if err != nil {
		fmt.Println("parse")
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Error parsing time",
		})
	}

	duration := flightRoute.Duration
	arrivalTime := departureTime.Add(time.Minute * time.Duration(duration))

	// bikin flight code
	flightCode := fmt.Sprintf("%s-%05d", airline.Code, flightRoute.ID)
	fmt.Println(flightCode)

	// bikin flight
	flight := models.Flight{
		FlightRouteID:   flightRoute.ID,
		AirlineID:       airline.ID,
		AirplaneID:      airplane.ID,
		DepartureTime:   departureTime,
		ArrivalTime:     arrivalTime,
		IncludedBaggage: data.FreeBaggage,
		Code:            flightCode,
	}

	if err := db.Create(&flight).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to create flight",
		})
	}

	// create seat
	// A1 B1 C1  gap  D1 E1 F1
	// A2 B2 C3  gap  D2 E2 F2
	capacity := airplane.Capacity
	totalRow := capacity / 6

	type SeatChart struct {
		Code  string
		Class string
	}

	var arrOfSeats []SeatChart

	for i := 0; i < int(totalRow); i++ {
		for j := 0; j < 6; j++ {
			code := fmt.Sprintf("%c%d", 'A'+j, i+1)

			var class string
			if i < 1 {
				class = "Business"
			} else {
				class = "Economy"
			}
			tempSeat := SeatChart{
				Code:  code,
				Class: class,
			}
			arrOfSeats = append(arrOfSeats, tempSeat)
		}
	}

	// create seat

	var seats []models.Seat

	for _, tempSeat := range arrOfSeats {
		seat := models.Seat{
			FlightID: flight.ID,
			Code:     tempSeat.Code,
			Class:    tempSeat.Class,
		}
		seats = append(seats, seat)
	}

	if err := db.Create(&seats).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to create seat",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Flight Created!",
	})
}

type FlightSuggestion struct {
	Countries []models.Country
	Cities    []models.City
	Airports  []models.Airport
}

func SearchFlightSuggestions(c *fiber.Ctx) error {

	db := database.GetInstance()

	search := c.Query("search")
	search = fmt.Sprintf("%%%s%%", search)

	var countries []models.Country

	if err := db.Table("countries").
		Where("name ILIKE ?", search).
		Find(&countries).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (country)",
		})
	}

	var cities []models.City

	if err := db.Table("cities").
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

	var airports []models.Airport

	if err := db.Table("airports").
		Joins("join cities on airports.city_id = cities.id").
		Joins("join countries on cities.country_id = countries.id").
		Where("airports.name ILIKE ?", search).
		Or("airports.code ILIKE ?", search).
		Or("cities.name ILIKE ?", search).
		Or("countries.name ILIKE ?", search).
		Preload("City").
		Preload("City.Country").
		Find(&airports).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch (airport)",
		})
	}

	res := FlightSuggestion{
		Countries: countries,
		Cities:    cities,
		Airports:  airports,
	}

	return c.JSON(&res)

}

func SearchFlights(c *fiber.Ctx) error {

	db := database.GetInstance()

	origin := c.Query("origin")
	origin = fmt.Sprintf("%%%s%%", origin)
	destination := c.Query("destination")
	destination = fmt.Sprintf("%%%s%%", destination)

	departureDate := c.Query("departureDate")

	// conditions
	// 1: origin city, country, airport name, code
	// 2: destination city, country, airport name, code
	// 3: departureDate > flightdate

	// get flight
	var flights []models.Flight
	if err := db.Model(&models.Flight{}).
		Joins("join airplanes on flights.airplane_id = airplanes.id").
		Joins("join airlines on airplanes.airline_id = airlines.id").
		Joins("join airline_routes on flights.flight_route_id = airline_routes.flight_route_id").
		Joins("join flight_routes on airline_routes.flight_route_id = flight_routes.id").
		Joins("join airports as origin on flight_routes.origin_id = origin.id").
		Joins("join airports as destination on flight_routes.destination_id = destination.id").
		Joins("join cities as origin_city on origin_city.id = origin.city_id").
		Joins("join cities as destination_city on destination_city.id = destination.city_id").
		Joins("join countries as origin_country on origin_country.id = origin_city.country_id").
		Joins("join countries as destination_country on destination_country.id = destination_city.country_id").
		Where("(origin_city.name ilike ? OR origin_country.name ilike ? OR origin.name ilike ? OR origin.code ilike ?)", origin, origin, origin, origin).
		Where("(destination.name ilike ? OR destination_country.name ilike ? OR destination.name ilike ? OR destination.code ilike ?)", destination, destination, destination, destination).
		Where("date(flights.departure_time) >= date(?)", departureDate).
		Group("flights.id").
		Preload("Airline").
		Preload("Airplane").
		Preload("FlightRoute").
		Preload("FlightRoute.Origin").
		Preload("FlightRoute.Destination").
		Preload("FlightRoute.Origin.City").
		Preload("FlightRoute.Destination.City").
		Preload("FlightRoute.Origin.City.Country").
		Preload("FlightRoute.Destination.City.Country").
		Find(&flights).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch flights",
		})
	}

	return c.JSON(&flights)

}

func GetFlightDetail(c *fiber.Ctx) error {

	db := database.GetInstance()

	id := c.Query("id")

	var flight models.Flight

	if err := db.Preload("FlightRoute").
		Preload("Airline").
		Preload("Airplane").
		Preload("FlightRoute.Origin").
		Preload("FlightRoute.Destination").
		Preload("FlightRoute.Origin.City").
		Preload("FlightRoute.Destination.City").
		Preload("FlightRoute.Origin.City.Country").
		Preload("FlightRoute.Destination.City.Country").
		Where("id = ?", id).
		First(&flight).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch flight",
		})
	}

	var seats []models.Seat

	if err := db.Model(&models.Seat{}).
		Where("flight_id = ?", id).
		Order("id asc").
		Preload("Flight").
		Preload("Flight.FlightRoute").
		Preload("Flight.Airplane").
		Preload("Flight.FlightRoute").
		Find(&seats).Error; err != nil {
		c.Status(fiber.StatusBadRequest)
		return c.JSON(fiber.Map{
			"message": "Failed to fetch seat",
		})
	}

	flightDetail := FlightDetail{
		Flight: flight,
		Seats:  seats,
	}

	return c.JSON(&flightDetail)

}
