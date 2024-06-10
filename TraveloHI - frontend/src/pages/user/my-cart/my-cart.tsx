import React, { useEffect, useState } from "react";
import UserTemplate from "../../../templates/user-template/user-template";
import Container from "../../../components/container/container";
import Text from "../../../components/text/text";
import { useUser } from "../../../context/user-context";
import Loading from "../../../components/loader/loader";
import {
  ICart,
  IFlightCart,
  IHotelCart,
} from "../../../interfaces/cart-interface";
import styles from "./my-cart.module.scss";
import { colors } from "../../../components/colors";
import { RiPencilFill } from "react-icons/ri";
import Textfield from "../../../components/textfield/textfield";
import Button from "../../../components/button/button";
import Dialog from "../../../components/dialog/dialog";
import { useSnackbar } from "../../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../../components/snackbar/snackbar";
import { BUSINESS_CLASS_MULTIPLIER } from "../../flight-detail/flight-detail";
import { PAYMENT_METHOD } from "../../../settings/menu-settings";
import DefaultDropdown from "../../../components/default-dropdown/default-dropdown";

export default function MyCartPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<ICart | null>();
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<IRoomDetail>();
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPriceHotel, setTotalPriceHotel] = useState(0);
  const {
    message: snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [totalDeductedPrice, setTotalDeductedPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD[0]);
  const [promoCode, setPromoCode] = useState("");

  // credit card
  const [bankNames, setBankNames] = useState<string[]>([]);
  const [selectedBankName, setSelectedBankName] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [CVV, setCVV] = useState("");
  const [expiredMonth, setExpiredMonth] = useState("");
  const [expiredYear, setExpiredYear] = useState("");

  useEffect(() => {
    if (user?.ID) {
      getCart();
      getAllBanks();
    }
  }, [user?.ID]);

  useEffect(() => {
    if (checkInDate === "" || checkOutDate === "") {
      return;
    }
    calculateGap();
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    if (!cart) return;

    let tempPrice = 0;

    cart?.HotelCarts.forEach((hotel: IHotelCart) => {
      const checkInFormat = new Date(hotel.CheckInDate);
      const checkOutFormat = new Date(hotel.CheckOutDate);

      let diff = checkOutFormat.getTime() - checkInFormat.getTime();

      let dayDiff = diff / (1000 * 3600 * 24);

      tempPrice += dayDiff * hotel.RoomDetail.Price;
    });

    cart?.FlightCarts.forEach((flight: IFlightCart) => {
      const departureDate = new Date(flight.Ticket.Seat.Flight.DepartureTime);
      const today = new Date();

      if (departureDate > today) {
        const multiplier = flight.Ticket.Seat.Flight.Airline.Multiplier;
        const cost = flight.Ticket.Seat.Flight.FlightRoute.Price;
        const classMultiplier =
          flight.Ticket.Seat.Class !== "Business"
            ? 1
            : BUSINESS_CLASS_MULTIPLIER;
        const baggageCost =
          flight.Ticket.BaggageWeight *
          flight.Ticket.Seat.Flight.Airline.BaggageFee;
        tempPrice += cost * multiplier * classMultiplier + baggageCost;
      }
    });
    setTotalCartPrice(tempPrice);
  }, [cart]);

  const getCart = async () => {
    setLoading(true);
    const url = `http://localhost:8080/api/get_cart/?id=${user?.ID}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        if (res.message === "No Cart") {
          setCart(null);
        } else {
          setCart(res);
          console.log(res);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (room: IRoomDetail) => {
    setSelectedRoom(room);
    setOpen(!open);
    setTotalPriceHotel(0);
    setCheckInDate("");
    setCheckOutDate("");
  };

  const handleDateUpdate = async () => {
    const response = await fetch(
      "http://localhost:8080/api/update_reservation_date",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          checkInDate,
          checkOutDate,
          cartID: cart?.ID,
        }),
      }
    );

    if (response.ok) {
      // something
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const handleRemoveHotelFromCart = async (hotelCart: IHotelCart) => {
    const url = `http://localhost:8080/api/remove_hotel_from_cart/?id=${hotelCart.ID}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const handleRemoveFlightFromCart = async (flight: IFlightCart) => {
    const url = `http://localhost:8080/api/remove_flight_from_cart/?flight_cart_id=${flight?.ID}&ticket_id=${flight.TicketID}&seat_id=${flight.Ticket.SeatID}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const handleCheckPromo = async () => {
    const response = await fetch("http://localhost:8080/api/check_promo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userID: user?.ID,
        promoCode,
        totalCartPrice,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setTotalDeductedPrice(data.price);
      handleSnackbar(data.message, SnackbarType.Success);
      // window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const handlePayWithWallet = async () => {
    const response = await fetch("http://localhost:8080/api/pay_with_wallet", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cartID: cart?.ID,
        userID: user?.ID,
        promoCode,
        totalCartPrice:
          totalDeductedPrice === 0 ? totalCartPrice : totalDeductedPrice,
        paymentMethod,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };
  const handlePayWithCreditCard = async () => {
    const response = await fetch(
      "http://localhost:8080/api/pay_with_credit_card",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartID: cart?.ID,
          userID: user?.ID,
          promoCode,
          totalCartPrice:
            totalDeductedPrice === 0 ? totalCartPrice : totalDeductedPrice,
          paymentMethod,
          selectedBankName,
          name,
          number,
          CVV,
          expiredMonth,
          expiredYear,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const getAllBanks = async () => {
    const response = await fetch("http://localhost:8080/api/get_all_banks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      const formatted = data.map((bank: IBank) => bank.Name);
      setBankNames(formatted);
      if (data.length > 0) {
        setSelectedBankName(formatted[0]);
      }
    }
  };

  const calculateGap = () => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    let diff = checkOut.getTime() - checkIn.getTime();

    let dayDiff = diff / (1000 * 3600 * 24);

    if (selectedRoom) {
      let price = dayDiff * selectedRoom?.Price;
      setTotalPriceHotel(price);
    }
  };

  if (loading) return <Loading type={3} />;

  if (!cart || (cart.FlightCarts.length <= 0 && cart.HotelCarts.length <= 0))
    return (
      <UserTemplate>
        <Container>
          <Text text="Cart is empty" size="1.5rem" weight="700" />
        </Container>
      </UserTemplate>
    );

  return (
    <UserTemplate>
      <Snackbar
        message={snackbarMessage}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />

      <Dialog open={open} setOpen={setOpen}>
        <>
          <Text text={selectedRoom?.Name} size="1.5rem" weight="700" />
          <div>
            <Text
              text="Check In Date"
              size="1rem"
              color={colors.secondaryText}
            />
            <Textfield
              placeholder=""
              onChange={(e) => setCheckInDate(e.target.value)}
              value={checkInDate}
              type="date"
            />
          </div>
          <div>
            <Text
              text="Check Out Date"
              size="1rem"
              color={colors.secondaryText}
            />
            <Textfield
              placeholder=""
              onChange={(e) => setCheckOutDate(e.target.value)}
              value={checkOutDate}
              type="date"
            />
          </div>
          <Text
            text={`Rp. ${
              checkInDate === "" || checkOutDate === ""
                ? 0
                : totalPriceHotel.toLocaleString()
            }`}
            size="1.5rem"
            weight="700"
            color={colors.orange}
            className={styles.price}
          />
          <Button text="Update Date" onClick={handleDateUpdate} />
        </>
      </Dialog>
      <Text text="My Cart" size="2rem" weight="700" />
      {/* <Container> */}
      <>
        {cart && (
          <>
            {cart?.HotelCarts?.length > 0 && (
              <>
                <Text text="Hotel Reservation" size="1.5rem" weight="700" />
                {cart?.HotelCarts.map((hotel: IHotelCart, idx) => {
                  // price logic
                  const checkInFormat = new Date(hotel.CheckInDate);
                  const checkOutFormat = new Date(hotel.CheckOutDate);
                  const today = new Date();
                  const status = checkInFormat > today ? "Upcoming" : "Expired";
                  let diff = checkOutFormat.getTime() - checkInFormat.getTime();
                  let dayDiff = diff / (1000 * 3600 * 24);
                  let price = dayDiff * hotel.RoomDetail.Price;

                  return (
                    <Container key={idx}>
                      <Text
                        text={hotel.Hotel.Name}
                        size="1.5rem"
                        weight="700"
                      />
                      <div className={styles.flex_container}>
                        <Text
                          text={`${checkInFormat.toLocaleDateString(
                            "en-UK"
                          )} - ${checkOutFormat.toLocaleDateString(
                            "en-UK"
                          )} - ${dayDiff} day(s)`}
                          size="1.1rem"
                        />
                        <RiPencilFill
                          onClick={() => handleOpen(hotel.RoomDetail)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>
                      <Text
                        text={status}
                        size="1.1rem"
                        color={status === "Expired" ? colors.red : colors.green}
                        weight="700"
                      />
                      <>
                        {status === "Upcoming" && (
                          <Text
                            text={`Rp. ${price.toLocaleString()}`}
                            size="1.5rem"
                            weight="700"
                            color={colors.orange}
                          />
                        )}
                      </>
                      <Button
                        text="Remove from Cart"
                        className={styles.button}
                        onClick={() => handleRemoveHotelFromCart(hotel)}
                      />
                    </Container>
                  );
                })}
              </>
            )}
            {cart?.FlightCarts?.length > 0 && (
              <>
                <Text text="Flight Seat" size="1.5rem" weight="700" />
                {/* <Container className={styles.flight_container}> */}
                {cart?.FlightCarts.map((flight: IFlightCart, idx) => {
                  // price logic
                  const departureDate = new Date(
                    flight.Ticket.Seat.Flight.DepartureTime
                  );
                  const today = new Date();
                  const status = departureDate > today ? "Upcoming" : "Expired";
                  const multiplier =
                    flight.Ticket.Seat.Flight.Airline.Multiplier;
                  const cost = flight.Ticket.Seat.Flight.FlightRoute.Price;
                  const classMultiplier =
                    flight.Ticket.Seat.Class !== "Business"
                      ? 1
                      : BUSINESS_CLASS_MULTIPLIER;
                  const baggageCost =
                    flight.Ticket.BaggageWeight *
                    flight.Ticket.Seat.Flight.Airline.BaggageFee;
                  const finalPrice =
                    cost * multiplier * classMultiplier + baggageCost;

                  return (
                    <Container key={idx}>
                      <Text
                        text={`${flight.Ticket.Seat.Flight.Code} (${flight.Ticket.Seat.Flight.FlightRoute.Origin.Code} - ${flight.Ticket.Seat.Flight.FlightRoute.Destination.Code})`}
                        size="1.5rem"
                        weight="700"
                      />
                      <Text
                        text={`${departureDate.toLocaleString("en-UK")} - ${
                          flight.Ticket.Seat.Flight.FlightRoute.Duration
                        } minutes`}
                        size="1.1rem"
                      />
                      <Text
                        text={`Seat: ${flight.Ticket.Seat.Code} (${flight.Ticket.Seat.Class})`}
                        size="1rem"
                      />
                      <Text
                        text={`Baggage: ${flight.Ticket.BaggageWeight} kg(s)`}
                        size="1rem"
                      />
                      <Text
                        text={status}
                        size="1.1rem"
                        color={status === "Expired" ? colors.red : colors.green}
                        weight="700"
                      />
                      <>
                        {status === "Upcoming" && (
                          <Text
                            text={`Rp. ${finalPrice.toLocaleString()}`}
                            size="1.5rem"
                            weight="700"
                            color={colors.orange}
                          />
                        )}

                        <Button
                          text="Remove from Cart"
                          className={styles.button}
                          onClick={() => handleRemoveFlightFromCart(flight)}
                        />
                      </>
                    </Container>
                  );
                })}

                {/* </Container> */}
              </>
            )}
            <Container>
              <div className={styles.flex_container}>
                <Text text={"Total Price: "} size="1.5rem" weight="700" />
                <Text
                  text={`Rp. ${
                    totalDeductedPrice === 0
                      ? totalCartPrice.toLocaleString()
                      : totalDeductedPrice.toLocaleString()
                  }`}
                  size="1.5rem"
                  weight="700"
                  color={colors.orange}
                />
              </div>
              <div>
                <Text
                  text="Payment Method"
                  size="1rem"
                  color={colors.secondaryText}
                />
                <select
                  className={styles.combo_box}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  {PAYMENT_METHOD.map((method, idx) => (
                    <option key={idx} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              {paymentMethod === "Credit Card" ? (
                <>
                  <div>
                    <Text
                      text="Bank"
                      size="1rem"
                      color={colors.secondaryText}
                    />
                    <DefaultDropdown
                      onChange={(e) => setSelectedBankName(e.target.value)}
                      options={bankNames}
                      value={selectedBankName}
                    />
                  </div>
                  <div>
                    <Text
                      text="Card Name"
                      size="1rem"
                      color={colors.secondaryText}
                    />
                    <Textfield
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Card Name"
                    />
                  </div>
                  <div>
                    <Text
                      text="Card Number"
                      size="1rem"
                      color={colors.secondaryText}
                    />
                    <Textfield
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Card Number"
                    />
                  </div>
                  <div className={styles.split_container}>
                    <div className={styles.field_container}>
                      <Text
                        text="CVV"
                        size="1rem"
                        color={colors.secondaryText}
                      />
                      <Textfield
                        className={styles.field}
                        placeholder="CVV"
                        type="number"
                        value={CVV}
                        onChange={(e) => setCVV(e.target.value)}
                      />
                    </div>
                    <div className={styles.field_container}>
                      <Text
                        text="Expired Month"
                        size="1rem"
                        color={colors.secondaryText}
                      />
                      <Textfield
                        className={styles.field}
                        placeholder="Expired Month"
                        type="text"
                        value={expiredMonth}
                        onChange={(e) => setExpiredMonth(e.target.value)}
                      />
                    </div>
                    <div className={styles.field_container}>
                      <Text
                        text="Expired Year"
                        size="1rem"
                        color={colors.secondaryText}
                      />
                      <Textfield
                        className={styles.field}
                        placeholder="Expired Year"
                        type="text"
                        value={expiredYear}
                        onChange={(e) => setExpiredYear(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div>
                <Text
                  text="Promo Code"
                  size="1rem"
                  color={colors.secondaryText}
                />
                <Textfield
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Promo Code"
                />
              </div>
              <Button
                text="Check Promo"
                onClick={handleCheckPromo}
                className={styles.blue_button}
              />
              <Button
                text="Checkout"
                onClick={
                  paymentMethod === "HI-Wallet"
                    ? handlePayWithWallet
                    : handlePayWithCreditCard
                }
              />
            </Container>
          </>
        )}
      </>
      {/* </Container> */}
    </UserTemplate>
  );
}
