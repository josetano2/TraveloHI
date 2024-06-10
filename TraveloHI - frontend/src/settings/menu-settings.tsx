import AdminHotelPage from "../pages/admin/admin-hotel/admin-hotel";
import ForgetPasswordPage from "../pages/forget-password/forget-password";
import GamePage from "../pages/game/game";
import HomePage from "../pages/home/home";
import LoginPage from "../pages/login/login";
import OTPPage from "../pages/otp/otp";
import PredictImagePage from "../pages/predict-image/predict-image";
import RegisterPage from "../pages/register/register";
import SearchHotelPage from "../pages/search/search-hotel";
import MyAccountPage from "../pages/user/my-account/my-account";
import MyCartPage from "../pages/user/my-cart/my-cart";
import AdminHotelDetailPage from "../pages/admin/admin-hotel-detail/admin-hotel-detail";
import HotelDetailPage from "../pages/hotel-detail/hotel-detail";
import AdminManageUserPage from "../pages/admin/manage-user/manage-user";
import AdminSendNewsletterPage from "../pages/admin/send-newsletter/send-newsletter";
import AdminInsertPromoPage from "../pages/admin/admin-insert-promo/admin-insert-promo";
import AdminUpdatePromoPage from "../pages/admin/admin-update-promo/update-promo";
import AdminAddRoutePage from "../pages/admin/admin-add-route/admin-add-route";
import AdminAddAirlineRoutePage from "../pages/admin/admin-add-airline-route/admin-add-airline-route";
import AdminAddFlightPage from "../pages/admin/admin-add-flight/admin-add-flight";
import SearchFlightPage from "../pages/search-flight/search-flight";
import FlightDetailPage from "../pages/flight-detail/flight-detail";
import MyCardsPage from "../pages/user/my-cards/my-cards";
import MyTicketPage from "../pages/user/my-ticket/my-ticket";
import MyHistoryPage from "../pages/user/my-history/my-history";

export interface IMenu {
  name: string;
  path: string;
  element: JSX.Element;
}

export const MENU_LIST: IMenu[] = [
  {
    name: "Login",
    path: "/login",
    element: <LoginPage />,
  },
  {
    name: "Register",
    path: "/register",
    element: <RegisterPage />,
  },
  {
    name: "Home",
    path: "/",
    element: <HomePage />,
  },
  {
    name: "OTP",
    path: "/otp",
    element: <OTPPage />
  },
  {
    name: "Forget Password",
    path: "/forget-password",
    element: <ForgetPasswordPage />
  },
  {
    name: "Predict Image",
    path: "/predict-image",
    element: <PredictImagePage />
  },
  {
    name: "Game",
    path: "/game",
    element: <GamePage />
  },
  {
    name: "Search Hotel",
    path: "/search-hotel",
    element: <SearchHotelPage />
  },
  {
    name: "Search Hotel",
    path: "/search-flight",
    element: <SearchFlightPage />
  },
  {
    name: "Hotel Detail",
    path: "/hotel-detail",
    element: <HotelDetailPage />
  },
  {
    name: "Flight Detail",
    path: "/flight-detail",
    element: <FlightDetailPage />
  },
  // admin
  {
    name: "Insert Promo",
    path: "/admin/insert-promo",
    element: <AdminInsertPromoPage />
  },
  {
    name: "Update Promo",
    path: "/admin/update-promo",
    element: <AdminUpdatePromoPage />
  },
  {
    name: "Manage User",
    path: "/admin/user",
    element: <AdminManageUserPage />
  },
  {
    name: "Send Newsletter",
    path: "/admin/newsletter",
    element: <AdminSendNewsletterPage />
  },
  {
    name: "Admin Hotel",
    path: "/admin/hotel",
    element: <AdminHotelPage />
  },
  {
    name: "Admin Hotel Detail",
    path: "/admin/hotel-detail",
    element: <AdminHotelDetailPage />
  },
  {
    name: "Admin Add Route",
    path: "/admin/add-route",
    element: <AdminAddRoutePage />
  },
  {
    name: "Admin Flight",
    path: "/admin/add-flight",
    element: <AdminAddFlightPage />
  },

  // user
  {
    name: "My Cart",
    path: "/user/my-cart",
    element: <MyCartPage />
  },
  {
    name: "My Ticket",
    path: "/user/my-ticket",
    element: <MyTicketPage />
  },
  {
    name: "My Account",
    path: "/user/my-account",
    element: <MyAccountPage />
  },
  {
    name: "My Cards",
    path: "/user/my-cards",
    element: <MyCardsPage />
  },
  {
    name: "My History",
    path: "/user/my-history",
    element: <MyHistoryPage />
  },
  
];


export const ADDITIONAL_MENU_WITH_EXTRA_HOTEL_NAVBAR = [
  "search-hotel",
  "hotel-detail"
]

export const ADDITIONAL_MENU_WITH_EXTRA_FLIGHT_NAVBAR = [
  "search-flight",
  "flight-detail"
]

export const PAYMENT_METHOD = [
  "HI-Wallet",
  "Credit Card",
]