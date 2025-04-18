import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  PerspectiveCamera,
} from "@react-three/drei";

import { useFrame } from "@react-three/fiber";
import { useNavigate, useParams } from "react-router";
import { useErrorBoundary } from "use-error-boundary";

import GLBLoadError from "../GLBLoadError";

function FirstPersonControls({ cameraRef }) {
  const speed = 0.1;
  const [velocity, setVelocity] = useState({ x: 0, z: 0, rotation: 0 });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key.toLowerCase()) {
        case "w": // Move forward
          setVelocity((prev) => ({ ...prev, z: -speed }));
          break;
        case "s": // Move backward
          setVelocity((prev) => ({ ...prev, z: speed }));
          break;
        case "a": // Move left
          setVelocity((prev) => ({ ...prev, x: -speed }));
          break;
        case "d": // Move right
          setVelocity((prev) => ({ ...prev, x: speed }));
          break;
        case "q": // Rotate left
          setVelocity((prev) => ({ ...prev, rotation: -0.01 }));
          break;
        case "e": // Rotate right
          setVelocity((prev) => ({ ...prev, rotation: 0.01 }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "s":
          setVelocity((prev) => ({ ...prev, z: 0 }));
          break;
        case "a":
        case "d":
          setVelocity((prev) => ({ ...prev, x: 0 }));
          break;
        case "q":
        case "e":
          setVelocity((prev) => ({ ...prev, rotation: 0 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (cameraRef.current) {
      // Move the camera position
      cameraRef.current.position.x += velocity.x;
      cameraRef.current.position.z += velocity.z;

      // Rotate the camera
      cameraRef.current.rotation.y += velocity.rotation;
    }
  });

  return null; // No visual component needed for controls
}

function MovableMesh({ position, color }) {
  const meshRef = useRef();
  const [movement, setMovement] = useState({ x: 0, z: 0 });

  useEffect(() => {
    const handleKeyDown = (event) => {
      const speed = 0.1;
      switch (event.key.toLowerCase()) {
        case "w": // Move forward
          setMovement((prev) => ({ ...prev, z: -speed }));
          break;
        case "s": // Move backward
          setMovement((prev) => ({ ...prev, z: speed }));
          break;
        case "a": // Move left
          setMovement((prev) => ({ ...prev, x: -speed }));
          break;
        case "d": // Move right
          setMovement((prev) => ({ ...prev, x: speed }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "s":
          setMovement((prev) => ({ ...prev, z: 0 }));
          break;
        case "a":
        case "d":
          setMovement((prev) => ({ ...prev, x: 0 }));
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += movement.x;
      meshRef.current.position.z += movement.z;

      // camera rotation
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerDown={(e) => {
        e.target.focus();
        console.log("Mesh Clicked!");
      }}
      //   onKeyDown={whenKeyDown}
      //   onKeyUp={whenKeyUp}
      //   tabIndex={0} // To allow key events
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Room1() {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();
  const canvasRef = useRef();
  const cameraRef = useRef();

  useEffect(() => {
    const handleContextLost = (e) => {
      e.preventDefault();
      alert("Oops! Something went wrong! Please LEAVE, then try to rejoin.");
    };
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost, false);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
      }
    };
  }, []);

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
      {didCatch ? (
        <GLBLoadError error={error} />
      ) : (
        <ErrorBoundary>
          {/* <Canvas
            ref={canvasRef}
            camera={{ position: [0, 1, -5], near: 0.1, far: 1000 }}
          > */}
          <Canvas ref={canvasRef}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <primitive object={gltf.scene} />
            <PerspectiveCamera
              ref={cameraRef}
              makeDefault
              position={[0, 2, 5]}
            />
            <FirstPersonControls cameraRef={cameraRef} />
            {/* <gridHelper rotation={[0, 0, 0]} /> */}
            {/* <MovableMesh position={[-2, 0.4, 0]} color="blue" /> */}
            <MovableMesh position={[2, 0.4, 0]} color="red" />
            <OrbitControls />
            <Environment preset="sunset" />
          </Canvas>
        </ErrorBoundary>
      )}
    </section>
  );
}

export default Room1;
