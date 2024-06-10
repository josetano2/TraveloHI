import { useEffect, useState } from "react";
import MainTemplate from "../../templates/main-template/main-template";
import { useLocation } from "react-router-dom";

export default function SearchFlightPage() {
  const { search } = useLocation();
  const origin = new URLSearchParams(search).get("origin");
  const destination = new URLSearchParams(search).get("destination");
  const departureDate = new URLSearchParams(search).get("departureDate");
  const [data, setData] = useState<IFlight[]>([]);
  const [loading, setLoading] = useState(false);

  const getSearchFlight = async () => {
    console.log(origin, destination, departureDate);
    const url = `http://localhost:8080/api/search_flights/?origin=${origin}&destination=${destination}&departureDate=${departureDate}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setData(res);
        console.log(res);
        // setFilteredHotels(res);
      } else {
        setData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSearchFlight();
  }, []);

  return (
    <MainTemplate>
      <div>SearchFlightPage</div>
    </MainTemplate>
  );
}
