import { useEffect, useState } from "react";
import { IPromo } from "../../../interfaces/promo-interface";
import PromoCard from "../../../components/promo-card/promo-card";
import styles from "./promo.module.scss";
import Button from "../../../components/button/button";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useTheme } from "../../../context/theme-context";
import { colors } from "../../../components/colors";
import PromoCardHome from "./promo-card-home/promo-card-home";
import Loading from "../../../components/loader/loader";
import Text from "../../../components/text/text";

export default function Promos() {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  // slider
  const [currIdx, setCurrIdx] = useState(0);
  const totalItem = 3;

  const handleNext = () => {
    setCurrIdx((prevIdx) => {
      if (prevIdx + 1 < promos.length - totalItem + 1) {
        return prevIdx + 1;
      } else {
        return 0;
      }
    });
  };

  const handlePrev = () => {
    setCurrIdx((prevIdx) => {
      if (prevIdx === 0) {
        return promos.length > totalItem ? promos.length - totalItem : 0;
      } else {
        return prevIdx - 1;
      }
    });
  };

  const getActivePromo = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/get_all_promos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (JSON.stringify(data) !== JSON.stringify(promos)) {
          setPromos(data);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getActivePromo();
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const visiblePromos = promos && promos.slice(currIdx, currIdx + totalItem);

  // if (loading) return <Loading type={3} />;

  return (
    <div className={styles.main_container}>
      {visiblePromos && (
        <Button
          className={`${styles.button} ${styles.left_button}`}
          onClick={handlePrev}
        >
          <FaChevronLeft
            color={theme === "dark" ? colors.black : colors.white}
          />
        </Button>
      )}

      <div className={styles.slider_container}>
        {!visiblePromos && <Text text="No ongoing promo!" size="1.2rem" />}
        {visiblePromos &&
          visiblePromos.map((promo: IPromo, idx: number) => (
            <div key={idx}>
              <PromoCardHome
                code={promo.Code}
                percentage={promo.Percentage.toString()}
                startDate={promo.StartDate}
                endDate={promo.EndDate}
                image={promo.Image}
                length={promos.length}
              />
            </div>
          ))}
      </div>
      {visiblePromos && (
        <Button
          className={`${styles.button} ${styles.right_button}`}
          onClick={handleNext}
        >
          <FaChevronRight
            color={theme === "dark" ? colors.black : colors.white}
          />
        </Button>
      )}
    </div>
  );
}
