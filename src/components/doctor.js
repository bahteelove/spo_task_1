import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Doctor = () => {
    const navigate = useNavigate();
    const [doctorId, setDoctorId] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        setDoctorId(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = localStorage.getItem('data');
        if (data) {
            const parsedData = JSON.parse(data);
            const doctors = parsedData.doctors;
            const doctorExists = doctors.some(doctor => doctor.doctor_id.toString() === doctorId);
            if (doctorExists) {
                navigate(`/doctor/doctorin/${doctorId}`);
            } else {
                setError('Doctor ID not found. Please enter a valid ID.');
            }
        } else {
            setError('Data not found. Please contact your administrator.');
        }
    };

    return (
        <>
            <h1>Log In for Doctors</h1>
            <div className="container">
                <h1>Enter ID</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter ID"
                        value={doctorId}
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

export default Doctor;





