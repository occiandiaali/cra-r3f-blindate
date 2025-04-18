import { Route, Routes } from "react-router";
import NavComponent from "./components/Nav/NavComponent";
import HomeComponent from "./components/Home/HomeComponent";
import AccountComponent from "./components/Account/AccountComponent";
import ExperiencesComponent from "./components/Experiences/ExperiencesComponent";
import DashboardComponent from "./components/Dashboard/DashboardComponent";
import "./App.css";

function App() {
  return (
    <>
      <NavComponent />

      <Routes>
        {/* <Route element={<AuthLayout />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
  </Route> */}
        <Route path="/" element={<HomeComponent />}>
          {/* <Route path='/details' element={} /> */}
        </Route>
        <Route path="/experiences" element={<ExperiencesComponent />}>
          {/* <Route path='/details' element={} /> */}
        </Route>
        <Route path="/dashboard" element={<DashboardComponent />}>
          {/* <Route path='/details' element={} /> */}
        </Route>
        <Route path="/account" element={<AccountComponent />}>
          {/* <Route path='/details' element={} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
