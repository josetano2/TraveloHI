package models

import "gorm.io/gorm"

type HotelCart struct {
	gorm.Model
	CartID       uint
	Cart         Cart
	HotelID      uint
	Hotel        Hotel
	RoomDetailID uint
	RoomDetail   RoomDetail
	CheckInDate  string
	CheckOutDate string
}
