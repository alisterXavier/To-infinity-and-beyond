import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { nav } from "../_app";
import bodies from "./celestial/bodies.json";

const Navbar = ({ BackEvent }) => {
  const router = useRouter();
  const { Title } = useContext(nav);
  const [celestialType, setCelestialType] = Title;

  const handleClick = (b) => {
    document.querySelector(".container").classList.add("animate");
    sessionStorage.setItem("celestial", b.toLowerCase());
    setTimeout(() => {
      router.push(`/components/celestial/${b}`);
    }, 600);
  };

  return (
    <nav className="p-5 bg-transparent">
      <ul className="flex w-full justify-between">
        <li className="w-fit cursor-pointer">
          <h1
            className="title"
            onClick={() => {
              document.querySelector(".container").classList.add("animate");
              setTimeout(() => {
                router.push('/');
              }, 600);
              BackEvent();
            }}
          >
            To Infinity
          </h1>
        </li>
        <li className="celesHover cursor-pointer text-right">
          <p>{celestialType}</p>

        </li>
      </ul>
    </nav>
  );
}; 

export default Navbar;
