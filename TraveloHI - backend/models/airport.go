package models

import "gorm.io/gorm"

type Airport struct {
	gorm.Model
	Code   string
	Name   string
	CityID uint
	City   City
}
