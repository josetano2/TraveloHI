import { useState } from "react";
import styles from "./predict-image.module.scss";
import Button from "../../components/button/button";
import MainTemplate from "../../templates/main-template/main-template";
import { useNavigate } from "react-router-dom";

export default function PredictImagePage() {
  const [file, setFile] = useState<File>();
  const [prediction, setPrediction] = useState("");
  const [fileLabel, setFileLabel] = useState("Choose Image to Predict");
  const navigate = useNavigate();

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setFileLabel(file.name);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // file ada
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
          navigate(`/search-hotel?query=${data.result}`);
          setPrediction(data.result);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <MainTemplate>
      <div className={styles.main_container}>
        <div className={styles.predict_container}>
          {/* {file && (
            // <img src={} alt="" />
          )} */}
          <div className={styles.file_container}>
            <input
              className={styles.pfp_button}
              type="file"
              id="file"
              accept="image/jpg image/jpeg image/png"
              onChange={handleFile}
            ></input>
            <label className={styles.pfp_label} htmlFor="file">
              {fileLabel}
            </label>
          </div>
          <Button text="submit" onClick={handleSubmit} />
        </div>
        {prediction !== "" && <div>Prediction: {prediction}</div>}
      </div>
    </MainTemplate>
  );
}
