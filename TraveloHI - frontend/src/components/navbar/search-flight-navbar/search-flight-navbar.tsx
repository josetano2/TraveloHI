import { useEffect, useState } from "react";
import { useFetch } from "../../../context/fetch-context";
import styles from "./search-flight-navbar.module.scss";
import Textfield from "../../textfield/textfield";
import Button from "../../button/button";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

export default function SearchFlightNavbar() {
  // additional navbar
  const [active, setActive] = useState("Origin");
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e: any) => {};

  const searchSuggestion = debounce(() => {}, 500);

  useEffect(() => {
    searchSuggestion();

    return () => searchSuggestion.cancel();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className={styles.extra_container}>
      <div className={styles.search_container}>
        <div className={styles.form_suggestion_container}>
          <div className={styles.field_container}>
            <Textfield
              type="text"
              value={originLocation}
              placeholder="Origin"
              onChange={(e) => {
                setOriginLocation(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={handleSearch}
              className={styles.field}
            />
            <Textfield
              type="text"
              value={destinationLocation}
              placeholder="Destination"
              onChange={(e) => {
                setDestinationLocation(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={handleSearch}
              className={styles.field}
            />
            <Textfield
              type="date"
              value={departureDate}
              placeholder=""
              onChange={(e) => setDepartureDate(e.target.value)}
              onKeyDown={handleSearch}
              className={styles.field}
            />
          </div>
        </div>
        <Button text="Search Flight" className={styles.button} />
      </div>
    </div>
  );
}
