import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
// import OpenModalButton from "../OpenModalButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   sessionLinks = (
  //     <li>
  //       <OpenModalButton
  //         buttonText="Log In"
  //         modalComponent={<LoginFormModal />}
  //       />
  //       <OpenModalButton
  //         buttonText="Sign Up"
  //         modalComponent={<SignupFormModal />}
  //       />
  //     </li>
  //   );
  // }

  //! If logged in, include a Create a Spot button in Nav Bar
  const userLoggedIn = !sessionUser ? false : true

  const createASpotButton = () => {
    return <NavLink className="create-a-spot-button" to='/spots/new'>Create a New Spot</NavLink>
  }

  return (
  <header className="header">
    <div className="logo-container">
        <NavLink to="/">
        <span className="logo-itself">
          <i class="fa-solid fa-mountain"></i><span className="logo-text">climbBnb</span>
        </span>
        </NavLink>
    </div>
    <ul>
      {/* <li>
        <NavLink exact to="/">
          Home
        </NavLink>
      </li> */}
      <div className="user-and-nav">
        {userLoggedIn && createASpotButton()}
        {/* {userLoggedIn && (
          <li>
            <NavLink className ="manage-spots-button" to="/spots/current">Manage Spots</NavLink>
          </li>
        )} */}
        {isLoaded && (
          <span className="profile-button">
            <ProfileButton user={sessionUser} />
          </span>
        )}
      </div>
    </ul>
  </header>
  );
}

export default Navigation;
