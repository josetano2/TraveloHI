import debounce from "lodash.debounce";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/button/button";
import Textfield from "../../../../components/textfield/textfield";
import { useFetch } from "../../../../context/fetch-context";
import styles from "./search-field-hotel.module.scss"

export default function SearchFieldHotel() {
  // hotel
  const [hotelLocation, setHotelLocation] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const {
    searchResult,
    suggestion,
    loading,
    searchHistories,
    setSearchHistories,
  } = useFetch();
  const navigate = useNavigate();

  const handleSearch = (e: any) => {
    if (e.key === "Enter") {
      const newArr = [...searchHistories, hotelLocation];
      if (newArr.length > 3) {
        setSearchHistories(newArr.slice(-3));
      } else {
        setSearchHistories(newArr);
      }
      navigate(`/search-hotel?query=${hotelLocation}`);
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();

    const newArr = [...searchHistories, hotelLocation];
    if (newArr.length > 3) {
      setSearchHistories(newArr.slice(-3));
    } else {
      setSearchHistories(newArr);
    }
    navigate(`/search-hotel?query=${hotelLocation}`);
  };

  const searchSuggestion = debounce(() => {
    suggestion(hotelLocation);
  }, 500);

  useEffect(() => {
    searchSuggestion();

    return () => searchSuggestion.cancel();
  }, [hotelLocation]);
  return (
    <div className={styles.search_container}>
      <div className={styles.form_container}>
        <Textfield
          className={styles.field}
          placeholder="City, country, or hotel name"
          type="text"
          value={hotelLocation}
          onChange={(e) => {
            setHotelLocation(e.target.value);
            setShowHistory(false);
            setShowDropdown(true);
          }}
          onKeyDown={handleSearch}
          // onBlur={() => setShowDropdown(false)}
          onFocus={() => setShowHistory(true)}
        />
        {/* <Button className={styles.search} onClick={handleClick}>
                    <IoSearch size={20} />
                  </Button> */}
        {!loading || hotelLocation === "" ? (
          <Button className={styles.search} onClick={handleClick}>
            <IoSearch size={20} />
          </Button>
        ) : (
          <Button className={styles.search_loading}>
            <IoSearch size={20} />
          </Button>
        )}
      </div>
      {searchResult && showHistory && hotelLocation === "" && (
        <div className={`${styles.result_container}`}>
          {searchHistories.map((place, idx) => {
            return (
              <div
                onClick={() => {
                  setHotelLocation(place);
                  setShowHistory(false);
                }}
                className={styles.result}
                key={idx}
              >
                <div>{place}</div>
              </div>
            );
          })}
        </div>
      )}
      {searchResult && showDropdown && (
        <div className={`${styles.result_container}`}>
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
  );
}
