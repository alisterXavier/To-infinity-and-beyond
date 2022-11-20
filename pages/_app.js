import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/styles.sass";
import Navbar from "./components/Navbar";

export const nav = createContext();

function MyApp({ Component, pageProps }) {
  const [click, setClick] = useState(false);
  const router = useRouter();
  const [celestialType, setCelestialType] = useState("");

  useEffect(() => {
    setCelestialType(router.query.celestial)
  }, [router]);

  const goHome = () => {
    setClick(true);
  };
  return (
    <nav.Provider
      value={{
        ClickEvent: [click, setClick],
        Title: [celestialType, setCelestialType],
      }}
    >
      <div className="container relative disable-select">
        <Navbar
          BackEvent={() => {
            goHome();
          }}
        />
        <Component {...pageProps} />
      </div>
    </nav.Provider>
  );
}

export default MyApp;
