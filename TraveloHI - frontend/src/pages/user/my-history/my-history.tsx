import styles from "./my-history.module.scss";
import UserTemplate from "../../../templates/user-template/user-template";
import { useUser } from "../../../context/user-context";
import React, { Fragment, useEffect, useState } from "react";
import {
  ICart,
  IFlightCart,
  IHotelCart,
} from "../../../interfaces/cart-interface";
import Loading from "../../../components/loader/loader";
import { useSnackbar } from "../../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../../components/snackbar/snackbar";
import Text from "../../../components/text/text";
import { LiaHotelSolid } from "react-icons/lia";
import { MdFlight } from "react-icons/md";
import Button from "../../../components/button/button";
import Container from "../../../components/container/container";
import { colors } from "../../../components/colors";
import Textfield from "../../../components/textfield/textfield";
import debounce from "lodash.debounce";
import Dialog from "../../../components/dialog/dialog";
import Textarea from "../../../components/textarea/textarea";
import Checkbox from "../../../components/checkbox/checkbox";
import DefaultDropdown from "../../../components/default-dropdown/default-dropdown";

export default function MyHistoryPage() {
  const { user } = useUser();
  const [carts, setCarts] = useState<ICart[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    message: snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();
  const [active, setActive] = useState("hotels");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<IHotelCart>();

  // review
  const [cleanliness, setCleanliness] = useState("");
  const [cleanlinessRating, setCleanlinessRating] = useState("");
  const [comfort, setComfort] = useState("");
  const [comfortRating, setComfortRating] = useState("");
  const [location, setLocation] = useState("");
  const [locationRating, setLocationRating] = useState("");
  const [service, setService] = useState("");
  const [serviceRating, setServiceRating] = useState("");

  const [isAnonymous, setIsAnynomous] = useState(false);

  // infinite scrolling
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(5);

  const handleOpen = (hotel: IHotelCart) => {
    setSelectedHotel(hotel);
    setOpen(!open);
    setCleanliness("");
    setCleanlinessRating(options[0]);
    setComfort("");
    setComfortRating(options[0]);
    setLocation("");
    setLocationRating(options[0]);
    setService("");
    setServiceRating(options[0]);
    setIsAnynomous(false);
  };

  const getAllHistory = async () => {
    if (!user || !user.ID) {
      return;
    }
    const url = `http://localhost:8080/api/get_all_history/?id=${user?.ID}&search=${search}&active=${active}&offset=${offset}&limit=${limit}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setCarts(res);
      } else {
        const error = await response.json();
        handleSnackbar(error.message, SnackbarType.Error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    const response = await fetch("http://localhost:8080/api/add_hotel_review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userID: user?.ID,
        hotelID: selectedHotel?.ID,
        cleanliness,
        cleanlinessRating,
        comfort,
        comfortRating,
        location,
        locationRating,
        service,
        serviceRating,
        isAnonymous,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      setOpen(false);
    } else {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Error);
    }
  };

  useEffect(() => {
    if (user?.ID) {
      getAllHistory();
    }
  }, [user?.ID]);

  useEffect(() => {
    const interval = setInterval(() => {
      getAllHistory();
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);



  const handleActive = (nav: string) => {
    setActive(nav);
  };

  const searchSuggestion = debounce(() => {
    getAllHistory();
  }, 500);

  useEffect(() => {
    searchSuggestion();

    return () => searchSuggestion.cancel();
  }, [search, active]);

  if (loading) return <Loading type={3} />;

  return (
    <UserTemplate>
      <Snackbar
        message={snackbarMessage}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <Dialog className={styles.dialog} open={open} setOpen={setOpen}>
        <Text text="Review" size="2rem" weight="700" />
        <div className={styles.main_review_container}>
          <div className={styles.column_container}>
            <div>
              <Text
                text="Cleanliness"
                size="1rem"
                color={colors.secondaryText}
              />
              <Textarea
                className={styles.textarea}
                placeholder="Cleanliness"
                // type="text"
                value={cleanliness}
                onChange={(e) => setCleanliness(e.target.value)}
              />
              <Text
                text="Cleanliness Rating"
                size="1rem"
                color={colors.secondaryText}
              />
              <DefaultDropdown
                options={options}
                onChange={(e) => setCleanlinessRating(e.target.value)}
                value={cleanlinessRating}
              />
            </div>
            <div>
              <Text text="Comfort" size="1rem" color={colors.secondaryText} />
              <Textarea
                className={styles.textarea}
                placeholder="Comfort"
                // type="text"
                value={comfort}
                onChange={(e) => setComfort(e.target.value)}
              />
              <Text
                text="Comfort Rating"
                size="1rem"
                color={colors.secondaryText}
              />
              <DefaultDropdown
                options={options}
                onChange={(e) => setComfortRating(e.target.value)}
                value={comfortRating}
              />
            </div>
          </div>
          <div className={styles.column_container}>
            <div>
              <Text text="Location" size="1rem" color={colors.secondaryText} />
              <Textarea
                className={styles.textarea}
                placeholder="Location"
                // type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Text
                text="Location Rating"
                size="1rem"
                color={colors.secondaryText}
              />
              <DefaultDropdown
                options={options}
                onChange={(e) => setLocationRating(e.target.value)}
                value={locationRating}
              />
            </div>
            <div>
              <Text text="Service" size="1rem" color={colors.secondaryText} />
              <Textarea
                className={styles.textarea}
                placeholder="Service"
                // type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
              />
              <Text
                text="Service Rating"
                size="1rem"
                color={colors.secondaryText}
              />
              <DefaultDropdown
                options={options}
                onChange={(e) => setCleanlinessRating(e.target.value)}
                value={cleanlinessRating}
              />
            </div>
          </div>
        </div>
        <Checkbox
          id="anonymous"
          checked={isAnonymous}
          text="Anonymous?"
          onChange={(e) => setIsAnynomous(e.target.checked)}
        />
        <Button
          text="Add Review"
          className={styles.dialog_button}
          onClick={handleSubmitReview}
        />
      </Dialog>
      <Text text="My History" size="2rem" weight="700" />
      <>
        <div className={styles.top_container}>
          <div className={styles.navigation_tab}>
            <Button
              onClick={() => {
                handleActive("hotels");
                setSearch("");
              }}
              className={active === "hotels" ? styles.active : styles.static}
              text="Hotels"
            >
              <LiaHotelSolid size={25} />
            </Button>
            <Button
              onClick={() => {
                handleActive("flights");
                setSearch("");
              }}
              className={active === "flights" ? styles.active : styles.static}
              text="Flights"
            >
              <MdFlight size={25} />
            </Button>
          </div>
          <Textfield
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.field}
          />
        </div>
      </>
      <>
        {carts &&
          carts?.length > 0 &&
          active === "hotels" &&
          carts.some((cart) => cart.HotelCarts?.length > 0) && (
            <Text text="Hotel Reservation" size="1.5rem" weight="700" />
          )}
        {carts &&
          carts?.length > 0 &&
          active === "flights" &&
          carts.some((cart) => cart.FlightCarts?.length > 0) && (
            <Text text="Flight Ticket" size="1.5rem" weight="700" />
          )}
        {carts &&
          carts.map((cart, idx) => (
            <Fragment key={idx}>
              {cart.HotelCarts?.length > 0 && active === "hotels" && (
                <>
                  {cart?.HotelCarts.map((hotel: IHotelCart, idx) => {
                    // price logic
                    const checkInFormat = new Date(hotel.CheckInDate);
                    const checkOutFormat = new Date(hotel.CheckOutDate);
                    const today = new Date();
                    const status =
                      checkInFormat > today ? "Upcoming" : "Expired";
                    let diff =
                      checkOutFormat.getTime() - checkInFormat.getTime();
                    let dayDiff = diff / (1000 * 3600 * 24);
                    //   let price = dayDiff * hotel.RoomDetail.Price;

                    return (
                      <Container key={idx}>
                        <Text
                          text={`${hotel.Hotel.Name} - ${hotel.RoomDetail.Name}`}
                          size="1.5rem"
                          weight="700"
                        />
                        <Text
                          text={`${checkInFormat.toLocaleDateString(
                            "en-UK"
                          )} - ${checkOutFormat.toLocaleDateString(
                            "en-UK"
                          )} - ${dayDiff} day(s)`}
                          size="1.1rem"
                        />
                        <Text
                          text={status}
                          size="1.1rem"
                          color={
                            status === "Expired" ? colors.red : colors.green
                          }
                          weight="700"
                        />
                        <Button
                          text="Add Hotel Review"
                          className={styles.button}
                          onClick={() => {
                            handleOpen(hotel);
                          }}
                        />
                      </Container>
                    );
                  })}
                </>
              )}
              {cart.FlightCarts?.length > 0 && active === "flights" && (
                <>
                  {cart?.FlightCarts.map((flight: IFlightCart, idx) => {
                    const departureDate = new Date(
                      flight.Ticket.Seat.Flight.DepartureTime
                    );
                    const today = new Date();
                    const status =
                      departureDate > today ? "Upcoming" : "Expired";
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
                          color={
                            status === "Expired" ? colors.red : colors.green
                          }
                          weight="700"
                        />
                      </Container>
                    );
                  })}
                </>
              )}
            </Fragment>
          ))}
      </>
    </UserTemplate>
  );
}

const options = ["1", "2", "3", "4", "5"];
