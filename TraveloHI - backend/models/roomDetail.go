package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type RoomDetail struct {
	gorm.Model
	HotelID      uint
	Hotel        Hotel
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
	Images       datatypes.JSON
}
