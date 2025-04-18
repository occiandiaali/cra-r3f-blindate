import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Outlet } from "react-router";
import Users from "./Users";
import itemData from "../../data/ItemData";

import "./HomeComponent.css";

function Profile({ U, modalOpen }) {
  return (
    <div
      style={{
        display: "grid",
        flexDirection: "column",
        margin: "8px",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={modalOpen}
    >
      <img
        className="avatar"
        src={U.img}
        alt={"Photo of " + U.author}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
        }}
      />
      <h1 style={{ fontSize: "18px" }}>{U.author}</h1>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.15)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  maxWidth: "500px",
  width: "100%",
};

const closeButtonStyle = {
  background: "red",
  color: "white",
  border: "none",
  padding: "10px",
  cursor: "pointer",
};

let selectedUser = null;
let selectedUserImg = null;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeButtonStyle} onClick={onClose}>
          Close
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") // Ensure this ID exists in your HTML
  );
};

function HomeComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <h1>Welcome to Blindate.com!</h1>
      <div id="catalogue-div">
        {itemData.map((user, i) => (
          <div key={i} id="modal-root">
            <Profile
              U={user}
              modalOpen={() => {
                setIsModalOpen(true);
                selectedUser = user.author;
                selectedUserImg = user.img;
              }}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {selectedUserImg ? (
                  <img
                    src={selectedUserImg}
                    alt={selectedUser}
                    style={{ width: 100, height: 100 }}
                  />
                ) : (
                  <img
                    src="../../assets/images/placeholder-person.jpg"
                    alt={selectedUser}
                    style={{ width: 100, height: 100, borderRadius: 20 }}
                  />
                )}
                <div style={{ flexDirection: "column" }}>
                  <h2 style={{ color: "black" }}>{selectedUser} details</h2>
                  <p style={{ color: "black" }}>Other details here..</p>
                </div>
              </div>
            </Modal>
          </div>
        ))}
      </div>
      <Outlet />
    </>
  );
}

export default HomeComponent;
