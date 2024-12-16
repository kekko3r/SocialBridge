import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Autenticazione/Login";
import Register from "./Autenticazione/Signup";
import UserProfile from './Utente/userProfile';
import EvaluateAffinities from './Utente/EvaluateAffinities'; 
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home'; // Importa la nuova homepage
import CreaEvento from './Evento/createEvent';
import ModificaEvento from './Evento/updateEvent';
import PartecipantiEvento from './Evento/partecipantiEvento';
import EventiUtente from './Evento/viewEventsCreate';
import EventiUtentePartecipa from './Evento/ViewEventsPartecipate';
import VisualizzaEventi from './Evento/viewEvents';
import ModificaDatiPersonali from './Utente/ModificaDatiPersonali';
import SearchUser from './Utente/SearchUser';

import './App.css';

const NotFound = () => <h1>404 - Pagina non trovata</h1>; // Pagina 404

function App() {
  const isAuthenticated = localStorage.getItem("jwtToken") ? true : false;
  return (
    <Router>
      <div>
        <Navbar isAuthenticated={isAuthenticated} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/user/:id"
              element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
            />

            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login />}
            />

            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" /> : <Register />}
            />

            <Route
              path="/viewEventsCreate"
              element={isAuthenticated ? <EventiUtente /> : <Navigate to="/login" />}
            />
            <Route
              path="/createEvent"
              element={isAuthenticated ? <CreaEvento /> : <Navigate to="/login" />}
            />

            <Route
              path="/updateEvent/:id"
              element={isAuthenticated ? <ModificaEvento /> : <Navigate to="/login" />}
            />

            <Route
              path="/participants/:eventID"
              element={isAuthenticated ? <PartecipantiEvento /> : <Navigate to="/login" />}
            />

            <Route
              path="/evaluateAffinities/:participantID"
              element={isAuthenticated ? <EvaluateAffinities /> : <Navigate to="/login" />}
            />

            <Route
              path="/my-events"
              element={isAuthenticated ? <EventiUtente /> : <Navigate to="/login" />}
            />

            <Route
              path="/events-participate"
              element={isAuthenticated ? <EventiUtentePartecipa /> : <Navigate to="/login" />}
            />

            <Route
              path="/search-user"
              element={isAuthenticated ? <SearchUser /> : <Navigate to="/login" />}
            />

            <Route
              path="/events"
              element={<VisualizzaEventi />}
            />

            <Route
              path="/updateUser/:id"
              element={isAuthenticated ? <ModificaDatiPersonali /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;