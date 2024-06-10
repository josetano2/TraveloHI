package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/josetano2/travelohi/controllers"
)

func Setup(app *fiber.App) {

	// account
	app.Post("/api/register", controllers.Register)
	app.Post("/api/login", controllers.Login)
	app.Get("/api/user", controllers.User)
	app.Post("/api/logout", controllers.Logout)
	app.Post("/api/send_otp", controllers.SendOTP)
	app.Post("/api/verify_otp", controllers.VerifyOTP)
	app.Post("/api/question", controllers.Question)
	app.Post("/api/answer", controllers.Answer)
	app.Put("/api/change_password", controllers.ChangePassword)
	app.Put("/api/update_profile", controllers.UpdateProfile)

	// promo
	app.Get("/api/active_promos", controllers.ActivePromos)
	app.Post("/api/insert_promo", controllers.InsertPromo)
	app.Get("/api/get_all_promos", controllers.GetAllPromos)
	app.Put("/api/update_promo", controllers.UpdatePromo)

	// city
	app.Get("/api/city", controllers.City)

	// facility
	app.Get("/api/facility", controllers.Facility)

	// flight
	app.Get("/api/get_all_airports", controllers.GetAllAirports)
	app.Post("/api/add_flight_route", controllers.AddFlightRoute)
	app.Get("/api/get_all_flight_routes", controllers.GetAllFlightRoutes)
	app.Get("/api/get_all_airlines", controllers.GetAllAirlines)
	app.Get("/api/get_available_airline_routes", controllers.GetAvailableAirlineRoutes)
	app.Get("/api/get_airline_airplane", controllers.GetAirlineAirplane)
	app.Post("/api/add_flight", controllers.AddFlight)
	app.Get("/api/search_flight_suggestions", controllers.SearchFlightSuggestions)
	app.Get("/api/search_flights", controllers.SearchFlights)
	app.Get("/api/get_flight_detail", controllers.GetFlightDetail)

	// cart
	app.Post("/api/add_flight_to_cart", controllers.AddFlightToCart)
	app.Post("/api/add_hotel_to_cart", controllers.AddHotelToCart)
	app.Get("/api/get_cart", controllers.GetCart)
	app.Put("/api/update_reservation_date", controllers.UpdateReservationDate)
	app.Delete("/api/remove_hotel_from_cart", controllers.RemoveHotelFromCart)
	app.Delete("/api/remove_flight_from_cart", controllers.RemoveFlightFromCart)
	app.Put("/api/pay_with_wallet", controllers.PayWithWallet)
	app.Put("/api/pay_with_credit_card", controllers.PayWithCreditCard)
	app.Put("/api/check_promo", controllers.CheckPromo)
	app.Get("/api/get_all_active_tickets", controllers.GetAllActiveTickets)
	app.Get("/api/get_all_history", controllers.GetAllHistory)
	app.Get("/api/get_total_active_tickets", controllers.GetTotalActiveTickets)
	app.Post("/api/add_hotel_review", controllers.AddHotelReview)

	// hotel
	app.Post("/api/add_hotel", controllers.AddHotel)
	app.Get("/api/get_all_hotels", controllers.GetAllHotels)
	app.Post("/api/add_room_detail", controllers.AddRoomDetail)
	app.Get("/api/search_suggestions", controllers.SearchSuggestions)
	app.Get("/api/search_hotels", controllers.SearchHotels)
	app.Get("/api/get_hotel_detail", controllers.GetHotelDetail)

	// user
	app.Get("/api/get_all_users", controllers.GetAllUsers)
	app.Put("/api/ban_user", controllers.BanUser)
	app.Get("/api/get_all_subscribed_users", controllers.GetAllSubscribedUsers)
	app.Post("/api/send_newsletter", controllers.SendNewsletter)

	// credit card
	app.Get("/api/get_all_banks", controllers.GetAllBanks)
	app.Post("/api/add_credit_card", controllers.AddCreditCard)

	// game
	app.Put("/api/game_reward", controllers.GameReward)
}
