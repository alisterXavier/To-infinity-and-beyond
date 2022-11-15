import { createContext, useEffect, useState } from "react";
import "../styles/globals.css";
import Navbar from "./components/Navbar";

export const navClick = createContext();

function MyApp({ Component, pageProps }) {
  const [click, setClick] = useState(false);
  const goHome = () => {
    setClick(true);
  };
  return (
    <navClick.Provider value={[click, setClick]}>
      <div className="container relative disable-select">
        <Navbar
          BackEvent={() => {
            goHome();
          }}
        />
        <Component {...pageProps} />
      </div>
    </navClick.Provider>
  );
}

export default MyApp;
