import { useLocation, useNavigate } from "react-router-dom";
import MainTemplate from "../../templates/main-template/main-template";
import styles from "./search-hotel.module.scss";
import { useFetch } from "../../context/fetch-context";
import { useEffect, useState } from "react";
import Loading from "../../components/loader/loader";
import Container from "../../components/container/container";
import Text from "../../components/text/text";
import { colors } from "../../components/colors";
import Textfield from "../../components/textfield/textfield";
import Star from "../../components/star/star";
import Checkbox from "../../components/checkbox/checkbox";
import HotelCard from "../../components/hotel-card/hotel-card";
import Dropdown from "../../components/dropdown/dropdown";

export default function SearchHotelPage() {
  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState("10000000");
  const [selectedRating, setSelectedRating] = useState<number[]>([]);
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("query");
  const navigate = useNavigate();
  const [sortingSelection, setSortingSelection] = useState<string[]>([
    "Highest Price",
    "Lowest Price",
    "Highest Rating",
    "Lowest Rating",
  ]);
  const [dropdownActive, setDropdownActive] = useState(sortingSelection[0]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<IHotel[]>([]);
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [facilityArr, setFacilityArr] = useState<number[]>([]);

  useEffect(() => {
    searchHotels(query);
    getFacilities();
    setFacilityArr(
      Array.from({ length: facilities.length }, (_, i = 1) => i + 1)
    );
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      let min = minPrice === "" ? 0 : parseInt(minPrice);
      let max = maxPrice === "" ? 10000000 : parseInt(maxPrice);
      let rating = selectedRating.length > 0 ? selectedRating : [1, 2, 3, 4, 5];
      let listOfFacilities =
        selectedFacilities.length > 0 ? selectedFacilities : facilityArr;
      const filteredData = data
        .filter((hotel) => hotel.MinPrice! >= min && hotel.MinPrice! <= max)
        .filter(
          (hotel) =>
            selectedRating.length === 0 ||
            rating.includes(Math.floor(hotel.Rating))
        )
        .filter((hotel) =>
          listOfFacilities.every((facility) =>
            hotel.Facilities.map((f) => f.ID).includes(facility)
          )
        );
      handleSortChange(dropdownActive);
      setFilteredHotels(filteredData);
    }
  }, [minPrice, maxPrice, selectedRating, selectedFacilities]);

  const handleRatingChange = (idx: number) => {
    setSelectedRating((prevArr) => {
      if (prevArr.includes(idx)) {
        return prevArr.filter((currID) => currID !== idx);
      } else {
        return [...prevArr, idx];
      }
    });
  };

  const handleFacilityChange = (id: number) => {
    setSelectedFacilities((prevArr) => {
      if (prevArr.includes(id)) {
        return prevArr.filter((currID) => currID !== id);
      } else {
        return [...prevArr, id];
      }
    });
  };

  const searchHotels = async (stuff: string | null) => {
    setLoading(true);
    const url = `http://localhost:8080/api/search_hotels/?search=${stuff}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setData(res);
        setFilteredHotels(res);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFacilities = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/facility", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
        console.log(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = (id: number) => {
    navigate(`/hotel-detail?id=${id}`);
  };

  const handleSortChange = (item: string) => {
    setDropdownActive(item);

    if (data && data.length > 0) {
      if (item === "Highest Price") {
        setFilteredHotels(
          [...filteredHotels].sort((a, b) => b.MinPrice! - a.MinPrice!)
        );
      } else if (item === "Lowest Price") {
        setFilteredHotels(
          [...filteredHotels].sort((a, b) => a.MinPrice! - b.MinPrice!)
        );
      } else if (item === "Highest Rating") {
        setFilteredHotels(
          [...filteredHotels].sort((a, b) => b.Rating! - a.Rating!)
        );
      } else if (item === "Lowest Rating") {
        setFilteredHotels(
          [...filteredHotels].sort((a, b) => a.Rating! - b.Rating!)
        );
      }
    }
  };

  if (loading) return <Loading type={3} />;

  return (
    <MainTemplate>
      <div className={styles.main_container}>
        <div className={styles.left_container}>
          <Container className={styles.container}>
            <div className={styles.sort_container}>
              <Text text="Sort By" size="1rem" />
              <Dropdown
                menus={sortingSelection}
                onActiveChange={handleSortChange}
              />
            </div>
          </Container>
          <Container className={styles.container}>
            <div className={styles.text_container}>
              <Text text="Price Range (IDR)" size="1rem" />
              <Text
                text="Per room, Per night"
                size="0.8rem"
                color={colors.secondaryText}
              />
            </div>
            <div className={styles.price_field_container}>
              <Textfield
                placeholder="Min"
                className={styles.price_field}
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <div className={styles.line}></div>
              <Textfield
                placeholder="Max"
                className={styles.price_field}
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </Container>
          <Container className={styles.container}>
            <div className={styles.text_container}>
              <Text text="Star Rating" size="1rem" />
              <Text
                text="Rating 1 - 5"
                size="0.8rem"
                color={colors.secondaryText}
              />
            </div>
            <>
              {Array.from({ length: 5 }, (_, idx) => {
                return (
                  <div key={idx} className={styles.star_container}>
                    <Checkbox
                      key={idx}
                      id={idx.toString()}
                      checked={selectedRating.includes(idx + 1)}
                      onChange={() => handleRatingChange(idx + 1)}
                    />
                    <Star rating={idx + 1} size={1} />
                  </div>
                );
              })}
            </>
          </Container>
          <Container className={styles.container}>
            <>
              <Text text="Facilities" size="1rem" />
              {facilities?.map((facility) => (
                <Checkbox
                  key={facility.ID}
                  id={facility.ID.toString()}
                  text={facility.Name}
                  checked={selectedFacilities.includes(facility.ID)}
                  onChange={() => handleFacilityChange(facility.ID)}
                />
              ))}
            </>
          </Container>
        </div>
        <div className={styles.right_container}>
          {!loading &&
            filteredHotels &&
            filteredHotels.map((hotel: IHotel, idx: number) => (
              <HotelCard
                key={idx}
                name={hotel.Name}
                rating={hotel.Rating}
                city={hotel.City.Name}
                country={hotel.City.Country.Name}
                facilities={hotel.Facilities.map(
                  (facility: IFacility) => facility.Name
                )}
                price={hotel.MinPrice ?? 0}
                imageMain={hotel.Images[0] ?? null}
                imageSecondary={hotel.Images[1] ?? null}
                imageThird={hotel.Images[2] ?? null}
                imageFourth={hotel.Images[3] ?? null}
                onClick={() => handleDetail(hotel.ID)}
              />
            ))}
        </div>
      </div>
    </MainTemplate>
  );
}
