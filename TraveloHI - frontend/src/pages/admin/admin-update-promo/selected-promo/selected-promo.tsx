import React, { useState } from "react";
import { IPromo } from "../../../../interfaces/promo-interface";
import Button from "../../../../components/button/button";
import { colors } from "../../../../components/colors";
import Container from "../../../../components/container/container";
import Loading from "../../../../components/loader/loader";
import PromoCard from "../../../../components/promo-card/promo-card";
import Snackbar, { SnackbarType } from "../../../../components/snackbar/snackbar";
import Textfield from "../../../../components/textfield/textfield";
import Text from "../../../../components/text/text";
import styles from "./selected-promo.module.scss";
import { useSnackbar } from "../../../../context/snackbar-context";
import { uploadImage } from "../../../../config/config";
import { useNavigate } from "react-router-dom";

export default function SelectedPromo({
  ID,
  Code,
  Image,
  StartDate,
  EndDate,
  Percentage,
}: IPromo) {
  const id = ID.toString();
  const [code, setCode] = useState(Code);
  const [startDate, setStartDate] = useState(StartDate);
  const [endDate, setEndDate] = useState(EndDate);
  const [image, setImage] = useState(Image);
  const [loading, setLoading] = useState(false);
  const [fileLabel, setFileLabel] = useState("Choose a new promo picture");
  const [percentage, setPercentage] = useState(Percentage?.toString());

  const {
    message,
    isSnackbarOpen,
    setIsSnackbarOpen,
    handleSnackbar,
    snackbarType,
  } = useSnackbar();

  const navigate = useNavigate();

  const handlePromoImage = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validatedFileTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (validatedFileTypes.includes(file.type)) {
        setFileLabel(file.name);

        try {
          const url = await uploadImage(file, setLoading);
          if (url) {
            setImage(url);
          } else {
            throw new Error("Failed to upload image.");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        e.target.value = "";
        setFileLabel("Choose Profile Picture");
        setImage("");
      }
    }
  };

  const handleUpdatePromo = async () => {
    const response = await fetch("http://localhost:8080/api/update_promo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id,
        code,
        startDate,
        endDate,
        image,
        percentage,
      }),
    });

    if (response.ok) {
        navigate(`/admin/update-promo`)
        window.location.reload();
    }
    else{
        const error = await response.json();
        handleSnackbar(error.message, SnackbarType.Error)
    }
  };

  return (
    <>
      <Snackbar
        message={message}
        isOpen={isSnackbarOpen}
        onClose={() => setIsSnackbarOpen(false)}
        type={snackbarType}
      />
      <Text text="Promo Preview" size="1.5rem" weight="700" />
      <PromoCard
        code={code}
        percentage={percentage}
        startDate={startDate}
        endDate={endDate}
        image={image}
      />
      <Container className={styles.form_container}>
        <div className={styles.split_container}>
          <div className={styles.field_container}>
            <Text text="Code" size="1rem" color={colors.secondaryText} />
            <Textfield
              className={styles.field}
              placeholder="Code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>
          <div className={styles.field_container}>
            <Text text="Percentage" size="1rem" color={colors.secondaryText} />
            <Textfield
              className={styles.field}
              placeholder="Percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.split_container}>
          <div className={styles.field_container}>
            <Text text="Start Date" size="1rem" color={colors.secondaryText} />
            <Textfield
              className={styles.field}
              placeholder="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.field_container}>
            <Text text="End Date" size="1rem" color={colors.secondaryText} />
            <Textfield
              className={styles.field}
              placeholder="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        {!loading ? (
          <div className={styles.file_container}>
            <input
              className={styles.pfp_button}
              type="file"
              id="file"
              accept="image/jpg image/jpeg image/png"
              onChange={handlePromoImage}
            ></input>
            <label className={styles.pfp_label} htmlFor="file">
              {fileLabel}
            </label>
          </div>
        ) : (
          <Loading type={2} />
        )}
        <Button
          text="Update Promo"
          className={styles.active}
          onClick={handleUpdatePromo}
        />
      </Container>
    </>
  );
}
