import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const formInvalid = () => {
    return (
      !email ||
      !username ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      username.length < 4 ||
      password.length < 6
    );
  };

  return (
    <>
    <div className="sign-up-text">
      <h1>Sign Up</h1>
    </div>
        {errors.email && <p>{errors.email}</p>}
        {errors.username && <p>{errors.username}</p>}

      <form onSubmit={handleSubmit}>
        <div className="email-label">
          <label>
            Email
            <div className="email-input">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>
        </div>

        <div className="username-label">
            <label>
              Username
              <div className="username-input">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </label>
        </div>

        <div className="name-label">
          <label>
            First Name
              {errors.firstName && <p>{errors.firstName}</p>}
            <div className="name-input">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </label>
        </div>

        <div className="last-name-label">
          <label>
            Last Name
              {errors.lastName && <p>{errors.lastName}</p>}
            <div className="last-name-input">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </label>
        </div>

        <div className="password-label">
          <label>
            Password
            {errors.password && <p>{errors.password}</p>}
            <div className="password-input">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </label>
        </div>

        <div className="confirm-pass-label">
          <label>
            Confirm Password
              {errors.confirmPassword && (
                <p>{errors.confirmPassword}</p>
              )}
            <div className="confirm-pass-input">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </label>
        </div>

        <div className="submit-button">
          <button type="submit" disabled={formInvalid()}>Sign Up</button> 
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
