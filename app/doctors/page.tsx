"use client";
import { useState } from "react";


const Page = () => {

    const [doctors, setDoctors] = useState([]);

    try{
        const fetchDoctors = async() => {
            const response = await fetch('/api/doctors/all');
            const data = await response.json();
            setDoctors(data);
        }
        fetchDoctors();
    } catch (error) {
        console.error("Error fetching doctor data:", error);
    }

    return (
        <div>
            this is the page where we will show all the doctors that are currently available in our portal
        </div>
    );
}

export default Page;
