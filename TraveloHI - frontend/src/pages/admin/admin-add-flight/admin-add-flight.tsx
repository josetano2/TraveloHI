import { useEffect, useState } from "react";
import Container from "../../../components/container/container";
import Text from "../../../components/text/text";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import styles from "./admin-add-flight.module.scss";
import DefaultDropdown from "../../../components/default-dropdown/default-dropdown";
import { colors } from "../../../components/colors";
import Textfield from "../../../components/textfield/textfield";
import Button from "../../../components/button/button";
import { useSnackbar } from "../../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../../components/snackbar/snackbar";

export default function AdminAddFlightPage() {
  // select airline
  const [airlines, setAirlines] = useState<IAirline[]>([]);
  const [selectedAirlineName, setSelectedAirlineName] = useState("");
  const airlineNames = airlines.map((airline) => airline.Name);

  // select route yang bisa diambil
  const [availableRoutes, setAvailableRoutes] = useState<IFlightRoute[]>([]);
  const [airlineRouteTemplate, setAirlineRouteTemplate] = useState<string[]>(
    []
  );

  // pilih route
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedRouteId, setSelectedRouteId] = useState("");

  // pilih tanggal yang available
  const [departureTime, setDepartureTime] = useState<string>("");

  // pilih pesawat yang ada
  const [_, setAirplanes] = useState<IAirplane[]>([]);
  const [airplaneRouteTemplate, setAirplaneRouteTemplate] = useState<string[]>(
    []
  );
  const [selectedAirplane, setSelectedAirplane] = useState("");
  const [selectedAirplaneId, setSelectedAirplaneId] = useState("");

  // free baggage
  const [freeBaggage, setFreeBaggage] = useState("10");

  const {
    message: snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();

  // donne

  // functions

  const getAllAirlines = async () => {
    const response = await fetch("http://localhost:8080/api/get_all_airlines", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      setAirlines(data);
      if (data.length > 0) {
        setSelectedAirlineName(data[0].Name);
        getAvailableRoutes(data[0].Name);
        getAirlineAirplane(data[0].Name);
      }
    }
  };

  const getAvailableRoutes = async (stuff: string) => {
    const url = `http://localhost:8080/api/get_available_airline_routes/?name=${stuff}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      setAvailableRoutes(data);
      const formatted = data.map(
        (route: IFlightRoute) =>
          `${route.ID}. ${route.Origin.City.Name} (${route.Origin.Code}) - ${route.Destination.City.Name} (${route.Destination.Code})`
      );
      setAirlineRouteTemplate(formatted);
    }
  };

  const getAirlineAirplane = async (stuff: string) => {
    const url = `http://localhost:8080/api/get_airline_airplane/?airline=${stuff}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      setAirplanes(data);
      const formatted = data.map(
        (airplane: IAirplane) =>
          `${airplane.ID}. ${airplane.Name} (${airplane.Type})`
      );
      setAirplaneRouteTemplate(formatted);
      console.log(data);
    }
  };

  useEffect(() => {
    getAllAirlines();
  }, []);

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:8080/api/add_flight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        selectedRouteId: parseInt(selectedRouteId),
        selectedAirlineName,
        selectedAirplaneId: parseInt(selectedAirplaneId),
        departureTime,
        freeBaggage: parseFloat(freeBaggage),
      }),
    });
    const data = await response.json()
    if (response.ok) {
      handleSnackbar(data.message, SnackbarType.Success)
    }
    else{
      handleSnackbar(data.message, SnackbarType.Error)
    }
  };

  return (
    <AdminTemplate>
      <Snackbar
          message={snackbarMessage}
          isOpen={isSnackbarOpen}
          onClose={() => setIsSnackbarOpen(false)}
          type={snackbarType}
        />
      <Text size="1.5rem" weight="700" text="Add Flight" />
      <Container>
        <>
          <div>
            <Text text="Airline" size="1rem" color={colors.secondaryText} />
            <DefaultDropdown
              options={airlineNames}
              value={selectedAirlineName}
              onChange={(e) => {
                setSelectedAirlineName(e.target.value);
                getAvailableRoutes(e.target.value);
                getAirlineAirplane(e.target.value);
              }}
            />
          </div>
          {selectedAirlineName !== "" && (
            <>
              <div>
                <Text text="Routes" size="1rem" color={colors.secondaryText} />
                <DefaultDropdown
                  options={airlineRouteTemplate}
                  value={selectedRoute}
                  onChange={(e) => {
                    setSelectedRoute(e.target.value);
                    const id = e.target.value.split(".")[0];
                    setSelectedRouteId(id);
                    console.log(id);
                  }}
                />
              </div>
              <div>
                <Text
                  text="Departure Time"
                  size="1rem"
                  color={colors.secondaryText}
                />
                <Textfield
                  type="datetime-local"
                  placeholder=""
                  onChange={(e) => setDepartureTime(e.target.value)}
                  value={departureTime}
                />
              </div>
              <div>
                <Text
                  text="Airplane"
                  size="1rem"
                  color={colors.secondaryText}
                />
                <DefaultDropdown
                  options={airplaneRouteTemplate}
                  value={selectedAirplane}
                  onChange={(e) => {
                    setSelectedAirplane(e.target.value);
                    const id = e.target.value.split(".")[0];
                    setSelectedAirplaneId(id);
                  }}
                />
              </div>
              <div>
                <Text
                  text="Free Baggage"
                  size="1rem"
                  color={colors.secondaryText}
                />
                <Textfield
                  type="number"
                  placeholder=""
                  onChange={(e) => setFreeBaggage(e.target.value)}
                  value={freeBaggage}
                />
              </div>
              <Button text="Create Flight" onClick={handleSubmit} />
            </>
          )}
        </>
      </Container>
    </AdminTemplate>
  );
}
