import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets, deletePet } from "../store/petSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Icon } from "@iconify/react/dist/iconify.js";
import AddPetModal from "./AddPetModal";


const AdminPets = () => {

  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets?.pets);

  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    console.log("Call")
    setModalOpen(prev => !prev);
  }


  const getAllPets = async () => {
    await dispatch(fetchPets({}));
  }

  useEffect(() => {
    console.log("Run")
    getAllPets()
  }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the pet.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deletePet(id)).unwrap();
          toast.success("Pet deleted successfully");
          dispatch(fetchPets({}));
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete pet");
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
        <h1 className="text-4xl font-bold text-indigo-800 tracking-tight">
          🐾 Manage Pets
        </h1>
        <div className="flex gap-4">
          <Link
            to="/admin"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition font-semibold flex items-center gap-2"
          >
            <Icon icon="mdi:arrow-left" width="20" />
            Back to Dashboard
          </Link>

          <button
            onClick={toggleModal}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-300 font-semibold flex items-center gap-2"
          >
            <Icon icon="mdi:plus-circle-outline" width="22" />
            Add New Pet
          </button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {pets?.map((pet) => (
          <div
            key={pet._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col justify-between"
          >
            <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100 border">
              <img
                src={
                  pet.photo
                    ? `${import.meta.env.VITE_API_BASE_URL}${pet.photo}`
                    : "/placeholder.png"
                }
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-indigo-700">{pet.name}</h2>
              <p className="text-gray-600">
                <span className="font-medium">Species:</span> {pet.species}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Breed:</span> {pet.breed || "N/A"}
              </p>
            </div>

            <div className="mt-4 flex gap-3">
              <Link
                to={`/admin/edit-pet/${pet._id}`}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                <Icon icon="mdi:pencil-outline" width="18" />
                Edit
              </Link>

              <button
                onClick={() => handleDelete(pet._id)}
                className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-200 transition"
              >
                <Icon icon="mdi:delete-outline" width="18" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>


      <AddPetModal isOpen={modalOpen} toggleModal={toggleModal} />

    </div>
  );
};

export default AdminPets;
