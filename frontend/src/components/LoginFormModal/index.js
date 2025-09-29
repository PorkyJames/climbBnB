import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    setIsUsernameValid(credential.length >= 4);
  }, [credential]);

  useEffect(() => {
    setIsPasswordValid(password.length >= 6);
  }, [password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const handleDemoLogin = () => {
    const credentials = {
      credential: 'Demo-lition',
      password: 'password'
    }
      dispatch(sessionActions.login(credentials)).then(closeModal)
    }


  return (
    <>
      <div className="login-text-container">
        <h1>Log In</h1>
      </div>
      
      <div className="error-message">
        {errors.credential && (<p>{errors.credential}</p>)}
      </div>

      <form onSubmit={handleSubmit}>
        <label>
        <div className="username-or-email-label">
          Username or Email
        </div>
        <div className= "username-or-email-input">
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        </label>
        <label>
        <div className="password-label">
          Password
        </div>
        <div className="password-input">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        </label>
      <div className="login-button">
        <button type="submit" disabled={!isUsernameValid || !isPasswordValid}>
          Log In
        </button>
      </div>
        <div className="demo-user-button">
          <button type="button" onClick={handleDemoLogin}>
            Log in as Demo User
          </button>
        </div>
      </form>

    </>
  );
}
export default LoginFormModal;
