import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import './style/doctorin.css'; // Import CSS file for styling 

const DoctorIn = () => {
    const { doctorId } = useParams();

    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedTime, setSelectedTime] = useState('')
    const [comment, setComment] = useState('');

    const dataName = "test";

    const data = localStorage.getItem(`${dataName}`);
    const parsedData = JSON.parse(data);
    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;

    // Function to handle selecting a patient and showing the comment input
    const handleSelectPatient = (patientId, time) => {
        setSelectedPatient( patientId );
        setSelectedTime(time);
        setComment(patientsData.find(patient => patient.patient_id === patientId)?.notes || '');
    };

    // Function to handle saving the comment
    const handleSaveComment = () => {
        const updatedPatientsData = patientsData.map(patient => {
            if (patient.patient_id === selectedPatient) {
                return {
                    ...patient,
                    notes: comment
                };
            }
            return patient;
        });

        const updatedData = {
            doctors: doctorsData,
            patients: updatedPatientsData
        };
        localStorage.setItem(`${dataName}`, JSON.stringify(updatedData));
    };

    // Function to handle closing the selected time slot
    const handleCloseSlot = () => {
        const updatedDoctorsData = doctorsData.map(doctor => {
            if (doctor.doctor_id === parseInt(doctorId)) {
                return {
                    ...doctor,
                    timeSlots: doctor.timeSlots.map(slot => {
                        if (slot.patient_id === selectedPatient && slot.time === selectedTime) {
                            return {
                                ...slot,
                                status: 'not taken',
                                patient_id: 0 // Reset patient_id
                            };
                        }
                        else console.log(slot);
                        return slot;
                    })
                };
            }
            return doctor;
        });

        const updatedData = {
            doctors: updatedDoctorsData,
            patients: patientsData // Patients data remains unchanged
        };
        localStorage.setItem(`${dataName}`, JSON.stringify(updatedData));

        setSelectedPatient(''); // Clear selected patient
        setComment(''); // Clear comment
    };

    const doctorName = doctorsData.find(doctor => doctor.doctor_id === parseInt(doctorId));

    return (
        <>
            <div className="container">
                <h2>Welcome, { doctorName.doctor_name } </h2>
                <div className="patient-cards">
                    {doctorName && doctorName.timeSlots.map((slot, index) => (
                        <button 
                            className="patient-card" 
                            key={index} 
                            onClick={() => handleSelectPatient( parseInt(slot.patient_id) , slot.time)}
                        >
                            <div className="patient-info">
                                <h3>{ patientsData.find(patient => patient.patient_id === parseInt(slot.patient_id))?.patient_name }</h3>
                                <p>Time: {slot.time}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {selectedPatient && (
                <div className="comment-section">
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Enter notes"
                    />
                    <br />
                    <button onClick={handleSaveComment}>Save Notes</button>
                    <button className='close-btn' onClick={handleCloseSlot}>Close</button> {/* New Close button */}
                </div>
            )}
        </>
    );
}

export default DoctorIn;
