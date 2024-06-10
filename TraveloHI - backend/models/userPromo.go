package models

import "gorm.io/gorm"

type UserPromo struct {
	gorm.Model
	PromoID uint
	UserID  uint
	IsUsed  bool `gorm:"default:false"`
	User    User
	Promo   Promo
}
