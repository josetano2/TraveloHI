import React, { useEffect, useState } from "react";
import MainTemplate from "../../templates/main-template/main-template";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "../../components/container/container";
import Text from "../../components/text/text";
import styles from "./flight-detail.module.scss";
import { colors } from "../../components/colors";
import Loading from "../../components/loader/loader";
import SeatingCart from "./seating-chart/searting-chart";
import Textfield from "../../components/textfield/textfield";
import Button from "../../components/button/button";
import { useUser } from "../../context/user-context";
import Snackbar, { SnackbarType } from "../../components/snackbar/snackbar";
import { useSnackbar } from "../../context/snackbar-context";

interface FlightDetail {
  Flight: IFlight;
  Seats: ISeat[];
}

export const BUSINESS_CLASS_MULTIPLIER = 1.2;

export default function FlightDetailPage() {
  const [loading, setLoading] = useState(false);
  const [flight, setFlight] = useState<FlightDetail | null>();
  const [selectedSeatsNumber, setSelectedSeatsNumber] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
  const [extraBaggage, setExtraBaggage] = useState("0");
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const {
    message: snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();
  
  const price =
    flight?.Flight.FlightRoute.Price! * flight?.Flight.Airline.Multiplier!;
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("id");
  const { user } = useUser();

  useEffect(() => {
    getFlightDetail(parseInt(query as string, 10));
  }, []);

  useEffect(() => {
    let temp = 0;
    for (let i = 0; i < selectedSeats.length; i++) {
      temp +=
        selectedSeats[i].Flight.FlightRoute.Price *
        flight?.Flight.Airline.Multiplier!;
      if (selectedSeats[i].Class === "Business") {
        temp *= BUSINESS_CLASS_MULTIPLIER;
      }
    }
    let baggageFee = 0;
    // baggage
    if (extraBaggage !== "" && extraBaggage !== "0") {
      baggageFee =
        parseFloat(extraBaggage) * flight?.Flight.Airline.BaggageFee!;
    }
    console.log(baggageFee);
    temp += baggageFee;

    setTotalPrice(temp);
  }, [selectedSeats, extraBaggage]);

  const getFlightDetail = async (flightID: number) => {
    setLoading(true);
    const url = `http://localhost:8080/api/get_flight_detail/?id=${flightID}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setFlight(res);
        console.log(res);
      } else {
        setFlight(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const departureDate = new Date(
    flight?.Flight.DepartureTime.split("T")[0] as string
  );
  const arrivalDate = new Date(
    flight?.Flight.ArrivalTime.split("T")[0] as string
  );

  const handleAddToCart = async () => {
    const response = await fetch(
      "http://localhost:8080/api/add_flight_to_cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          selectedSeats,
          extraBaggage: parseFloat(extraBaggage),
          userID: user?.ID
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

  if (loading) return <Loading type={3} />;

  return (
    <MainTemplate>
      <Snackbar
        message={snackbarMessage}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <div className={styles.main_container}>
        <div>
          <Text
            text={`${flight?.Flight.Code} (${flight?.Flight.Airline.Name})`}
            size="2.5rem"
            weight="700"
          />
          <Text
            text={`From ${flight?.Flight.FlightRoute.Origin.City.Name}, ${flight?.Flight.FlightRoute.Origin.City.Country.Name} (${flight?.Flight.FlightRoute.Origin.Code}) to ${flight?.Flight.FlightRoute.Destination.City.Name}, ${flight?.Flight.FlightRoute.Destination.City.Country.Name} (${flight?.Flight.FlightRoute.Destination.Code}) - ${flight?.Flight.FlightRoute.Duration} minutes`}
            size="2rem"
            weight="500"
          />
        </div>
        <div className={styles.info_baggage_container}>
          <Container className={styles.container}>
            <div className={styles.detail_container}>
              <img
                className={styles.logo}
                src={flight?.Flight.Airline.Image}
                alt=""
              />

              <div className={styles.flight_information_container}>
                <div className={styles.flight_container}>
                  <Text
                    text={departureDate.toLocaleDateString("en-UK")}
                    size="1rem"
                  />
                  <Text
                    text={`${
                      flight?.Flight.DepartureTime.split("T")[1]
                        .split("+")[0]
                        .split(":")[0]
                    }:${
                      flight?.Flight.DepartureTime.split("T")[1]
                        .split("+")[0]
                        .split(":")[1]
                    }`}
                    size="1.7rem"
                    weight="700"
                  />
                  <Text
                    text={flight?.Flight.FlightRoute.Origin.Code}
                    size="1rem"
                  />
                </div>
                <div className={styles.small_divider} />
                <div className={styles.flight_container}>
                  <Text
                    text={arrivalDate.toLocaleDateString("en-UK")}
                    size="1rem"
                  />
                  <Text
                    text={`${
                      flight?.Flight.ArrivalTime.split("T")[1]
                        .split("+")[0]
                        .split(":")[0]
                    }:${
                      flight?.Flight.ArrivalTime.split("T")[1]
                        .split("+")[0]
                        .split(":")[1]
                    }`}
                    size="1.7rem"
                    weight="700"
                  />
                  <Text
                    text={flight?.Flight.FlightRoute.Destination.Code}
                    size="1rem"
                  />
                </div>
              </div>
              <div className={styles.flight_container}>
                <Text
                  text="Starting From"
                  size="1rem"
                  color={colors.secondaryText}
                />
                <Text
                  text={`Rp. ${price.toLocaleString()}`}
                  size="1.5rem"
                  color={colors.orange}
                  weight="700"
                />
              </div>
            </div>
          </Container>
          {/* <img src={flight?.Flight.Airline.Image} alt="" /> */}
          <Container className={styles.baggage_container}>
            <Text text="Baggage" size="1.5rem" weight="700" />
            {/* <div className={styles.divider} /> */}
            <Text
              text={`${flight?.Flight.IncludedBaggage} kg Included Baggage`}
              size="1.1rem"
            />
            <div>
              <Textfield
                type="number"
                placeholder="Baggage Add-Ons"
                value={extraBaggage}
                onChange={(e) => setExtraBaggage(e.target.value)}
              />
            </div>
          </Container>
        </div>
        <div>
          <Text text="Seating Chart" size="2.5rem" weight="700" />
          {flight && flight.Seats.length > 0 && (
            <SeatingCart
              seats={flight.Seats}
              selectedSeatsNumber={selectedSeatsNumber}
              setSelectedSeatsNumber={setSelectedSeatsNumber}
              setSelectedSeats={setSelectedSeats}
            />
          )}
        </div>
        <div>
          <Text text="Price Detail" size="2.5rem" weight="700" />
          <Container className={styles.price_container}>
            <div>
              <Text
                text={`Selected Flight (${selectedSeats.length})`}
                size="1.4rem"
              />
              <div className={styles.selected_seat_container}>
                {selectedSeats.length > 0 &&
                  selectedSeats.map((seat, idx) => {
                    return (
                      <Text
                        key={idx}
                        text={`${seat.Code} (${seat.Class})`}
                        color={colors.secondaryText}
                        size="1.1rem"
                      />
                    );
                  })}
              </div>
              {selectedSeats.length <= 0 && (
                <>
                  <Text
                    text="No seats selected yet. Please choose your preferred seat(s)
                from the seating chart above"
                    size="1.1rem"
                    color={colors.secondaryText}
                  />
                </>
              )}
            </div>
            <div>
              <Text text="Extra Baggage" size="1.4rem" />
              <Text
                text={`${extraBaggage === "" ? 0 : extraBaggage} kg`}
                size="1.1rem"
                color={colors.secondaryText}
              />
            </div>
            <Text
              text={`Rp. ${totalPrice.toLocaleString()}`}
              size="1.5rem"
              color={colors.orange}
              weight="700"
            />
            <div className={styles.button_container}>
              {selectedSeats.length > 0 ? (
                <>
                  <Button text="Buy Now" className={styles.main_button} />
                  <Button
                    text="Add to Cart"
                    className={styles.main_button}
                    onClick={handleAddToCart}
                  />
                </>
              ) : (
                <>
                  <Button text="Buy Now" className={styles.disabled_button} />
                  <Button
                    text="Add to Cart"
                    className={styles.disabled_button}
                    // onClick={handleAddToCart}
                  />
                </>
              )}
            </div>
          </Container>
        </div>
      </div>
    </MainTemplate>
  );
}
