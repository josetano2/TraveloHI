import { useEffect, useState } from "react";
import Textfield from "../../../components/textfield/textfield";
import AdminTemplate from "../../../templates/admin-template/admin-template";
import styles from "./admin-hotel.module.scss";
import Textarea from "../../../components/textarea/textarea";
import Button from "../../../components/button/button";
import Text from "../../../components/text/text";
import Loading from "../../../components/loader/loader";
import { uploadImage } from "../../../config/config";
import Checkbox from "../../../components/checkbox/checkbox";
import { useSnackbar } from "../../../context/snackbar-context";
import Snackbar, { SnackbarType } from "../../../components/snackbar/snackbar";

export default function AdminHotelPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [cities, setCities] = useState<ICity[]>([]);
  const [cityName, setCityName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [images, setImages] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const {
    message,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();

  const getCities = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/city", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setCities(data);
        if (data.length > 0) {
          setCityName(data[0].Name);
        }
      }
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

  useEffect(() => {
    getCities();
    getFacilities();
  }, []);

  const handleFacilityChange = (id: number) => {
    setSelectedFacilities((prevArr) => {
      if (prevArr.includes(id)) {
        return prevArr.filter((currID) => currID !== id);
      } else {
        return [...prevArr, id];
      }
    });
  };

  const handleImage = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validatedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/api/add_hotel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        description,
        address,
        cityName,
        images,
        selectedFacilities,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      const data = await response.json();
      handleSnackbar(data.message, SnackbarType.Error);
    }
  };

  // if (loading) return <Loading type={3} />;

  return (
    <AdminTemplate>
      <Snackbar
        message={message}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <Text text="Hotel" size="1.5rem" weight="700" />
      <div className={styles.home_container}>
        <Textfield
          placeholder="Hotel Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Hotel Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Textfield
          placeholder="Hotel Address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <select
          className={styles.combo_box}
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        >
          {cities.map((city, idx) => (
            <option key={idx} value={city.Name}>
              {city.Name}
            </option>
          ))}
        </select>
        <div className={styles.facility_container}>
          {facilities?.map((facility) => (
            <Checkbox
              key={facility.ID}
              id={facility.ID.toString()}
              text={facility.Name}
              checked={selectedFacilities.includes(facility.ID)}
              onChange={() => handleFacilityChange(facility.ID)}
            />
          ))}
        </div>
        <div className={styles.file_container}>
          <input
            className={styles.file_button}
            type="file"
            id="file"
            accept="image/jpg image/jpeg image/png image/webp"
            onChange={handleImage}
          ></input>
          <label className={styles.file_label} htmlFor="file">
            Add Image
          </label>
        </div>
        {images.length > 0 && (
          <div className={styles.image_container}>
            {images.map((image, idx) => (
              <img className={styles.image} key={idx} src={image} alt="" />
            ))}
          </div>
        )}
        <>
          {!loading ? (
            <Button
              text="Save"
              className={styles.button}
              onClick={handleSubmit}
            />
          ) : (
            <Button text="Save" className={styles.button_loading} />
          )}
        </>
      </div>
    </AdminTemplate>
  );
}
