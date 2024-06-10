import { useEffect, useState } from "react";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import Text from "../../../components/text/text";
import styles from "./admin-add-airline-route.module.scss";

export default function AdminAddAirlineRoutePage() {
  const [isSelected, setIsSelected] = useState(false);
  const [flightRoutes, setFlightRoutes] = useState<IFlightRoute[]>([]);
  const [selectedFlightRoute, setSelectedFlightRoute] =
    useState<IFlightRoute>();

  const [airlines, setAirlines] = useState<IAirline[]>([]);

  const getAllFlightRoutes = async () => {
    const response = await fetch(
      "http://localhost:8080/api/get_all_flight_routes",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setFlightRoutes(data);
      console.log(data);
    }
  };

  const getAllAirlines = async () => {
    const response = await fetch(
      "http://localhost:8080/api/get_all_airlines",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setAirlines(data);
      console.log(data);
    }
  };

  useEffect(() => {
    getAllFlightRoutes();
    // getAllAirlines();
  }, []);

  

  return (
    <AdminTemplate>
      <>
        {!isSelected && (
          <>
            <Text text="Select Routes" weight="700" size="1.5rem" />
            <div className={styles.list_container}>
              {flightRoutes &&
                flightRoutes.map((route, idx) => {
                  return (
                    <div
                      onClick={() => {
                        setIsSelected(true);
                        setSelectedFlightRoute(route);
                      }}
                      className={styles.select_container}
                      key={idx}
                    >
                      <Text
                        size="1rem"
                        text={`${route.Origin.City.Name} (${route.Origin.Code}) -> ${route.Destination.City.Name} (${route.Destination.Code})`}
                      />
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </>
    </AdminTemplate>
  );
}
