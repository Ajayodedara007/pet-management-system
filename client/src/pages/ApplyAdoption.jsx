import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApplyAdoption = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`/pets/${petId}`);
        setPet(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load pet details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    setSubmitting(true);

    try {
      await axios.post(
        `/adoption/apply/${petId}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Application submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    );

  if (error)
    return (
      <p className="text-red-600 text-center mt-6 font-semibold">{error}</p>
    );

  if (!pet)
    return (
      <p className="text-center text-gray-600 mt-6 font-semibold">
        Pet not found.
      </p>
    );

  if (!user)
    return (
      <p className="text-center mt-6">
        Please{" "}
        <Link
          to="/login"
          className="text-blue-600 underline hover:text-blue-800"
        >
          login
        </Link>{" "}
        to apply for adoption.
      </p>
    );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg mt-12">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Apply to Adopt <span className="text-blue-600">{pet.name}</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-gray-700 font-semibold mb-2 block">
            Your Message
          </span>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Why do you want to adopt this pet?"
            disabled={submitting}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transition duration-300 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center`}
        >
          {submitting && (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyAdoption;
