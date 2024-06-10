import { useEffect, useState } from "react";
import { useFetch } from "../../../context/fetch-context";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import Loading from "../../../components/loader/loader";
import Text from "../../../components/text/text";
import styles from "./admin-hotel-detail.module.scss";
import Textfield from "../../../components/textfield/textfield";
import { colors } from "../../../components/colors";
import Checkbox from "../../../components/checkbox/checkbox";
import { uploadImage } from "../../../config/config";
import Button from "../../../components/button/button";
import Container from "../../../components/container/container";

export default function AdminHotelDetailPage() {
  const [isSelected, setIsSelected] = useState(false);
  const { data, getAllHotels } = useFetch();
  const [selectedHotel, setSelectedHotel] = useState<IHotel>();

  // detail usestate
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isBreakfast, setIsBreakfast] = useState(false);
  const [isFreeWifi, setIsFreeWifi] = useState(false);
  const [isRefundable, setIsRefundable] = useState(false);
  const [isReschedulable, setIsReschedulable] = useState(false);
  const [isSmoking, setIsSmoking] = useState(false);
  const [guest, setGuest] = useState("");
  const [bed, setBed] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllHotels();
  }, []);

  const handleHotel = (hotel: IHotel) => {
    setSelectedHotel(hotel);
    setIsSelected(true);
  };

  const handleImage = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validatedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (validatedFileTypes.includes(file.type)) {
        try {
          const url = await uploadImage(file, setLoading);
          if (url) {
            setImages((prevImages) => [...prevImages, url]);
          } else {
            throw new Error("Failed to upload image.");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        e.target.value = "";
      }
    }
  };

  const handleSave = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/add_room_detail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        hotelID: selectedHotel?.ID,
        name,
        price: parseFloat(price),
        capacity: parseInt(capacity),
        isBreakfast,
        isFreeWifi,
        isRefundable,
        isReschedulable,
        isSmoking,
        guest: parseInt(guest),
        bed,
        images,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      console.log(selectedHotel?.ID)
    }
  };

  return (
    <AdminTemplate>
      <>
        {!isSelected && (
          <>
            <Text text="Select Hotel" size="1.5rem" weight="700" />
            <div className={styles.hotel_container}>
              {data!.map((hotel: IHotel, idx: number) => (
                <div
                  onClick={() => handleHotel(hotel)}
                  className={styles.select_container}
                  key={idx}
                >
                  {hotel.Name}
                </div>
              ))}
            </div>
          </>
        )}
        {isSelected && (
          <>
            <Text text={selectedHotel!.Name} size="1.5rem" weight="700" />
            <Container>
              <div>
                <Text text="Name" size="1rem" color={colors.secondaryText} />
                <Textfield
                  className={styles.field}
                  placeholder="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Text text="Bed" size="1rem" color={colors.secondaryText} />
                <Textfield
                  className={styles.field}
                  placeholder="Bed"
                  type="text"
                  value={bed}
                  onChange={(e) => setBed(e.target.value)}
                />
              </div>
              <div className={styles.split_container}>
                <div className={styles.field_container}>
                  <Text text="Price" size="1rem" color={colors.secondaryText} />
                  <Textfield
                    className={styles.field}
                    placeholder="Price"
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className={styles.field_container}>
                  <Text
                    text="Capacity"
                    size="1rem"
                    color={colors.secondaryText}
                  />
                  <Textfield
                    className={styles.field}
                    placeholder="Capacity"
                    type="text"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                </div>
                <div className={styles.field_container}>
                  <Text text="Guest" size="1rem" color={colors.secondaryText} />
                  <Textfield
                    className={styles.field}
                    placeholder="Guest"
                    type="text"
                    value={guest}
                    onChange={(e) => setGuest(e.target.value)}
                  />
                </div>
              </div>
              <Checkbox
                id="breakfast"
                text="Breakfast"
                checked={isBreakfast}
                onChange={(e) => setIsBreakfast(e.target.checked)}
              />
              <Checkbox
                id="free-wifi"
                text="Free Wifi"
                checked={isFreeWifi}
                onChange={(e) => setIsFreeWifi(e.target.checked)}
              />
              <Checkbox
                id="refundable"
                text="Refundable"
                checked={isRefundable}
                onChange={(e) => setIsRefundable(e.target.checked)}
              />
              <Checkbox
                id="reschedulable"
                text="Reschedulable"
                checked={isReschedulable}
                onChange={(e) => setIsReschedulable(e.target.checked)}
              />
              <Checkbox
                id="smoking"
                text="Smoking"
                checked={isSmoking}
                onChange={(e) => setIsSmoking(e.target.checked)}
              />
              <div className={styles.file_container}>
                <input
                  className={styles.file_button}
                  type="file"
                  id="file"
                  accept="image/jpg image/jpeg image/png"
                  onChange={handleImage}
                ></input>
                <label className={styles.file_label} htmlFor="file">
                  Add Image
                </label>
              </div>
              {images && (
                <div className={styles.image_container}>
                  {images.map((image, idx) => (
                    <img
                      className={styles.image}
                      key={idx}
                      src={image}
                      alt=""
                    />
                  ))}
                </div>
              )}
              <>
                {!loading ? (
                  <Button
                    text="Save"
                    className={styles.button}
                    onClick={handleSave}
                  />
                ) : (
                  <Button text="Save" className={styles.button_loading} />
                )}
              </>
            </Container>
          </>
        )}
      </>
    </AdminTemplate>
  );
}
