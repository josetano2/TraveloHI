import { createContext, useContext, useState } from "react";
import { IChildren } from "../interfaces/children-interface";
import { ILoggedUser } from "../interfaces/user-interface";

interface IUserContext {
  user: ILoggedUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<boolean | string | undefined>;
  logout: () => void;
  getUser: () => Promise<void>;
}

const UserContext = createContext<IUserContext>({} as IUserContext);

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }: IChildren) {
  const [user, setUser] = useState<ILoggedUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(
    email: string,
    password: string
  ): Promise<boolean | undefined> {
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    // sukses
    if (response.status === 200) {
      const userResponse = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (userResponse.ok) {
        const data = await userResponse.json();
        setUser(data);
        return true;
      }
    } else {
      const error = await response.json();
      console.log(error.message);
      return error.message;
    }
  }

  const getUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setLoading(false);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  async function logout() {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: user?.Email,
        }),
      });
      if (response.ok) {
        setUser(null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, getUser }}>
      {children}
    </UserContext.Provider>
  );
}
