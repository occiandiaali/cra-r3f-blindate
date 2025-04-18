import { useNavigate } from "react-router";

const bookings = [
  { id: 1, title: "Cabbage", isExpired: true },
  { id: 2, title: "Garlic", isExpired: false },
  { id: 3, title: "Pomegranate", isExpired: false },
  { id: 4, title: "Tomato", isExpired: true },
  { id: 5, title: "Apple", isExpired: false },
];

function ExperiencesComponent() {
  const navigate = useNavigate();
  const listItems = bookings.map((booking) => (
    <li
      key={booking.id}
      style={{
        color: booking.isExpired ? "magenta" : "darkgreen",
        cursor: !booking.isExpired ? "pointer" : null,
        listStyle: "none",
        width: "60%",
        margin: "14px",
        backgroundColor: "whitesmoke",
        borderRadius: "24px",
      }}
      onClick={() =>
        navigate(`/room1/${booking.title}`, {
          state: { id: booking.id, title: booking.title },
        })
      }
    >
      {booking.title}
    </li>
  ));
  return (
    <section>
      <h1>My Bookings</h1>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {listItems}
      </ul>
    </section>
  );
}

export default ExperiencesComponent;
