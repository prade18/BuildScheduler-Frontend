"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function MyManagedEquipmentPage() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagedEquipment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/equipment/my-managed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setEquipmentList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching managed equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagedEquipment();
  }, []);

  if (loading)
    return (
      <p className="p-6 text-center text-blue-600 text-lg font-medium">
        Loading managed equipment...
      </p>
    );

  if (equipmentList.length === 0)
    return (
      <p className="p-6 text-center text-red-600 text-lg font-semibold">
        No managed equipment found.
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        My Managed Equipment
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {equipmentList.map((equipment) => (
          <div
            key={equipment.id}
            className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {equipment.name}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              #{equipment.serialNumber} • {equipment.model}
            </p>

            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  equipment.currentOperationalStatus === "AVAILABLE"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {equipment.currentOperationalStatus}
              </span>
              {equipment.maintenanceDue && (
                <span className="text-red-600 text-xs font-semibold">
                  Maintenance Due
                </span>
              )}
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-3">
              <p>
                <strong>Type:</strong> {equipment.type}
              </p>
              <p>
                <strong>Location:</strong> {equipment.location}
              </p>
              <p>
                <strong>Last Maintained:</strong>{" "}
                {equipment.lastMaintenanceDate}
              </p>
              <p>
                <strong>Manager:</strong> {equipment.equipmentManager.username}
              </p>
            </div>

            <Link
              href={`/dashboard/equipment/details/${equipment.id}`}
              className="inline-block mt-2 text-blue-600 hover:underline text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}


