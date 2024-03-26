import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import "../style/doctorPatientReport.css"

const DoctorPatientReport = (props) => {
    const { doctorId } = useParams();
    const { patientId } = props;

    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [issue, setIssue] = useState('');
    const [advice, setAdvice] = useState('');
    const [recipe, setRecipe] = useState('');

    const dataName = "test";

    const data = localStorage.getItem(`${dataName}`);
    const parsedData = JSON.parse(data);
    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;
    const patient = patientsData.find(patient => patient.patient_id === patientId);
    const doctor = doctorsData.find(doctor => doctor.doctor_id === parseInt(doctorId));

    
    /// Function to handle saving the inputs
    const handleSaveData = () => {
        const updatedPatientsData = patientsData.map(patient => {
            if (patient.patient_id === patientId) {
                const updatedHistory = {
                    date: new Date().toLocaleString(), // Current date/time
                    issue: issue,
                    advice: advice,
                    recipe: recipe,
                    doctor: doctor.doctor_name // Assuming doctorId is the current doctor's ID
                };
                return {
                    ...patient,
                    history: [updatedHistory, ...patient.history] // Adding new history entry
                };
            }
            return patient;
        });

        const updatedData = {
            doctors: doctorsData,
            patients: updatedPatientsData
        };
        localStorage.setItem(`${dataName}`, JSON.stringify(updatedData));
        window.location.reload()
    };

    /*
    // Function to handle closing the selected time slot
    const handleCloseSlot = () => {
        const updatedDoctorsData = doctorsData.map(doctor => {
            if (doctor.doctor_id === parseInt(doctorId)) {
                const updatedTimeSlots = doctor.timeSlots.map(slot => {
                    if (slot.patient_id === parseInt(patientId)) {
                        return {
                            ...slot,
                            status: "not taken",
                            patient_id: 0
                        };
                    }
                    return slot;
                });
                return {
                    ...doctor,
                    timeSlots: updatedTimeSlots
                };
            }
            return doctor;
        });

        const updatedData = {
            doctors: updatedDoctorsData,
            patients: patientsData
        };
        localStorage.setItem(`${dataName}`, JSON.stringify(updatedData));

        setSelectedPatient('');
        setIssue('');
        setAdvice('');
        setRecipe('');
        window.location.reload();

    }; */
    const handleCloseSlot = () => { alert("closed") }

    return (
        <>
        <div className="data-inputs">
            <label> Patient name: { patient.patient_name } </label><br/>
            <label> Issue: </label>
            <input
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Issue"
            />
            <label> Advice: </label>
            <input
                type="text"
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="Advice"
            />
            <label> Recipe: </label>
            <input
                type="text"
                value={recipe}
                onChange={(e) => setRecipe(e.target.value)}
                placeholder="Recipe"
            />
            <button onClick={handleSaveData}>Save</button>
            <button className='close-btn' onClick={handleCloseSlot}>Close</button>
        </div>
        </>
    );
}

export default DoctorPatientReport;