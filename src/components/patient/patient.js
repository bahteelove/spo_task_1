import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Patient = () => {
    const navigate = useNavigate();
    const [patientId, setPatientId] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setPatientId(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = localStorage.getItem('data');
        if (data) {
            const parsedData = JSON.parse(data);
            const patients = parsedData.patients;
            const patientExists = patients.some(patient => patient.patient_id.toString() === patientId);
            if (patientExists) {
                navigate(`/patient/patientin/${patientId}`);
            } else {
                setError('Patient ID not found. Please enter a valid ID.');
            }
        } else {
            setError('Data not found. Please contact your administrator.');
        }
    };

    return (
        <>
            <h1>Log In for Patients</h1>
            <div className="container">
                <h1>Enter ID</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter ID"
                        value={patientId}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Submit</button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </>
    );
}

export default Patient;
