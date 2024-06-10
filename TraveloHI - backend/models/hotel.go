package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Hotel struct {
	gorm.Model
	Name        string
	Description string
	Rating      float64 `gorm:"default:0"`
	Address     string
	Images      datatypes.JSON
	CityID      uint
	City        City         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	Facilities  []Facility   `gorm:"many2many:hotel_facilities;"`
	RoomDetails []RoomDetail `gorm:"foreignKey:HotelID"`
}
