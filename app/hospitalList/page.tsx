// "use client";

// import React from "react";
// import HospitalCard from "@/components/hospitalCard";

// interface Hospital {
//   _id: string;
//   hospitalName: string;
//   specialities: string[];
//   address: string;
//   city: string;
//   state: string;
//   image: string;
// }

// const mockHospitals: Hospital[] = [
//   {
//     _id: "1",
//     hospitalName: "Apollo Multispeciality Hospital",
//     specialities: ["Cardiology", "Orthopedics", "Pediatrics"],
//     address: "MG Road",
//     city: "New Delhi",
//     state: "Delhi",
//     image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
//   },
//   {
//     _id: "2",
//     hospitalName: "Fortis Healthcare",
//     specialities: ["Neurology", "Dermatology"],
//     address: "Sector 62",
//     city: "Noida",
//     state: "UP",
//     image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907",
//   },
//   {
//     _id: "3",
//     hospitalName: "AIIMS Hospital",
//     specialities: ["Emergency", "General Surgery"],
//     address: "Ansari Nagar",
//     city: "New Delhi",
//     state: "Delhi",
//     image: "https://images.unsplash.com/photo-1670665352618-49ae2ae914ff?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
// ];

// const Page = () => {
//   const [hospitalList] = React.useState<Hospital[]>(mockHospitals);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 pt-12 pb-16">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="mb-10 bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-slate-200">
//           <h1 className="text-3xl font-bold text-slate-900">
//             Find Your Best Hospital
//           </h1>
//           <p className="text-slate-500 mt-2">
//             {hospitalList.length} Hospitals available in your area
//           </p>
//         </div>

//         {/* Hospital List */}
//         <div className="space-y-8">
//           {hospitalList.map((hospital) => (
//             <HospitalCard
//               key={hospital._id}
//               id={hospital._id}
//               name={hospital.hospitalName}
//               specialities={hospital.specialities}
//               address={`${hospital.address}, ${hospital.city}, ${hospital.state}`}
//               image={hospital.image}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Page;


"use client";

import React from "react";
import HospitalCard from "@/components/hospitalCard";
import toast from "react-hot-toast";

interface Hospital {
  _id: string;
  hospitalName: string;
  phoneNumber: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  registrationFees: number;
  hospitalType: "Government" | "Private" | "Clinic";
  description: string;
  establishedYear: number;
  emergencyAvailable: boolean;
  ambulanceAvailable: boolean;
  specialities: string[];
  image: string;
}

const Page = () => {
  const [hospitalList, setHospitalList] = React.useState<Hospital[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchHospitals = async () => {
    try {
      const res = await fetch("/api/hospitals/all");
      if (!res.ok) {
        throw new Error("Failed to load hospitals");
      }
      const data = await res.json();
      setHospitalList(data);
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : "something went wrong while fetching hospitals";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 pb-16 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="relative mb-10 rounded-2xl border border-white/15 bg-white/8 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
          <h1 className="text-3xl font-black text-white">
            Find Your Best Hospital
          </h1>
          <p className="mt-2 text-slate-300">
            {hospitalList.length} Hospitals available in your area
          </p>
        </div>

        {/* Hospital List */}
        <div className="space-y-8">

          {loading ? (
            <p className="text-center text-slate-300">Loading hospitals...</p>
          ) : hospitalList.length > 0 ? (
            hospitalList.map((hospital) => (
              <HospitalCard
                key={hospital._id}
                id={hospital._id}
                name={hospital.hospitalName}
                specialities={hospital.specialities}
                address={`${hospital.address}, ${hospital.city}, ${hospital.state}`}
                image={hospital.image}
              />
            ))
          ) : (
            <p className="text-center text-slate-300">
              No hospitals found
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default Page;