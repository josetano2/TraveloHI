package models

import "gorm.io/gorm"

type CreditCard struct {
	gorm.Model
	UserID       uint
	User         User
	BankID       uint
	Bank         Bank
	Name         string
	Number       string
	CVV          string
	ExpiredMonth uint
	ExpiredYear  uint
}
