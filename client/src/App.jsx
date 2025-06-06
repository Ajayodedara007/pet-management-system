import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PetList from "./pages/PetList";
import PetDetails from "./pages/PetDetails";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ApplyAdoption from "./pages/ApplyAdoption";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPets from "./pages/AdminPets";
// import AddPet from "./pages/AddPetModal";
import EditPet from "./pages/EditPet";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          // * public routes
          <Route path="/" element={<PetList />} />
          <Route path="/pet/:id" element={<PetDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/adopt/:petId"
            element={
              <ProtectedRoute>
                <ApplyAdoption />
              </ProtectedRoute>
            }
          />
          // * User dashboard
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          // ** Admin dashboard
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pets"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPets />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin/add-pet"
            element={
              <ProtectedRoute adminOnly={true}>
                <AddPet />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/admin/edit-pet/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <EditPet />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
