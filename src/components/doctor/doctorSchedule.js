import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import DoctorHistory from './doctorHistory';
import DoctorPatientReport from './doctorPatientReport';

import '../style/doctorSchedule.css'; // Import CSS file for styling 

const DoctorSchedule = () => {
    const { doctorId } = useParams();

    const [activeTab, setActiveTab] = useState('report'); // active status "report"

    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const dataName = "test";

    const data = localStorage.getItem(`${dataName}`);
    const parsedData = JSON.parse(data);
    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;

    const doctorName = doctorsData.find(doctor => doctor.doctor_id === parseInt(doctorId));

    // Function to handle selecting a patient and showing the inputs
    const handleSelectPatient = (patientId, time) => {
        setSelectedPatient(patientId);
        setSelectedTime(time);
    };

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };


    return (
        <>
            <div className="container">
                <h2>Welcome, {doctorName.doctor_name} </h2>
                <div className="patient-cards">
                    {doctorName && doctorName.timeSlots.map((slot, index) => (
                        <button
                            className="patient-card"
                            key={index}
                            onClick={() => handleSelectPatient(parseInt(slot.patient_id), slot.time)}
                        >
                            <div className="patient-info">
                                <h3>{patientsData.find(patient => patient.patient_id === parseInt(slot.patient_id))?.patient_name}</h3>
                                <p>Time: {slot.time}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {selectedPatient ? (
                <div className="tab-container">
                    <div className="tab">
                        <button className={activeTab === 'report' ? 'active' : ''} onClick={() => handleTabChange('report')}>Report</button>
                        <button className={activeTab === 'history' ? 'active' : ''} onClick={() => handleTabChange('history')}>History</button>
                    </div>
                    <div className="content">
                        { activeTab === 'report' ? 
                        ( <DoctorPatientReport patientId={selectedPatient} /> ) : 
                        ( <DoctorHistory patientId={selectedPatient} /> ) }
                    </div>
                </div>
            ) : ( <h2> This time slot has not booked </h2> )}
            
        </>
    );
}

export default DoctorSchedule;
