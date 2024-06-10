package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FirstName      string
	LastName       string
	Email          string `gorm:"unique"`
	DOB            string
	Gender         string
	Password       []byte `json:"-"`
	Question       string
	Answer         string
	ProfilePicture string
	Newsletter     string
	IsBanned       bool `gorm:"default:false"`
	Address        string
	PhoneNumber    string
	Role           string      `gorm:"default:user"`
	IsLoggedIn     bool        `gorm:"default:false"`
	WalletAmount  float64     `gorm:"default:0"`
	UserPromo      []UserPromo `gorm:"foreignKey:UserID"`
}
