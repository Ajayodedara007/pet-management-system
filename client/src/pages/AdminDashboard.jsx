import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllApplications,
  updateApplicationStatus,
} from "../store/adoptionSlice";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.adoption);

  const getAllApps = async () => {
    await dispatch(fetchAllApplications());
  };

  useEffect(() => {
    getAllApps();
  }, []);

  const handleStatusChange = (id, status) => {
    const action = status === "Approved" ? "approve" : "reject";

    Swal.fire({
      title: `Are you sure you want to ${action} this application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "Approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateApplicationStatus({ id, status })).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            Swal.fire({
              title: `Application ${status}`,
              text: `The application has been ${status.toLowerCase()} successfully.`,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            dispatch(fetchAllApplications());
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to update the status. Please try again.",
              icon: "error",
            });
          }
        });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Adoption Applications
        </h1>
        <Link
          to="/admin/pets"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Go to Manage Pets
        </Link>
      </div>

      {!loading && applications.length === 0 && (
        <p className="text-center text-gray-600 text-lg">
          No applications found.
        </p>
      )}

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:justify-between md:items-center"
          >
            <div className="mb-4 md:mb-0 max-w-xl">
              <h2 className="text-2xl font-semibold text-indigo-700">
                {app.pet.name}
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold">User:</span> {app.user.name} (
                {app.user.email})
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-bold ${
                    app.status === "Approved"
                      ? "text-green-600"
                      : app.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>
              {app.message && (
                <p className="italic text-gray-600">Message: {app.message}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Applied on: {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex space-x-3">
              {app.status === "Pending" ? (
                <>
                  <button
                    onClick={() => handleStatusChange(app._id, "Approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "Rejected")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="opacity-50 cursor-not-allowed px-4 py-2 rounded-lg border border-gray-300"
                >
                  {app.status}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
