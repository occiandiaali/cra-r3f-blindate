import { useNavigate } from "react-router";
import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Stats } from "@react-three/drei";
import { MeshNormalMaterial, BoxGeometry } from "three";
import { io } from "socket.io-client";

const ControlsWrapper = ({ socket }) => {
  const controlsRef = useRef();
  const [updateCallback, setUpdateCallback] = useState(null);

  // Register the update event and clean up
  useEffect(() => {
    const onControlsChange = (val) => {
      const { position, rotation } = val.target.object;
      const { id } = socket;

      const posArray = [];
      const rotArray = [];

      position.toArray(posArray);
      rotation.toArray(rotArray);

      socket.emit("move", {
        id,
        rotation: rotArray,
        position: posArray,
      });
    };

    if (controlsRef.current) {
      setUpdateCallback(
        controlsRef.current.addEventListener("change", onControlsChange)
      );
    }

    // Dispose
    return () => {
      if (updateCallback && controlsRef.current)
        controlsRef.current.removeEventListener("change", onControlsChange);
    };
  }, [controlsRef, socket, updateCallback]);

  return <OrbitControls ref={controlsRef} />;
};

const UserWrapper = ({ username, position, rotation, id }) => {
  console.log(`ID: ${id}`);
  console.log(`Username: ${username}`);

  return (
    <mesh
      position={position}
      rotation={rotation}
      username={username}
      geometry={new BoxGeometry()}
      material={new MeshNormalMaterial()}
    >
      {/* Optionally show the ID above the user's mesh */}
      <Text
        position={[0, 1.0, 0]}
        color="white"
        anchorX="center"
        anchorY="middle"
        fontSize={0.24}
      >
        user{id}
      </Text>
    </mesh>
  );
};

function ExperienceComponent() {
  // const { id } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();

  const [socketClient, setSocketClient] = useState(null);
  const [clients, setClients] = useState({});

  useEffect(() => {
    // On mount initialize the socket connection
    setSocketClient(io("http://localhost:3000"));

    // Dispose gracefuly
    return () => {
      if (socketClient) socketClient.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketClient) {
      socketClient.on("userData", (data) => {
        console.log(`New userClient: ${data}`);
        setClients(data);
      });
      socketClient.on("userJoined", (data) => {
        console.log(`User: ${JSON.stringify(data)} joined..`);
        setClients(data);
      });
      socketClient.on("move", (clients) => {
        setClients(clients);
      });
    }
  }, [socketClient]);

  return (
    <section style={{ marginTop: "4%", height: "72vh" }}>
      <button onClick={() => navigate(-1)}>Back</button>
      {/* <h2>Experience: {location.state.title}</h2>
      <p>{id} experience..</p>
      <p>State ID: {location.state.id}</p> */}
      {socketClient && (
        <Canvas camera={{ position: [0, 1, -5], near: 0.1, far: 1000 }}>
          <Stats />
          <ControlsWrapper socket={socketClient} />
          <gridHelper rotation={[0, 0, 0]} />

          {/* Filter myself from the client list and create user boxes with IDs */}
          {Object.keys(clients)
            .filter((clientKey) => clientKey !== socketClient.id)
            .map((client) => {
              const { position, rotation, username } = clients[client];
              return (
                <UserWrapper
                  key={client}
                  id={client}
                  position={position}
                  rotation={rotation}
                  username={username}
                />
              );
            })}
        </Canvas>
      )}
    </section>
  );
}

export default ExperienceComponent;
