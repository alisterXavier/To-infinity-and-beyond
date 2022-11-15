import { markAssetError } from "next/dist/client/route-loader";
import Head from "next/head";
import Image from "next/image";
import Moon from "./components/celestial/[celestial]";
import Navbar from "./components/Navbar";
import { Router, useRouter } from "next/router";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

const bodies = [
  "Earth",
  "Moon",
  "Sun",
  "Mercury",
  "Mars",
  "Venus",
  "Jupiter",
  "Saturn",
  "Neptune",
  "Uranus",
  "blackhole",
  "DeathStar",
];

var renderer, scene, camera, gltfModel, starMesh, bloomComposer;
export default function Home() {
  const router = useRouter();

  const animate = () => {
    renderer.render(scene, camera);
    starMesh.rotation.y += 0.001;
    starMesh.rotation.x += 0.001;
    requestAnimationFrame(animate);
  };

  const init = () => {
    console.log("dd")
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.querySelector("#canvas").appendChild(renderer.domElement);

    const starGeometry = new THREE.SphereGeometry(80, 64, 64);
    const starMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../../assets/galaxy1.png"),
      side: THREE.BackSide,
      transparent: true,
    });

    // galaxy mesh
    starMesh = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starMesh);

    animate();
  };

  useEffect(() => {
    init();
    document.querySelector(".container").classList.remove("animate");
    document.querySelector(".title").innerText = "To Infinity";
  }, []);

  return (
    <>
      <Head>
        <link
          href="https://fonts.cdnfonts.com/css/ac-big-serif"
          rel="stylesheet"
        ></link>
      </Head>
      <div id="canvas">
        <div className="wrapper flex flex-wrap mt-10">
          {bodies.map((b) => (
            <div
              key={b}
              className="celestial-body m-5"
              onClick={() => {
                document.querySelector(".container").classList.add("animate");
                sessionStorage.setItem("celestial", b.toLowerCase());
                setTimeout(() => {
                  router.push(`/components/celestial/${b}`);
                }, 600);
              }}
            >
              <h1>{b}</h1>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
