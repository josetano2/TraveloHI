package models

import "gorm.io/gorm"

type HotelReview struct {
	gorm.Model
	HotelID           uint
	Hotel             Hotel
	UserID            uint
	User              User
	Cleanliness       string
	CleanlinessRating uint
	Comfort           string
	ComfortRating     uint
	Location          string
	LocationRating    uint
	Service           string
	ServiceRating    uint
	IsAnonymous       bool
}
