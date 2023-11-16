import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom'
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton'
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user)
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  
  const closeMenu = () => setShowMenu(false)
  
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  }
  
  useEffect(() => {
    if (!showMenu) return;
    
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('click', closeMenu);
    
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);
  
  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  const userLoggedIn = !sessionUser ? false : true;

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      {showMenu && (
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>Hello, {user.firstName}</li>
            {/* <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li> */}
            <li>{user.email}</li>
            {userLoggedIn && (
            <li>
              <NavLink className ="manage-spots-button" to="/spots/current">Manage Spots</NavLink>
            </li>
            )}
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
      )}
    </>
  );
}

export default ProfileButton;
