import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";

//! Components
import AllSpotsLandingPage from "./components/AllSpotsLandingPage";
import SpotDetails from "./components/SpotDetails";
import CreateANewSpotForm from "./components/CreateANewSpotForm";
import ManageSpots from "./components/ManageSpots";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && 
      <Switch>
        <Route exact path = "/">
          <AllSpotsLandingPage />
        </Route>
        <Route path = "/spots/current">
          <ManageSpots />
        </Route>
        <Route exact path = "/spots/new">
          <CreateANewSpotForm />
        </Route>
        <Route path='/spots/:spotId'>
          <SpotDetails />
        </Route>
      </Switch>}
    </>
  );
}

export default App;
