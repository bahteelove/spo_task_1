import React from 'react';
import { useParams } from 'react-router-dom';
import '../style/doctorReport.css'; // Import CSS file for styling 
import jsPDF from 'jspdf';

const DoctorReport = () => {
    const { doctorId } = useParams();
    // Retrieve data from local storage
    const dataName = "test";
    const data = localStorage.getItem(dataName);
    const parsedData = JSON.parse(data);
    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;

    // Get the information about the selected doctor
    const selectedDoctor = doctorsData.find(doctor => doctor.doctor_id === parseInt(doctorId));

    function isToday(dateString) {
        const [day, month, year] = dateString.split(/[.,: ]/);
        const givenDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date object
        const today = new Date();
        return givenDate.getDate() === today.getDate() &&
               givenDate.getMonth() === today.getMonth() &&
               givenDate.getFullYear() === today.getFullYear();
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Doctor's Daily Report" + new Date, 10, 10);
        doc.text("Doctor: " + selectedDoctor.doctor_name, 10, 20);
    
        let appointmentCount = 0; // Counter for numbering appointments
    
        selectedDoctor.timeSlots.forEach((slot, index) => {
            appointmentCount++; // Increment the appointment count
            if (slot.patient_id !== 0) {
                patientsData.forEach(patient => {
                    if (patient.patient_id === slot.patient_id) {
                        const lastVisit = patient.history[0];
                        if (lastVisit && isToday(lastVisit.date)) {
                            // Add numbering before patient card
                            doc.text(appointmentCount + ". Patient Name: " + patient.patient_name, 10, 30 + (index) * 50);
                            doc.text("Date: " + lastVisit.date, 20, 40 + (index) * 50);
                            doc.text("Issue: " + lastVisit.issue, 20, 50 + (index) * 50);
                            doc.text("Advice: " + lastVisit.advice, 20, 60 + (index) * 50);
                            doc.text("Recipe: " + lastVisit.recipe, 20, 70 + (index) * 50);
                        } 
                    }
                });
            } else {
                // If no appointment, write NO APPOINTMENT
                doc.text(appointmentCount + ". NO APPOINTMENT", 10, 30 + index * 50);
            }
        });
    
        doc.save("doctor_report.pdf");
        handleCloseSlot();
    };

    // Function to handle closing the selected time slot
    const handleCloseSlot = () => {
        const updatedDoctorsData = doctorsData.map(doctor => {
            if (doctor.doctor_id === parseInt(doctorId)) {
                const updatedTimeSlots = doctor.timeSlots.map(slot => {
                        return {
                            ...slot,
                            status: "not taken",
                            patient_id: 0
                        };
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

        window.location.reload();

    };
    
    
    

    return (
        <div className="doctor-report-container">
            <h1>Doctor's Daily Report</h1>
            {selectedDoctor && (
                <div className="doctor-info">
                    
                    <div className="time-slots">
                        <h4>Time Slots:</h4>
                        <ul>
                            {selectedDoctor.timeSlots.map((slot, index) => (
                                <li key={index}>
                                    <span>{slot.time}</span>
                                    {slot.patient_id !== 0 ? (
                                        <div className="patient-visit-info">
                                            {patientsData.map(patient => {
                                                if (patient.patient_id === slot.patient_id) {
                                                    const lastVisit = patient.history[0];
                                                    // Check if last visit occurred today
                                                    if (lastVisit && isToday(lastVisit.date)) {
                                                        return (
                                                            <div key={patient.patient_id} className="visit-info">
                                                                <p>Patient Name: {patient.patient_name}</p>
                                                                <p>Date: {lastVisit.date}</p>
                                                                <p>Issue: {lastVisit.issue}</p>
                                                                <p>Advice: {lastVisit.advice}</p>
                                                                <p>Recipe: {lastVisit.recipe}</p>
                                                            </div>
                                                        );
                                                    } else { return (<p>Patient Name: {patient.patient_name}</p>) }
                                                }
                                                
                                            })}
                                        </div>
                                    ) : ( <p> No appointment </p> )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            <button className='down' onClick={handleDownloadPDF}>Close patients and Download as PDF</button>
        </div>
    );
};

export default DoctorReport;
