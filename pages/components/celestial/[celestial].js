import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { nav } from "../../_app";
import Info from "./celestialInfo.json";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

var renderer,
  scene,
  camera,
  starMesh,
  gltfModel,
  bloomComposer,
  loader,
  orbitControls;
const Celestial = () => {
  const router = useRouter();
  const { ClickEvent, Title } = useContext(nav);
  const [click, setClick] = ClickEvent;
  const [celestialType, setCelestialType] = Title;
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const extraLoaders = {
    stars: () => {
      const positions = [];
      const color = new THREE.Color();
      const colors = [];
      const n = 2000;

      for (let i = 0; i < n; i++) {
        // positions
        const x = Math.random() * 300 - 200;
        const y = Math.random() * 300 - 200;
        const z = Math.random() * 300 - 200;

        positions.push(x, y, z);

        // colors
        const random = Math.floor(Math.random() * 3);
        var cx = 0,
          cy = 0,
          cz = 0;
        const colObject = {
          0: () => {
            cx = 0.3;
            cy = 0.3;
            cz = 0.5;
          },
          1: () => {
            cx = 0.4;
            cy = 0.36;
            cz = 0.22;
          },
          2: () => {
            cx = 0.4;
            cy = 0.33;
            cz = 0.31;
          },
        };

        colObject[random]();

        color.setRGB(cx, cy, cz);

        colors.push(color.r, color.g, color.b);
      }

      const Geo = new THREE.BufferGeometry();
      Geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      Geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        map: new THREE.TextureLoader().load(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/White_dot.svg/120px-White_dot.svg.png?20080219072659"
        ),
      });

      const points = new THREE.Points(Geo, material);
      scene.add(points);
    },
    moon: () => {
      gltfModel.scale.set(1.2, 1.2, 1.2);

      const alight = new THREE.AmbientLight(0x7e7e7e, 0.5); // soft white light
      scene.add(alight);

      var light = new THREE.DirectionalLight(0xc4c4c4, 2.5);
      light.position.set(60, 10, 0);
      scene.add(light);
    },
    sun: () => {
      camera.position.set(0, 0, 50);
      orbitControls.minDistance = 10;
      gltfModel.scale.set(0.2, 0.2, 0.2);
    },
    earth: () => {

      gltfModel.scale.set(0.3, 0.3, 0.3);

      var light = new THREE.DirectionalLight(0xc4c4c4, .5);
      light.position.set(0, 0, 5);
      scene.add(light);

      var alight = new THREE.AmbientLight(0xc4c4c4, 2);
      scene.add(alight);
    },
    mercury: () => {
      gltfModel.scale.set(0.04, 0.04, 0.04);
      const alight = new THREE.AmbientLight(0x7e7e7e, 3.5); // soft white light
      scene.add(alight);
      var light = new THREE.PointLight(0xc4c4c4, 1.5);
      light.position.set(-5, -1, 0.5);
      scene.add(light);
    },
    venus: () => {
      gltfModel.position.set(0, -.35, 0);
      gltfModel.scale.set(0.4, 0.4, 0.4);

      var alight = new THREE.AmbientLight(0xc4c4c4, .5);
      scene.add(alight);

      var light = new THREE.PointLight(0xc4c4c4, 1.8);
      light.position.set(0, 0, 2);
      scene.add(light);
    },
    mars: () => {
      gltfModel.position.set(-.5, -.5, 0);
      gltfModel.scale.set(.5, .5, .5);
      var light = new THREE.PointLight(0xc4c4c4, 5.5);
      light.position.set(17, -5, 0);
      scene.add(light);
      const alight = new THREE.AmbientLight(0x7e7e7e, .5); // soft white light
      scene.add(alight);
    },
    jupiter: () => {
      gltfModel.scale.set(0.03, 0.03, 0.03);
      var light = new THREE.PointLight(0xc4c4c4, 3.5);
      light.position.set(0.5, 0, 1);
      scene.add(light);
      const alight = new THREE.AmbientLight(0x7e7e7e, 0.8); // soft white light
      scene.add(alight);
    },
    saturn: () => {
      gltfModel.position.set(0.2, 0, 0);
      gltfModel.rotation.set(0, -2, 0);
      gltfModel.scale.set(0.5, 0.5, 0.5);
      var light = new THREE.PointLight(0xc4c4c4, 2.5);
      light.position.set(0.9, 1, 0.2);
      scene.add(light);
      const alight = new THREE.AmbientLight(0x7e7e7e, 0.25); // soft white light
      scene.add(alight);
    },
    uranus: () => {
      gltfModel.position.set(0.3, 0, 0);
      gltfModel.scale.set(0.001, 0.001, 0.001);
      gltfModel.rotation.set(5, 0, 0);
      var light = new THREE.PointLight(0xc4c4c4, 1.5);
      light.position.set(10, 15, 10);
      scene.add(light);
    },
    neptune: () => {
      camera.position.set(0, 0, 30);
      gltfModel.position.set(2.5, -0.5, 0);
      gltfModel.scale.set(0.2, 0.2, 0.2);
      var alight = new THREE.AmbientLight(0xc4c4c4, 0.05);
      scene.add(alight);
      var light = new THREE.DirectionalLight(0xc4c4c4, 1);
      light.position.set(-8, 3, 0);
      scene.add(light);
    },
    deathstar: () => {
      gltfModel.position.set(0.3, 0, 0);
      gltfModel.scale.set(0.05, 0.05, 0.05);
      var light = new THREE.PointLight(0xc4c4c4, 2);
      light.position.set(-10, -2, 5);
      scene.add(light);
    },
    blackhole: () => {
      gltfModel.position.set(0, -0.1, 0);
      gltfModel.scale.set(0.3, 0.3, 0.3);
      var light = new THREE.AmbientLight("white", 0.5);
      scene.add(light);
    },
  };

  const getData = async () => {
    const data = Info[celestialType];
    setData(data);
  };

  const loadCelestialBody = () => {
    loader = new GLTFLoader();

    loader.load(`../../assets/Models/${celestialType}/scene.glb`, (gltf) => {
      gltfModel = gltf.scene;
      scene.add(gltf.scene);
      renderer.render(scene, camera);
      console.log(`${celestialType} Loaded`);
      setIsLoading(false);
      extraLoaders[celestialType]();
      animate();
    });
  };

  const animate = () => {
    renderer.render(scene, camera);
    starMesh.rotation.y += 0.001;
    gltfModel.rotation.y += 0.001;
    requestAnimationFrame(animate);
    ["sun", "uranus", "neptune"].includes(celestialType) &&
      bloomComposer.render();
  };

  const init = () => {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.minDistance = 2;

    document.querySelector("#canvas").appendChild(renderer.domElement);

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2; //intensity of glow
    bloomPass.radius = 0.5;
    bloomComposer = new EffectComposer(renderer);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.renderToScreen = true;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const starGeometry = new THREE.SphereGeometry(80, 64, 20);
    const starMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("../../assets/galaxy1.png"),
      side: THREE.BackSide,
      transparent: true,
    });

    // galaxy mesh
    starMesh = new THREE.Mesh(starGeometry, starMaterial);
    scene.add(starMesh);
  };

  const toggleData = (e) => {
    const { parentElement } = e.target;
    parentElement.classList.toggle("unactive");
  };

  useEffect(() => {
    if (celestialType) {
      getData();
      init();
      loadCelestialBody();
    } else {
      setCelestialType(sessionStorage.getItem("celestial"));
    }
    document.querySelector(".container").classList.remove("animate");
    document.querySelector(".title").innerText = "And Beyond";
  }, [celestialType]);

  useEffect(() => {
    if (click) {
      while (scene?.children.length > 0) {
        scene.remove(scene.children[0]);
      }
      setClick(false);
    }
  }, [click]);

  return (
    <div
      className={`model-container ${
        isLoading && "flex items-center justify-center"
      } absolute w-full h-full top-0 z-10`}
    >
      <div
        id="canvas"
        className={`canvas absolute ${isLoading && "hidden"}`}
      ></div>
      {!isLoading ? (
        <div
          className={`${celestialType} data flex items-center flex-col justify-around p-2 lg:p-5`}
        >
          <div
            className="text-3xl cursor-pointer arrow lg:px-3"
            onClick={toggleData}
          >
            &gt;
          </div>
          <div className="data-wrapper">
            <div className="my-5">
              <h1 className="">{celestialType}</h1>
              {data?.["description"].map((d) => { 
                return (
                  <p key={d} className="my-2 text-sm">
                    {d}
                  </p>
                );
              })}
            </div>
            {data?.["dist-sun"] && (
              <div className="my-5">
                <h1>Distance from Sun</h1>
                <p className="my-2 text-sm">approx. {data?.["dist-sun"]} Mi</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="infinity-loader flex">
          <div className="parts">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Celestial;
