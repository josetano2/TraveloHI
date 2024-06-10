import { createContext, useContext, useState } from "react";
import { IChildren } from "../interfaces/children-interface";
// import { ICity, ICountry } from "../interfaces/city-interface";

interface IFetchContext {
  data: IHotel[] | null;
  loading: boolean;
  getAllHotels: () => void;
  suggestion: (stuff: string) => void;
  searchResult: {
    Countries: ICountry[];
    Cities: ICity[];
    Hotels: IHotel[];
  };
  searchHistories: string[];
  setSearchHistories: React.Dispatch<React.SetStateAction<string[]>>;
}

const FetchContext = createContext<IFetchContext>({} as IFetchContext);

export const useFetch = () => useContext(FetchContext);

export function FetchProvider({ children }: IChildren) {
  const [data, setData] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResult, setSearchResult] = useState({
    Countries: [],
    Cities: [],
    Hotels: [],
  });
  const [searchHistories, setSearchHistories] = useState<string[]>([]);

  const getAllHotels = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/get_all_hotels", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setData(res);
      }
    } finally {
      setLoading(false);
    }
  };

  const suggestion = async (stuff: string) => {
    if (stuff === "") {
      setSearchResult({
        Countries: [],
        Cities: [],
        Hotels: [],
      });
      setLoading(true);
      return;
    }
    setLoading(true);
    const url = `http://localhost:8080/api/search_suggestions/?search=${stuff}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setSearchResult(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FetchContext.Provider
      value={{
        data,
        loading,
        getAllHotels,
        suggestion,
        searchResult,
        searchHistories,
        setSearchHistories
      }}
    >
      {children}
    </FetchContext.Provider>
  );
}
