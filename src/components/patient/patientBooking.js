import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import '../style/patientBooking.css';

const PatientBooking = () => {
    const [fullName, setFullName] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [doctorTimeSlots, setDoctorTimeSlots] = useState([]);

    const dataName = "test"; // Data name for local storage
    const { patientId } = useParams();
    const data = localStorage.getItem(dataName); 
    const parsedData = JSON.parse(data);
    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;
    const patient = patientsData.find(patient => patient.patient_id === parseInt(patientId));

    // doctor selection
    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor.doctor_name);
        setDoctorTimeSlots(doctor.timeSlots);
    };

    // submission
    const handleSubmit = () => {
        // if the patient has already booked a time slot with the selected doctor
        const isTimeSlotBooked = doctorTimeSlots.some(
            timeSlot => timeSlot.status === 'taken' && parseInt(timeSlot.patient_id) === parseInt(patientId)
        );
        if (isTimeSlotBooked) {
            alert('You have already booked a time slot with this doctor.');
            return;
        }

        // checking if there si any booked time slot for any doctor adjacent to the selected time slot
        const patientAppointments = doctorsData.flatMap(doctor => {
            return doctor.timeSlots.filter(timeSlot => timeSlot.status === 'taken' && parseInt(timeSlot.patient_id) === parseInt(patientId));
        });

        // converting the selected time to milliseconds
        const selectedTimeInMillis = new Date(`2024-01-01 ${selectedTime}`).getTime();

        // checking if any existing appointment is within one hour of the selected time slot
        const appointmentWithinOneHour = patientAppointments.some(appointment => {
            // converting the booked appointment
            const appointmentTimeInMillis = new Date(`2024-01-01 ${appointment.time}`).getTime();

            // time-difference
            const timeDifference = Math.abs(selectedTimeInMillis - appointmentTimeInMillis);

            return Math.abs(timeDifference) < 3600000;
        });

        // if there is an existing appointment within one hour, prevent booking and alert the user
        if (appointmentWithinOneHour) {
            alert('You cannot book an appointment within one hour of an existing appointment.');
            return;
        }

        // booking the appointment || updating data
        const updatedDoctorsData = doctorsData.map(doctor => {
            if (doctor.doctor_name === selectedDoctor) {
                return {
                    ...doctor,
                    timeSlots: doctor.timeSlots.map(timeSlot => {
                        if (timeSlot.time === selectedTime) {
                            return {
                                ...timeSlot,
                                status: 'taken',
                                patient_id: parseInt(patientId)
                            };
                        }
                        return timeSlot;
                    })
                };
            }
            return doctor;
        });

        const updatedData = {
            ...parsedData,
            doctors: updatedDoctorsData
        };
        localStorage.setItem(dataName, JSON.stringify(updatedData));
        setSelectedDoctor('');
        setSelectedTime('');
        alert('Appointment booked successfully!');
    };


    return (
        <div className="booking-container">
            <h1>Welcome, {patient.patient_name} </h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Full Name:
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
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

export default PatientBooking;