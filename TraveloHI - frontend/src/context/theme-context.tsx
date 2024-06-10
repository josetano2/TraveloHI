import { createContext, useContext, useEffect, useState } from "react";
import { IChildren } from "../interfaces/children-interface";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: IChildren) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme);
    document.querySelector("body")?.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const currTheme = localStorage.getItem("selectedTheme") || "light";
    setTheme(currTheme);
    document.querySelector('body')?.setAttribute('data-theme', currTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
