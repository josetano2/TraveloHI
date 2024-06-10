import { useEffect, useState } from "react";
import Text from "../../../components/text/text";
import { useUser } from "../../../context/user-context";
import UserTemplate from "../../../templates/user-template/user-template";
import styles from "./my-ticket.module.scss";
import {
  IActiveTickets,
  ICart,
  IFlightCart,
  IHotelCart,
} from "../../../interfaces/cart-interface";
import Loading from "../../../components/loader/loader";
import { RiPencilFill } from "react-icons/ri";
import Button from "../../../components/button/button";
import { colors } from "../../../components/colors";
import Container from "../../../components/container/container";
import { BUSINESS_CLASS_MULTIPLIER } from "../../flight-detail/flight-detail";
import { LiaHotelSolid } from "react-icons/lia";
import { MdFlight } from "react-icons/md";
import Textfield from "../../../components/textfield/textfield";
import debounce from "lodash.debounce";

export default function MyTicketPage() {
  const { user } = useUser();
  const [activeTickets, setActiveTickets] = useState<IActiveTickets | null>();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("hotels");
  const [search, setSearch] = useState("");

  const getAllActiveTicket = async () => {
    const url = `http://localhost:8080/api/get_all_active_tickets/?id=${user?.ID}&search=${search}&active=${active}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        if (res.message === "No Cart") {
          setActiveTickets(null);
        } else {
          setActiveTickets(res);
          console.log(res);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.ID) {
      getAllActiveTicket();
    }
  }, [user?.ID]);

  const handleActive = (nav: string) => {
    setActive(nav);
  };

  const searchSuggestion = debounce(() => {
    getAllActiveTicket();
  }, 500);

  useEffect(() => {
    searchSuggestion();

    return () => searchSuggestion.cancel();
  }, [search, active]);

  if (loading) return <Loading type={3} />;

  return (
    <UserTemplate>
      <Text text="My Ticket" size="2rem" weight="700" />
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
        {activeTickets && (
          <>
            {activeTickets?.HotelCarts?.length > 0 && active === "hotels" && (
              <>
                <Text text="Hotel Reservation" size="1.5rem" weight="700" />
                {activeTickets?.HotelCarts.map((hotel: IHotelCart, idx) => {
                  // price logic
                  const checkInFormat = new Date(hotel.CheckInDate);
                  const checkOutFormat = new Date(hotel.CheckOutDate);
                  // const today = new Date();
                  //   const status = checkInFormat > today ? "Upcoming" : "Expired";
                  let diff = checkOutFormat.getTime() - checkInFormat.getTime();
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
                    </Container>
                  );
                })}
              </>
            )}
            {activeTickets?.FlightCarts?.length > 0 && active === "flights" && (
              <>
                <Text text="Flight Ticket" size="1.5rem" weight="700" />
                {activeTickets?.FlightCarts?.map((flight: IFlightCart, idx) => {
                  const departureDate = new Date(
                    flight.Ticket.Seat.Flight.DepartureTime
                  );
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
                    </Container>
                  );
                })}
              </>
            )}
          </>
        )}
      </>
    </UserTemplate>
  );
}
