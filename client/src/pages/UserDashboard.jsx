import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyApplications } from "../store/adoptionSlice";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const applications = useSelector(
    (state) => state?.adoption?.applications || []
  );

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const statusStyles = {
    Approved: {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: "mdi:check-circle-outline",
    },
    Rejected: {
      bg: "bg-red-100",
      text: "text-red-700",
      icon: "mdi:close-circle-outline",
    },
    Pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: "mdi:progress-clock",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-10 text-center tracking-wide">
        My Adoption Applications
      </h1>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-yellow-50 border border-yellow-300 rounded-lg p-12 shadow-md text-center max-w-md mx-auto">
          <Icon
            icon="ph:warning-light"
            className="text-yellow-500 text-6xl mb-6 animate-pulse"
          />
          <p className="text-xl mb-6 text-yellow-900 font-semibold">
            No applications found.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold transition"
          >
            Browse Pets to Apply
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => {
            const status = statusStyles[app.status] || statusStyles.Pending;
            return (
              <div
                key={app._id}
                className="border border-gray-300 rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {app.pet.photo ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${app.pet.photo}`}
                    alt={app.pet.name}
                    className="rounded-xl w-full h-48 object-cover mb-5 shadow-sm"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center mb-5 text-gray-400 italic">
                    No Image Available
                  </div>
                )}

                <h2 className="text-2xl font-semibold text-indigo-800 mb-3">
                  {app.pet.name}
                </h2>

                <div className="flex items-center mb-3">
                  <Icon
                    icon={status.icon}
                    className={`w-6 h-6 mr-2 ${status.text}`}
                  />
                  <span
                    className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${status.bg} ${status.text}`}
                  >
                    {app.status}
                  </span>
                </div>

                {app.message && (
                  <p className="mb-4 text-gray-700 italic bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <Icon
                      icon="mdi:message-text-outline"
                      className="inline w-5 h-5 mr-2 align-text-bottom text-indigo-500"
                    />
                    {app.message}
                  </p>
                )}

                <p className="text-sm text-gray-500 mt-auto">
                  Applied on:{" "}
                  <time dateTime={app.createdAt} className="font-medium">
                    {formatDate(app.createdAt)}
                  </time>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
