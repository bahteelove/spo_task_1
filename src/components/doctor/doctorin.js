import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import DoctorSchedule from './doctorSchedule';
import DoctorReport from './doctorReport';

import '../style/doctorin.css'; // Import CSS file for styling 

const DoctorIn = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();   

    const [activeNavbar, setActiveNavbar] = useState('schedule'); // active status "schedule"

    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const dataName = "test";

    const data = localStorage.getItem(`${dataName}`);
    const parsedData = JSON.parse(data);
    const doctorsData = parsedData.doctors;
    const patientsData = parsedData.patients;

    const doctorName = doctorsData.find(doctor => doctor.doctor_id === parseInt(doctorId));


    // Function to handle Navbar change
    const handleNavbarChange = (tab) => {
        setActiveNavbar(tab);
    };

    const getQuit = () => { navigate(`/`); }


    return (
        <>

            <div className="navbar-container">
                <div className="nav-bar">
                    <button className={activeNavbar === 'schedule' ? 'active' : ''} onClick={() => handleNavbarChange('schedule')}>Schedule</button>
                    <button className={activeNavbar === 'report' ? 'active' : ''} onClick={() => handleNavbarChange('report')}>Daily Report</button>
                    <button onClick={ () => getQuit() } > Quit </button>
                </div>
                <div className="content">
                    { activeNavbar === 'schedule' ? ( <DoctorSchedule /> ) : ( <DoctorReport /> ) }
                </div>
            </div>

        </>
    );
}

export default DoctorIn;
