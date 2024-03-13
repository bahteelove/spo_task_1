import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";

import Patient from "./components/patient";
import PatientIn from "./components/patientin";

import Doctor from "./components/doctor";
import DoctorIn from "./components/doctorin";

const RouteSwitch = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/patient" element={ <Patient /> } />
        <Route path="/patient/patientin/:patientId" element={ <PatientIn /> } />

        <Route path="/doctor" element={ <Doctor /> } />
        <Route path="/doctor/doctorin/:doctorId" element={ <DoctorIn /> } />
        
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;