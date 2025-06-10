import React, { useState, useEffect, useCallback } from "react";
import {
  getKitchenProjects,
  createKitchenProject,
  deleteKitchenProject,
} from "../api/api";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import toast from "react-hot-toast";

export default function KitchenProjects() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [cropImage, setCropImage] = useState(null);
  const [rawFile, setRawFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await getKitchenProjects();
    setProjects(res.data);
  };

  const onCropComplete = useCallback((_, area) => {
    setCroppedAreaPixels(area);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawFile(file);
      setCropImage(URL.createObjectURL(file));
      setCropping(true);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!cropImage || !croppedAreaPixels) {
      toast.error("Please upload and crop an image.");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);

    const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
    form.append("image", croppedBlob, rawFile.name);

    try {
      await createKitchenProject(form);
      toast.success("Kitchen project added successfully!");

      setFormData({ title: "", description: "" });
      setCropImage(null);
      setRawFile(null);
      setCropping(false);
      fetchProjects();
    } catch (err) {
      toast.error("Failed to add project.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteKitchenProject(id);
      fetchProjects();
      toast.success("Project deleted.");
    }
  };

  return (
    <div className="min-h-screen w-[100vw] bg-gray-50 px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Kitchen Projects
      </h2>

      <form
        onSubmit={handleCreate}
        className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          type="text"
          placeholder="Project Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <textarea
          placeholder="Project Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-4 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-200 p-2 rounded-md"
        />

        {cropping && cropImage && (
          <div className="relative w-full h-[300px] bg-gray-100 rounded overflow-hidden">
            <Cropper
              image={cropImage}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Add Project
        </button>
      </form>

      <hr className="my-8 border-gray-300" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition duration-300"
          >
            <img
              src={`${project.signedUrl}`}
              alt={project.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {project.description}
              </p>
              <button
                onClick={() => handleDelete(project._id)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
