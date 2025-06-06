import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  FormFeedback,
} from "reactstrap";
import { useDispatch } from "react-redux";
import { addPet } from "../store/petSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  species: yup.string().required("Species is required"),
  breed: yup.string(),
  age: yup
    .number()
    .typeError("Age must be a number")
    .min(0, "Age must be 0 or more")
    .required("Age is required"),
  description: yup.string().max(500, "Description can't exceed 500 characters"),
});

const AddPetModal = ({ isOpen, toggleModal }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setPhoto(null);
      setPreview(null);
      clearErrors();
      setLoading(false);
    }
  }, [isOpen, reset, clearErrors]);

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

  const onSubmit = async (formData) => {
    if (!isDirty && !photo) {
      toast.warning("No changes to submit");
      return;
    }

    setLoading(true);
    const petForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => petForm.append(key, value));
    if (photo) petForm.append("photo", photo);

    try {
      const res = await dispatch(addPet(petForm));
      if (res?.payload) {
        toast.success("Pet added successfully!");
        reset();
        setPhoto(null);
        setPreview(null);
        toggleModal();
      } else {
        toast.error(res?.payload || "Something went wrong");
      }
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal} size="lg" centered>
      <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" autoComplete="off">
        <ModalHeader toggle={toggleModal} tag="div" className="modal-header">
          <h5 className="modal-title">Add New Pet</h5>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label htmlFor="name">
              Name <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="Pet Name"
                  invalid={!!errors.name}
                />
              )}
            />
            {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="species">
              Species <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="species"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="species"
                  type="text"
                  placeholder="Dog, Cat etc."
                  invalid={!!errors.species}
                />
              )}
            />
            {errors.species && <FormFeedback>{errors.species.message}</FormFeedback>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="breed">Breed</Label>
            <Controller
              name="breed"
              control={control}
              render={({ field }) => (
                <Input {...field} id="breed" type="text" placeholder="Breed" />
              )}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="age">
              Age <span style={{ color: "red" }}>*</span>
            </Label>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="age"
                  type="number"
                  placeholder="Age in years"
                  invalid={!!errors.age}
                />
              )}
            />
            {errors.age && <FormFeedback>{errors.age.message}</FormFeedback>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="description"
                  type="textarea"
                  rows={3}
                  placeholder="Optional description"
                  invalid={!!errors.description}
                />
              )}
            />
            {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="photo">Upload Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileChange}
              disabled={loading}
            />
            {preview && (
              <div className="mt-3">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded border shadow-sm"
                  style={{ width: 160, height: 160, objectFit: "cover" }}
                />
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> Submitting...
              </>
            ) : (
              "Add Pet"
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddPetModal;
