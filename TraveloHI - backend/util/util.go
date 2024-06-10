package util

import "github.com/nanorand/nanorand"

func CreateOTP() (string, error) {
	otp, err := nanorand.Gen(6)

	if err != nil {
		return "", err
	}

	return string(otp), nil

}
