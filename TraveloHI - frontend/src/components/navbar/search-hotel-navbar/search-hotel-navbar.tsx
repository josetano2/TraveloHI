import { useEffect, useState } from "react";
import { useFetch } from "../../../context/fetch-context";
import styles from "./search-hotel-navbar.module.scss";
import Textfield from "../../textfield/textfield";
import Button from "../../button/button";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";

export default function SearchHotelNavbar() {
  // additional navbar
  const { search: searchQuery } = useLocation();
  const query = new URLSearchParams(searchQuery).get("query");
  const [showDropdown, setShowDropdown] = useState(false);
  const [hotelLocation, setHotelLocation] = useState("");
  const { searchResult, suggestion } = useFetch();
  const navigate = useNavigate();

  const handleSearch = (e: any) => {
    if (e.key === "Enter") {
      navigate(`/search-hotel?query=${hotelLocation}`);
      window.location.reload();
    }
  };

  const searchSuggestion = debounce(() => {
    suggestion(hotelLocation);
  }, 500);

  useEffect(() => {
    searchSuggestion();

    return () => searchSuggestion.cancel();
  }, [hotelLocation]);

  useEffect(() => {
    setHotelLocation(query as string);
    suggestion(query as string);
  }, []);

  return (
    <div className={styles.extra_container}>
      <div className={styles.search_container}>
        <div className={styles.form_suggestion_container}>
          <Textfield
            type="text"
            value={hotelLocation}
            placeholder="Search"
            onChange={(e) => {
              setHotelLocation(e.target.value);
              setShowDropdown(true);
            }}
            onKeyDown={handleSearch}
            className={styles.field}
          />
          {searchResult && showDropdown && (
            <div className={styles.suggestion_container}>
              {searchResult.Countries.map((place, idx) => {
                return (
                  <div
                    onClick={() => {
                      setHotelLocation(place.Name);
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
              {searchResult.Cities.map((place, idx) => {
                return (
                  <div
                    onClick={() => {
                      setHotelLocation(place.Name);
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
              {searchResult.Hotels.map((place, idx) => {
                return (
                  <div
                    onClick={() => {
                      setHotelLocation(place.Name);
                      setShowDropdown(false);
                    }}
                    className={styles.result}
                    key={idx}
                  >
                    <div>{place.Name}</div>
                    <div className={styles.side}>Hotel</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Button text="Search Hotel" className={styles.button} />
      </div>
    </div>
  );
}
