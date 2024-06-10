package models

import "time"

type OTP struct {
	Email     string
	OTP       string
	ExpiresAt time.Time
}
