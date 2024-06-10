import { useLocation } from "react-router-dom";
import MainTemplate from "../../templates/main-template/main-template";
import { useEffect, useState } from "react";
import Loading from "../../components/loader/loader";
import styles from "./hotel-detail.module.scss";
import Text from "../../components/text/text";
import Star from "../../components/star/star";
import { MdLocationPin } from "react-icons/md";
import { colors } from "../../components/colors";
import Button from "../../components/button/button";
import placeholder from "../../assets/image/placeholder.png";
import Container from "../../components/container/container";
import { FACILITY_ICON } from "../../settings/facility-settings";
import RoomDetailCard from "../../components/room-detail-card/room-detail-card";
import Dialog from "../../components/dialog/dialog";
import Textfield from "../../components/textfield/textfield";
import Snackbar, { SnackbarType } from "../../components/snackbar/snackbar";
import { useSnackbar } from "../../context/snackbar-context";
import { useUser } from "../../context/user-context";

export default function HotelDetailPage() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("id");
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState<IHotel | null>();
  const [selectedRoom, setSelectedRoom] = useState<IRoomDetail>();
  const [open, setOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const {
    message: snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();
  const { user } = useUser();

  const handleAddToCart = async () => {
    const response = await fetch(
      "http://localhost:8080/api/add_hotel_to_cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          selectedRoom,
          checkInDate,
          checkOutDate,
          userID: user?.ID,
        }),
      }
    );

    if (response.ok) {
      // something
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Success);
      window.location.reload();
    } else {
      const error = await response.json();
      handleSnackbar(error.message, SnackbarType.Error);
    }
  };

  const handleOpen = (room: IRoomDetail) => {
    setSelectedRoom(room);
    setOpen(!open);
    setTotalPrice(0);
    setCheckInDate("");
    setCheckOutDate("");
  };

  useEffect(() => {
    getHotelDetail(parseInt(query as string, 10));
  }, []);

  // itung total price
  useEffect(() => {
    if (checkInDate === "" || checkOutDate === "") {
      return;
    }
    calculateGap();
  }, [checkInDate, checkOutDate]);

  const calculateGap = () => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    let diff = checkOut.getTime() - checkIn.getTime();

    let dayDiff = diff / (1000 * 3600 * 24);

    if (selectedRoom) {
      let price = dayDiff * selectedRoom?.Price;
      setTotalPrice(price);
    }
  };

  const getHotelDetail = async (hotelID: number) => {
    setLoading(true);
    const url = `http://localhost:8080/api/get_hotel_detail/?id=${hotelID}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setHotel(res);
        // console.log(res);
      } else {
        setHotel(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type={3} />;

  return (
    <MainTemplate>
      <Snackbar
        message={snackbarMessage}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <Dialog open={open} setOpen={setOpen}>
        <>
          <Text text={selectedRoom?.Name} size="1.5rem" weight="700" />
          {/* <Text text="Select Date" size="1.5rem" weight="700" /> */}
          <div>
            <Text
              text="Check In Date"
              size="1rem"
              color={colors.secondaryText}
            />
            <Textfield
              placeholder=""
              onChange={(e) => setCheckInDate(e.target.value)}
              value={checkInDate}
              type="date"
            />
          </div>
          <div>
            <Text
              text="Check Out Date"
              size="1rem"
              color={colors.secondaryText}
            />
            <Textfield
              placeholder=""
              onChange={(e) => setCheckOutDate(e.target.value)}
              value={checkOutDate}
              type="date"
            />
          </div>
          <Text
            text={`Rp. ${
              checkInDate === "" || checkOutDate === ""
                ? 0
                : totalPrice.toLocaleString()
            }`}
            size="1.5rem"
            weight="700"
            color={colors.orange}
            className={styles.price}
          />
          <Button text="Add To Cart" onClick={handleAddToCart} />
        </>
      </Dialog>
      <div className={styles.main_container}>
        <div className={styles.header_container}>
          <div className={styles.left_container}>
            <Text
              text={hotel?.Name}
              size="2.5rem"
              weight="700"
              className={styles.name}
            />
            <Star rating={hotel?.Rating === 0 ? 5 : hotel?.Rating} />
            <div className={styles.address_container}>
              <MdLocationPin size={25} color={colors.secondaryText} />
              <Text
                text={hotel?.Address}
                size="0.9rem"
                color={colors.secondaryText}
              />
            </div>
          </div>
          <div className={styles.right_container}>
            <Text
              text="Price/room/night starts from"
              size="0.9rem"
              color={colors.secondaryText}
              className={styles.starting}
            />
            <Text
              text={`Rp. ${hotel?.MinPrice?.toLocaleString()}`}
              size="2rem"
              weight="700"
              color={colors.orange}
              className={styles.price}
            />
            <Button text="Select Room" className={styles.select_button} />
          </div>
        </div>
        <div className={styles.image_container}>
          <div className={styles.big_image_container}>
            <img className={styles.big_image} src={hotel?.Images[0]} alt="" />
          </div>
          <div className={styles.supporting_image_container}>
            {Array.from({ length: 6 }, (_, idx) => {
              return (
                <img
                  key={idx}
                  className={styles.small_image}
                  src={hotel?.Images[idx + 1] ?? placeholder}
                  alt=""
                />
              );
            })}
          </div>
        </div>
        <Container className={styles.border_box}>
          <Text text="About this space" size="1.5rem" weight="700" />
          <Text text={hotel?.Description} size="1rem" />
        </Container>
        <Container className={styles.border_box}>
          <Text text="Facilities" size="1.5rem" weight="700" />
          <div className={styles.facility_container}>
            {hotel?.Facilities.map((facility: IFacility, idx: number) => {
              return (
                <div className={styles.facility} key={idx}>
                  {FACILITY_ICON.find((f) => f.name === facility.Name)?.icon}
                  <Text key={idx} text={facility.Name} size="1rem" />
                </div>
              );
            })}
          </div>
        </Container>
        <div className={styles.room_details_main_container}>
          <Text
            text={`Available Room Types in ${hotel?.Name}`}
            size="1.5rem"
            weight="700"
          />
          {hotel?.RoomDetails?.map((room: IRoomDetail, idx: number) => (
            <div className={styles.room_details_container} key={idx}>
              <RoomDetailCard
                name={room.Name}
                images={room.Images}
                price={room.Price}
                bed={room.Bed}
                guest={room.Guest}
                isBreakfast={room.IsBreakfast}
                isFreeWifi={room.IsFreeWifi}
                isSmoking={room.IsSmoking}
                isRefundable={room.IsRefundable}
                isReschedule={room.IsReschedule}
                handleOpen={() => handleOpen(room)}
              />
            </div>
          ))}
        </div>
      </div>
    </MainTemplate>
  );
}
