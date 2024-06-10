import Text from "../text/text";
import styles from "./room-detail-card.module.scss";
import placeholder from "../../assets/image/placeholder.png";
import { FaBed } from "react-icons/fa";
import { colors } from "../colors";
import { BsPeople } from "react-icons/bs";
import IconText from "../icon-text/icon-text";
import {
  MdFastfood,
  MdNoFood,
  MdOutlineSmokeFree,
  MdOutlineSmokingRooms,
} from "react-icons/md";
import { FiWifi, FiWifiOff } from "react-icons/fi";
import { TbCertificate, TbCertificateOff } from "react-icons/tb";
import PriceText from "../price-text/price-text";
import Button from "../button/button";
import Container from "../container/container";

interface IRoomDetailCard {
  name?: string;
  price?: number;
  images: string[];
  bed?: string;
  guest?: number;
  isBreakfast?: boolean;
  isFreeWifi?: boolean;
  isRefundable?: boolean;
  isReschedule?: boolean;
  isSmoking?: boolean;
  addToCart?: () => void;
  handleOpen?: (room: IRoomDetailCard) => void;
  setSelectedRoom?: React.Dispatch<
    React.SetStateAction<IRoomDetail | undefined>
  >;
}

export default function RoomDetailCard({
  name,
  price,
  images,
  bed,
  guest,
  isBreakfast,
  isFreeWifi,
  isRefundable,
  isReschedule,
  isSmoking,
  addToCart,
  handleOpen,
  setSelectedRoom,
}: IRoomDetailCard) {
  return (
    <div className={styles.main_container}>
      <div className={styles.room_detail_card_container}>
        <div className={styles.image_container}>
          <img className={styles.big_image} src={images[0]} alt="" />
          <div className={styles.small_container}>
            {Array.from({ length: 3 }, (_, idx) => {
              return (
                <img
                  key={idx}
                  className={styles.small_image}
                  src={images[idx + 1] ?? placeholder}
                  alt=""
                />
              );
            })}
          </div>
        </div>
        <Container className={styles.info_container}>
          <Text text={name} size="1.5rem" weight="700" />
          <div className={styles.split_container}>
            <div className={styles.split_text}>
              <IconText
                icon={<FaBed size={17} color={colors.secondaryText} />}
                text={bed}
                textColor={colors.secondaryText}
              />
            </div>
            <div className={styles.split_text}>
              <IconText
                icon={<BsPeople size={17} color={colors.secondaryText} />}
                text={`${guest} ${guest! > 1 ? "guests" : "guest"}`}
                textColor={colors.secondaryText}
              />
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.bottom_container}>
            <div className={styles.flex_container}>
              <IconText
                icon={
                  isBreakfast ? (
                    <MdFastfood size={17} color={colors.green} />
                  ) : (
                    <MdNoFood size={17} color={colors.secondaryText} />
                  )
                }
                text={isBreakfast ? "With Breakfast" : "Without Breakfast"}
                textColor={isBreakfast ? colors.green : colors.secondaryText}
              />
              <IconText
                icon={
                  isFreeWifi ? (
                    <FiWifi size={17} color={colors.green} />
                  ) : (
                    <FiWifiOff size={17} color={colors.secondaryText} />
                  )
                }
                text={isFreeWifi ? "Free WiFi" : "Paid WiFi"}
                textColor={isFreeWifi ? colors.green : colors.secondaryText}
              />
              <IconText
                icon={
                  isSmoking ? (
                    <MdOutlineSmokingRooms
                      size={17}
                      color={colors.secondaryText}
                    />
                  ) : (
                    <MdOutlineSmokeFree size={17} color={colors.green} />
                  )
                }
                text={isSmoking ? "Smoking" : "Non-Smoking"}
                textColor={isSmoking ? colors.secondaryText : colors.green}
              />
            </div>
            <div className={styles.flex_container}>
              <IconText
                icon={
                  isRefundable ? (
                    <TbCertificate size={17} color={colors.green} />
                  ) : (
                    <TbCertificateOff size={17} color={colors.secondaryText} />
                  )
                }
                text={isRefundable ? "Refundable" : "Non-Refundable"}
                textColor={isRefundable ? colors.green : colors.secondaryText}
              />
              <IconText
                icon={
                  isReschedule ? (
                    <TbCertificate size={17} color={colors.green} />
                  ) : (
                    <TbCertificateOff size={17} color={colors.secondaryText} />
                  )
                }
                text={isReschedule ? "Rescheduleable" : "Non-Rescheduleable"}
                textColor={isReschedule ? colors.green : colors.secondaryText}
              />
            </div>
            <div className={styles.price_container}>
              <PriceText price={price ?? 0} size="1.3rem" />
              <Text
                text="/ room / night(s)"
                size="0.9rem"
                color={colors.secondaryText}
              />
              <div className={styles.button_container}>
                <Button onClick={handleOpen} text="Book Now!" />
                <Button onClick={handleOpen} text="Add to Cart" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
