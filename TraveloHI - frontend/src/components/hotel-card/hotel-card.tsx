import styles from "./hotel-card.module.scss";
import Container from "../container/container";
import Text from "../text/text";
import placeholder from "../../assets/image/placeholder.png";
import Star from "../star/star";
import { MdLocationPin } from "react-icons/md";
import { colors } from "../colors";
import Button from "../button/button";

interface IHotelCard {
  name: string;
  rating: number;
  city: string;
  country: string;
  facilities: string[];
  price: number;
  imageMain: string | null;
  imageSecondary: string | null;
  imageThird: string | null;
  imageFourth: string | null;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function HotelCard({
  name,
  rating,
  city,
  country,
  facilities,
  price,
  imageMain = null,
  imageSecondary = null,
  imageThird = null,
  imageFourth = null,
  onClick,
}: IHotelCard) {
  return (
    <Container onClick={onClick} className={styles.main_container}>
      <div className={styles.flex}>
        <div className={styles.image_container}>
          <img
            className={styles.main_image}
            src={imageMain ?? placeholder}
            alt=""
          />
          <div className={styles.support_container}>
            <img
              className={`${styles.support_image} ${styles.special}`}
              src={imageSecondary ?? placeholder}
              alt=""
            />
            <img
              className={styles.support_image}
              src={imageThird ?? placeholder}
              alt=""
            />
            <img
              className={styles.support_image}
              src={imageFourth ?? placeholder}
              alt=""
            />
          </div>
        </div>
        <div className={styles.info_container}>
          <Text text={name} size="1.25rem" weight="700" />
          {rating === 0 ? (
            <Text
              text="No Rating"
              size="0.75rem"
              color={colors.secondaryText}
            />
          ) : (
            <Star rating={rating as number} />
          )}

          <div className={styles.location_container}>
            <MdLocationPin color={colors.secondaryText} />
            <Text
              text={`${city}, ${country}`}
              size="0.75rem"
              color={colors.secondaryText}
            />
          </div>
          <div className={styles.facility_container}>
            {facilities?.map((facility, idx) => {
              return (
                <div key={idx} className={styles.facility}>
                  {facility}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.price_container}>
          <Text
            text={`Rp. ${price.toLocaleString()}`}
            size="1.25rem"
            weight="700"
            color={colors.orange}
          />
          <Button text="Select Room" className={styles.select_button} />
        </div>
      </div>
    </Container>
  );
}
