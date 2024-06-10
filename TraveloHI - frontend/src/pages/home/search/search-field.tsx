import { useState } from "react";
import { colors } from "../../../components/colors";
import Text from "../../../components/text/text";
import styles from "./search-field.module.scss";
import Button from "../../../components/button/button";
import { LiaHotelSolid } from "react-icons/lia";
import { MdFlight } from "react-icons/md";
import SearchFieldHotel from "./search-hotel/search-field-hotel";
import SearchFieldFlight from "./search-flight/search-field-flight";
import debounce from "lodash.debounce";

export default function Search() {
  const [active, setActive] = useState("hotels");

  const handleActive = (nav: string) => {
    setActive(nav);
  };
  return (
    <div className={styles.main_container}>
      <Text
        text="Your One Stop Gateway to Southeast Asia"
        weight="700"
        size="2.5rem"
        color={colors.white}
      />
      <div className={styles.navigation_tab}>
        <Button
          onClick={() => handleActive("hotels")}
          className={active === "hotels" ? styles.active : styles.static}
          text="Hotels"
        >
          <LiaHotelSolid size={25} />
        </Button>
        <Button
          onClick={() => handleActive("flights")}
          className={active === "flights" ? styles.active : styles.static}
          text="Flights"
        >
          <MdFlight size={25} />
        </Button>
      </div>
      <div className={styles.middle_container}>
        {active === "hotels" && (
          <>
            <SearchFieldHotel />
          </>
        )}
        {active === "flights" && (
          <>
            <SearchFieldFlight />
          </>
        )}
      </div>
    </div>
  );
}
