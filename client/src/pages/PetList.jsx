import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPets } from "../store/petSlice";
import { Link } from "react-router-dom";

const PetList = () => {
  const dispatch = useDispatch();
  const pets = useSelector((state) => state.pets.pets);

  // Local states for filters
  const [speciesFilter, setSpeciesFilter] = useState("");
  const [breedFilter, setBreedFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllPets = async () => {
    await dispatch(fetchPets({ page: 1 }));
  };

  // Filter pets
  const filteredPets = pets?.filter((pet) => {
    const speciesMatch = pet.species
      .toLowerCase()
      .includes(speciesFilter.toLowerCase());
    const breedMatch = pet.breed
      ? pet.breed.toLowerCase().includes(breedFilter.toLowerCase())
      : breedFilter === "";
    const ageMatch = pet.age
      ? String(pet.age).toLowerCase().includes(ageFilter.toLowerCase())
      : ageFilter === "";
    const searchMatch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()));

    return speciesMatch && breedMatch && ageMatch && searchMatch;
  });

  useEffect(() => {
    fetchAllPets();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-indigo-800 mb-8 text-center">
        Available Pets for Adoption
      </h1>

      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <input
          type="text"
          placeholder="Filter by Species"
          className="border border-gray-300 p-2 rounded-lg shadow-sm"
          value={speciesFilter}
          onChange={(e) => setSpeciesFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by Breed"
          className="border border-gray-300 p-2 rounded-lg shadow-sm"
          value={breedFilter}
          onChange={(e) => setBreedFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by Age"
          className="border border-gray-300 p-2 rounded-lg shadow-sm"
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        />

        <input
          type="search"
          placeholder="Search by Name or Breed"
          className="border border-gray-300 p-2 rounded-lg shadow-sm w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPets?.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No pets found.
          </p>
        ) : (
          filteredPets?.map((pet) => (
            <Link
              to={`/pet/${pet._id}`}
              key={pet._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 flex flex-col"
            >
              <div className="w-full h-52 rounded-lg overflow-hidden bg-gray-100 mb-3">
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
              <h3 className="text-xl font-bold text-indigo-700">{pet.name}</h3>
              <p className="capitalize text-gray-700 mb-1">
                {pet.species} {pet.breed && `- ${pet.breed}`}
              </p>
              <p className="text-gray-600">Age: {pet.age}</p>
              <p
                className={`mt-2 text-sm font-medium ${pet.status === "Available"
                  ? "text-green-600"
                  : "text-yellow-600"
                  }`}
              >
                Status: {pet.status}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default PetList;
