import React, { useEffect, useState } from "react";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import Text from "../../../components/text/text";
import styles from "./admin-add-route.module.scss";
import Container from "../../../components/container/container";
import DefaultDropdown from "../../../components/default-dropdown/default-dropdown";
import { colors } from "../../../components/colors";
import Textfield from "../../../components/textfield/textfield";
import Button from "../../../components/button/button";
import Checkbox from "../../../components/checkbox/checkbox";

export default function AdminAddRoutePage() {
  const [airports, setAirports] = useState<IAirport[]>([]);
  const airportNames = airports.map((airport) => airport.Name);
  const [originAirportName, setOriginAirportName] = useState("");
  const [destinationAirportName, setDestinationAirportName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [airlines, setAirlines] = useState<IAirline[]>([]);
  const [selectedAirlines, setSelectedAirlines] = useState<number[]>([]);

  const getAllAirports = async () => {
    const response = await fetch("http://localhost:8080/api/get_all_airports", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      setAirports(data);
      if (data.length > 0) {
        setOriginAirportName(data[0].Name);
        setDestinationAirportName(data[0].Name);
      }
    }
  };

  const getAllAirlines = async () => {
    const response = await fetch("http://localhost:8080/api/get_all_airlines", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const data = await response.json();
      setAirlines(data);
      console.log(data);
    }
  };

  const handleAirlineChange = (id: number) => {
    setSelectedAirlines((prevArr) => {
      if (prevArr.includes(id)) {
        return prevArr.filter((currID) => currID !== id);
      } else {
        return [...prevArr, id];
      }
    });
    // console.log(selectedAirlines)
  };

  const handleSubmit = async () => {
    console.log(originAirportName);
    const response = await fetch("http://localhost:8080/api/add_flight_route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        originAirportName,
        destinationAirportName,
        duration: parseFloat(duration),
        price: parseFloat(price),
        selectedAirlines
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  };

  useEffect(() => {
    getAllAirports();
    getAllAirlines();
  }, []);

  return (
    <AdminTemplate>
      <Text text="Add Route" size="1.5rem" weight="700" />
      <Container>
        <>
          <Text text="Origin" size="1rem" color={colors.secondaryText} />
          <DefaultDropdown
            options={airportNames}
            value={originAirportName}
            onChange={(e) => setOriginAirportName(e.target.value)}
          />
          <Text text="Destination" size="1rem" color={colors.secondaryText} />
          <DefaultDropdown
            options={airportNames}
            value={destinationAirportName}
            onChange={(e) => setDestinationAirportName(e.target.value)}
          />
          <div className={styles.split_container}>
            <div className={styles.field_container}>
              <Text text="Duration" size="1rem" color={colors.secondaryText} />
              <Textfield
                className={styles.field}
                placeholder="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className={styles.field_container}>
              <Text text="Price" size="1rem" color={colors.secondaryText} />
              <Textfield
                className={styles.field}
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.checklist_container}>
          {airlines?.map((airline) => (
            <Checkbox
              key={airline.ID}
              id={airline.ID.toString()}
              text={airline.Name}
              checked={selectedAirlines.includes(airline.ID)}
              onChange={() => handleAirlineChange(airline.ID)}
            />
          ))}
        </div>
          <Button text="Add Route" onClick={handleSubmit} />
        </>
      </Container>
    </AdminTemplate>
  );
}
