import { useEffect, useState } from "react";
import styles from "./search-field-flight.module.scss";
import Textfield from "../../../../components/textfield/textfield";
import Button from "../../../../components/button/button";
import { IoSearch } from "react-icons/io5";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

export default function SearchFieldFlight() {
  const [active, setActive] = useState("Origin");
  const [originLocation, setOriginLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");

  const [departureDate, setDepartureDate] = useState("");

  const [searchResult, setSearchResult] = useState({
    Countries: [],
    Cities: [],
    Airports: [],
  });
  const [_, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const searchOriginSuggestion = debounce(() => {
    getFlightSuggestion(originLocation);
  }, 500);
  const searchDestinationSuggestion = debounce(() => {
    getFlightSuggestion(destinationLocation);
  }, 500);

  const getFlightSuggestion = async (stuff: string) => {
    if (stuff === "") {
      setSearchResult({
        Countries: [],
        Cities: [],
        Airports: [],
      });
      setLoading(true);
      return;
    }
    setLoading(true);
    const url = `http://localhost:8080/api/search_flight_suggestions/?search=${stuff}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setSearchResult(res);
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchOriginSuggestion();

    return () => searchOriginSuggestion.cancel();
  }, [originLocation]);

  useEffect(() => {
    searchDestinationSuggestion();

    return () => searchDestinationSuggestion.cancel();
  }, [destinationLocation]);

  useEffect(() => {
    console.log(active);
  }, [active]);

  const handleClick = () => {
    // search origin, destination, departure date
    // console.log("a")
    navigate(`/search-flight?origin=${originLocation}&destination=${destinationLocation}&departureDate=${departureDate}`)
  };  

  return (
    <div className={styles.search_container}>
      <div className={styles.location_search_container}>
        <Textfield
          type="text"
          value={originLocation}
          onChange={(e) => {
            setOriginLocation(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setActive("Origin")}
          placeholder="Origin"
          className={`${styles.field} ${styles.left}`}
        />

        <Textfield
          type="text"
          value={destinationLocation}
          onChange={(e) => {
            setDestinationLocation(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Destination"
          onFocus={() => setActive("Destination")}
          className={`${styles.field} ${styles.middle}`}
        />
        <Textfield
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          placeholder="Departure"
          className={`${styles.field} ${styles.middle}`}
        />
        <Button className={styles.search} onClick={handleClick}>
          <IoSearch size={20} />
        </Button>
      </div>
      {searchResult && showDropdown && (
        <div className={`${styles.result_container}`}>
          {searchResult.Countries.map((place: ICountry, idx) => {
            return (
              <div
                onClick={() => {
                  if (active === "Origin") {
                    setOriginLocation(place.Name);
                  } else {
                    setDestinationLocation(place.Name);
                  }
                  setShowDropdown(false);
                }}
                className={styles.result}
                key={idx}
              >
                <div>{place.Name}</div>
                <div className={styles.side}>Country</div>
              </div>
            );
          })}
          {searchResult.Cities.map((place: ICity, idx) => {
            return (
              <div
                onClick={() => {
                  if (active === "Origin") {
                    setOriginLocation(place.Name);
                  } else {
                    setDestinationLocation(place.Name);
                  }
                  setShowDropdown(false);
                }}
                className={styles.result}
                key={idx}
              >
                <div>{place.Name}</div>
                <div className={styles.side}>City</div>
              </div>
            );
          })}
          {searchResult.Airports.map((place: IAirport, idx) => {
            return (
              <div
                onClick={() => {
                  if (active === "Origin") {
                    setOriginLocation(place.Name);
                  } else {
                    setDestinationLocation(place.Name);
                  }
                  setShowDropdown(false);
                }}
                className={styles.result}
                key={idx}
              >
                <div>{place.Name}</div>
                <div className={styles.side}>Airport</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
