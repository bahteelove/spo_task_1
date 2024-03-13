import React from 'react';
import './style/patientin.css'; // Import CSS file for styling 

import { useState } from 'react';
import { useParams } from 'react-router-dom';

const PatientIn = () => {
    // State variables to store form data
    const [fullName, setFullName] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);

    const dataName = "test"; // need to change to 'data'
    const { patientId } = useParams();

    const data = localStorage.getItem(`${dataName}`); 
    const parsedData = JSON.parse(data);
    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;

    // patient identification by given id
    const patientName = patientsData.find(patient => patient.patient_id === parseInt(patientId));//edited

    // Function to handle doctor selection
    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor.doctor_name);
        setDoctorTimeSlots(doctor.timeSlots);
    };

    // Function to handle form submission
    const handleSubmit = () => {
        // Update doctor's time slots with new values
        const updatedDoctorsData = doctorsData.map(doctor => {
            if (doctor.doctor_name === selectedDoctor) {
                return {
                    ...doctor,
                    timeSlots: doctor.timeSlots.map(timeSlot => {
                        if (timeSlot.time === selectedTime) {
                            return {
                                ...timeSlot,
                                status: 'taken',
                                patient_id: parseInt(patientId) // to fix patient_id
                            };
                        }
                        return timeSlot;
                    })
                };
            }
            return doctor;
        });

        // Save updated data to local storage
        const updatedData = {
            ...parsedData,
            doctors: updatedDoctorsData
        };
        localStorage.setItem(`${dataName}`, JSON.stringify(updatedData));

        // Clear form fields after submission
        setSelectedDoctor('');
        setSelectedTime('');
        alert('Appointment booked successfully!');
    };

    

    return (
        <div className="container">
            <h1>Welcome, {patientName.patient_name} </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Full Name:
                    <input type="text" value={patientName.patient_name} onChange={(e) => setFullName(e.target.value)} />
                </label>
                <br />
                
                <div className="doctor-cards">
                    <label>Choose Doctor:</label>
                    {doctorsData.map((doctor) => (
                        <div className="doctor-card" key={doctor.doctor_id} onClick={() => handleDoctorSelect(doctor)}>
                            <img src={doctor.avatar} alt={doctor.doctor_name} />
                            <div className="doctor-info">
                                <h3>{doctor.doctor_name}</h3>
                                <p>{doctor.specialization}</p>
                            </div>
                            <input
                                type="radio"
                                name="doctor"
                                value={doctor.doctor_name}
                                checked={selectedDoctor === doctor.doctor_name}
                                onChange={() => setSelectedDoctor(doctor.doctor_name)}
                            />
                        </div>
                    ))}
                </div>
                {selectedDoctor && (
                    <div className="time-slots">
                        <label>Available Time Slots for {selectedDoctor}:</label>
                        {doctorTimeSlots.map((timeSlot, index) => (
                            <div
                                className={`time-slot ${timeSlot.status === 'taken' ? 'taken' : ''}`}
                                key={index}
                                onClick={() => {
                                    if (timeSlot.status !== 'taken') setSelectedTime(timeSlot.time);
                                }}
                            >
                                <p>{timeSlot.time}</p>
                                <input
                                    type="radio"
                                    name="time"
                                    value={timeSlot.time}
                                    checked={selectedTime === timeSlot.time}
                                    onChange={() => {
                                        if (timeSlot.status !== 'taken') setSelectedTime(timeSlot.time);
                                    }}
                                    disabled={timeSlot.status === 'taken'}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
}

export default PatientIn;
