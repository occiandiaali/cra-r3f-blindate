import { Link } from "react-router";

import "./NavComponent.css";

function NavComponent() {
  return (
    <header className="sticky-header">
      <nav>
        <ul>
          <li className="otherLi">
            <Link to="/">Blindate</Link>
          </li>
          <li className="otherLi">
            <Link to="/experiences">Experiences</Link>
          </li>
          <li className="otherLi">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="otherLi">
            <Link to="/account">Account</Link>
          </li>

          <li className="far-right">
            <img
              src="https://mui.com/static/images/avatar/1.jpg"
              alt="you"
              id="avatar"
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default NavComponent;
