package database

import (
	"github.com/josetano2/travelohi/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetInstance() *gorm.DB {
	if db == nil {
		dsn := "host=localhost user=postgres password=admin dbname=travelohi port=5432 sslmode=disable TimeZone=Asia/Shanghai"
		connection, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

		if err != nil {
			panic("Could not connect to the database")
		}

		db = connection
	}

	return db
}

func Connect() {

	connection := GetInstance()

	connection.AutoMigrate(&models.User{})
	connection.AutoMigrate(&models.Promo{})
	connection.AutoMigrate(&models.OTP{})
	connection.AutoMigrate(&models.Country{})
	connection.AutoMigrate(&models.City{})
	connection.AutoMigrate(&models.Hotel{})
	connection.AutoMigrate(&models.RoomDetail{})
	connection.AutoMigrate(&models.Facility{})
	connection.AutoMigrate(&models.Promo{})
	connection.AutoMigrate(&models.UserPromo{})
	connection.AutoMigrate(&models.Airport{})
	connection.AutoMigrate(&models.FlightRoute{})
	connection.AutoMigrate(&models.Airline{})
	connection.AutoMigrate(&models.Airplane{})
	connection.AutoMigrate(&models.Seat{})
	connection.AutoMigrate(&models.Ticket{})
	connection.AutoMigrate(&models.Cart{})
	connection.AutoMigrate(&models.HotelCart{})
	connection.AutoMigrate(&models.FlightCart{})
	connection.AutoMigrate(&models.Bank{})
	connection.AutoMigrate(&models.CreditCard{})
	connection.AutoMigrate(&models.HotelReview{})

}
