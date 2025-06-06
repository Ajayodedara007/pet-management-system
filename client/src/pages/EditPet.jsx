import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPetById, updatePet } from "../store/petSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditPet = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pet, loading } = useSelector((state) => state.pets);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    status: "Available",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    dispatch(fetchPetById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || "",
        species: pet.species || "",
        breed: pet.breed || "",
        age: pet.age || "",
        description: pet.description || "",
        status: pet.status || "Available",
      });
      setPreview(
        pet.photo ? `${import.meta.env.VITE_API_BASE_URL}${pet.photo}` : null
      );
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed.");
        setPhoto(null);
        setPreview(null);
        return;
      }
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const petForm = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      petForm.append(key, value)
    );
    if (photo) petForm.append("photo", photo);

    try {
      await dispatch(updatePet({ id, petData: petForm })).unwrap();
      toast.success("Pet updated successfully");
      navigate("/admin/pets");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update pet");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-indigo-100">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">
        Edit Pet
      </h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6"
        noValidate
      >
        <div>
          <label
            htmlFor="name"
            className="block mb-1 font-semibold text-indigo-600"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Pet Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-indigo-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        <div>
          <label
            htmlFor="species"
            className="block mb-1 font-semibold text-indigo-600"
          >
            Species <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="species"
            name="species"
            placeholder="Species (e.g., Dog, Cat)"
            value={formData.species}
            onChange={handleChange}
            className="w-full border border-indigo-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        <div>
          <label
            htmlFor="breed"
            className="block mb-1 font-semibold text-indigo-600"
          >
            Breed
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            placeholder="Breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full border border-indigo-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="age"
            className="block mb-1 font-semibold text-indigo-600"
          >
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            placeholder="Age (in years)"
            min={0}
            value={formData.age}
            onChange={handleChange}
            className="w-full border border-indigo-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-1 font-semibold text-indigo-600"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the pet..."
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-indigo-300 rounded-md px-4 py-2 text-gray-700 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block mb-1 font-semibold text-indigo-600"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border border-indigo-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="Available">Available</option>
            <option value="Adopted">Adopted</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-indigo-600">
            Upload Photo
          </label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-indigo-700 cursor-pointer focus:outline-none"
          />
          {preview && (
            <img
              src={preview}
              alt="Pet Preview"
              className="mt-4 w-48 h-48 object-cover rounded-lg border border-indigo-300 shadow"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Pet"}
        </button>
      </form>
    </div>
  );
};

export default EditPet;
