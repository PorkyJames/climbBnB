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
    return <NavLink className="create-a-spot-button" to='/spot/new'>Create a New Spot</NavLink>
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/">
          Home
        </NavLink>
      </li>
      <div className="user-and-nav">
        {userLoggedIn && createASpotButton()}
        {isLoaded && (
          <li className="profile-button">
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </div>
    </ul>
  );
}

export default Navigation;
