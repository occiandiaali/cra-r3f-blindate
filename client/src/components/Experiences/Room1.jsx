import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";
import { useNavigate, useParams } from "react-router";

import GLBLoadError from "../GLBLoadError";

function MovableMesh({ position, color }) {
  const meshRef = useRef();
  const [movement, setMovement] = useState({ x: 0, z: 0 });

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += movement.x;
      meshRef.current.position.z += movement.z;
    }
  });

  const whenKeyDown = (event) => {
    const step = 0.1; // Movement step
    switch (event.key) {
      case "ArrowUp":
        setMovement((prev) => ({ ...prev, z: prev.z - step }));
        break;
      case "ArrowDown":
        setMovement((prev) => ({ ...prev, z: prev.z + step }));
        break;
      case "ArrowLeft":
        setMovement((prev) => ({ ...prev, x: prev.x - step }));
        break;
      case "ArrowRight":
        setMovement((prev) => ({ ...prev, x: prev.x + step }));
        break;
      default:
        break;
    }
  };

  const whenKeyUp = () => {
    setMovement({ x: 0, z: 0 });
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={(e) => {
        e.target.focus();
        console.log("Mesh Clicked!");
      }}
      onKeyDown={whenKeyDown}
      onKeyUp={whenKeyUp}
      tabIndex={0} // To allow key events
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Room1() {
  const gltf = useGLTF(
    "https://raw.githubusercontent.com/occiandiaali/blindate-sims/main/client/public/models/resort_lobby.glb"
  );
  const { id, title } = useParams();
  console.log(`ID: ${id} - Title: ${title}`);
  const navigate = useNavigate();

  return (
    <section
      style={{
        marginTop: "4%",
        height: "72vh",
        display: "flex",
        position: "relative",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "4%",
          left: "4%",
          cursor: "pointer",
          zIndex: "999",
        }}
      >
        Leave
      </button>
      <p
        style={{
          position: "absolute",
          top: "4%",
          right: "4%",
          color: "white",
          zIndex: "999",
        }}
      >
        Room: {id}
      </p>
      <Canvas
        fallback={<GLBLoadError />}
        camera={{ position: [0, 1, -5], near: 0.1, far: 1000 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <primitive object={gltf.scene} />
        {/* <gridHelper rotation={[0, 0, 0]} /> */}
        {/* <MovableMesh position={[-2, 0.4, 0]} color="blue" /> */}
        <MovableMesh position={[2, 0.4, 0]} color="red" />
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </section>
  );
}

export default Room1;
