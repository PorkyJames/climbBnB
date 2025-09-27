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
            <i className="fa-solid fa-compass"></i><span className="logo-text"> climbnb</span>
          </span>
          </NavLink>
      </div>
      <ul>
        <div className="user-and-nav">
          {userLoggedIn && createASpotButton()}
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
