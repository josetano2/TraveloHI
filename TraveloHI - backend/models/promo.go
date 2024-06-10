package models

import "gorm.io/gorm"

type Promo struct {
	gorm.Model
	Code       string
	StartDate  string
	EndDate    string
	Image      string
	Percentage float64
	UserPromo  []UserPromo `gorm:"foreignKey:PromoID"`
}
