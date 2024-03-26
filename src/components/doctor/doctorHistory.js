import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import '../style/doctorHistory.css';
import { jsPDF } from 'jspdf';

const DoctorHistory = (props) => {

    const { patientId } = props;

    const dataName = "test"; // Data name for local storage

    //const { patientId } = useParams();
    const data = localStorage.getItem(dataName); 
    const parsedData = JSON.parse(data);
    const patientsData = parsedData.patients;

    const patient = patientsData.find(patient => patient.patient_id === parseInt(patientId));

    const [expandedVisit, setExpandedVisit] = useState(null);

    const toggleVisitDetails = (index) => {
        setExpandedVisit(index === expandedVisit ? null : index);
    };

    return (
        <div className="history-container">
            <h1>History of {patient.patient_name}</h1>
            {patient.history && patient.history.length > 0 ? (
                <ul>
                    {patient.history.map((visit, index) => (
                        <li key={index}>
                            <div className="visit-header" onClick={() => toggleVisitDetails(index)}>
                                <p>Date: {visit.date}</p>
                            </div>
                            {expandedVisit === index && (
                                <div className="visit-details">
                                    <p>Issue: {visit.issue}</p>
                                    <p>Advice: {visit.advice}</p>
                                    <p>Recipe: {visit.recipe}</p>
                                    <p>Doctor: {visit.doctor}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No history available</p>
            )}
        </div>
    );
}

export default DoctorHistory;