package models

import "gorm.io/gorm"



type Facility struct {
	gorm.Model
	Name   string
	Hotels []Hotel `gorm:"many2many:hotel_facilities;"`
}
