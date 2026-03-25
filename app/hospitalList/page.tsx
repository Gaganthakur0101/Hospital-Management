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
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-float-slow" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl animate-float-fast" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl animate-float-slow" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header Section */}
        <div className="animate-rise-up mb-10 rounded-2xl border border-white/15 bg-white/8 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Healthcare Network</p>
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Find Your Best Hospital
          </h1>
          <p className="mt-3 text-slate-300">
            Browse and discover {hospitalList.length} quality hospitals available in your area
          </p>
        </div>

        {/* Hospital List */}
        <div className="space-y-6">

          {loading ? (
            <div className="animate-fade-in-delayed rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
              <div className="inline-block">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-cyan-400"></div>
              </div>
              <p className="mt-4 text-slate-300">Loading hospitals...</p>
            </div>
          ) : hospitalList.length > 0 ? (
            hospitalList.map((hospital, index) => (
              <div
                key={hospital._id}
                style={{
                  opacity: 0,
                  animation: `fadeInCard 1s ease-out ${0.2 + index * 0.15}s forwards`
                }}
              >
                <HospitalCard
                  id={hospital._id}
                  name={hospital.hospitalName}
                  specialities={hospital.specialities}
                  address={`${hospital.address}, ${hospital.city}, ${hospital.state}`}
                  image={hospital.image}
                />
              </div>
            ))
          ) : (
            <div className="animate-fade-in-delayed rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
              <p className="text-xl text-slate-300">No hospitals found</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Page;

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
