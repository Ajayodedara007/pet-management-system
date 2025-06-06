import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetById } from "../store/petSlice";

const PetDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pet } = useSelector((state) => state.pets);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPetById(id));
  }, [dispatch, id]);

  if (!pet)
    return (
      <p className="text-center text-gray-600 text-lg mt-6">Pet not found</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10">
        <div className="bg-gray-100 rounded-xl overflow-hidden h-[400px] md:h-auto flex justify-center items-center">
          <img
            src={
              pet.photo
                ? `${import.meta.env.VITE_API_BASE_URL}${pet.photo}`
                : "/placeholder.png"
            }
            alt={pet.name}
            className="object-cover w-full h-full rounded-xl"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
              {pet.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                {pet.species}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full">
                {pet.breed}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                Age: {pet.age}
              </span>
            </div>

            <div className="space-y-3 text-[1.05rem] text-gray-800 leading-relaxed">
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`font-semibold ${
                    pet.status === "Available"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {pet.status}
                </span>
              </p>

              {pet.description && (
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {pet.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            {pet.status === "Available" ? (
              user ? (
                <button
                  onClick={() => navigate(`/adopt/${pet._id}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md transition"
                >
                  Apply for Adoption
                </button>
              ) : (
                <div className="text-yellow-700 text-sm font-medium">
                  Please{" "}
                  <Link to="/login" className="underline">
                    log in
                  </Link>{" "}
                  to apply for adoption.
                </div>
              )
            ) : (
              <p className="text-red-600 font-medium">Adoption Closed</p>
            )}

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-indigo-700 font-medium px-4 py-2 rounded-lg shadow-sm transition"
            >
              Back to Pets List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
