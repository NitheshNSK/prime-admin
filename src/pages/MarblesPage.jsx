import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../utils/cropImage";
import { useAuth } from "../auth/AuthContext";
import { getAllMarbles, createMarble, updateMarble } from "../api/api";
import toast from "react-hot-toast";

export default function MarblesPage() {
  const { token } = useAuth();
  const [marbles, setMarbles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    status: "Available",
  });
  const [editingId, setEditingId] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropping, setCropping] = useState(false);
  const [rawFile, setRawFile] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchMarbles();
  }, []);

  const fetchMarbles = async () => {
    const res = await getAllMarbles();
    setMarbles(res.data);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCropImage(imageUrl);
      setRawFile(file);
      setCropping(true);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Marble name is required.");
      return;
    }

    if (!editingId && (!cropImage || !croppedAreaPixels)) {
      toast.error("Please upload and crop an image.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("stock", formData.stock);
    form.append("status", formData.status);

    if (cropImage && croppedAreaPixels) {
      const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels);
      form.append("image", croppedBlob, rawFile.name);
    }

    if (editingId) {
      await updateMarble(editingId, form);
    } else {
      await createMarble(form);
    }

    setFormData({ name: "", stock: "", status: "Available" });
    setEditingId(null);
    setCropImage(null);
    setCropping(false);
    setRawFile(null);
    fetchMarbles();
  };

  const handleEdit = (marble) => {
    setFormData({
      name: marble.name,
      stock: marble.stock,
      status: marble.status,
    });
    setEditingId(marble._id);
  };

  return (
    <div className="min-h-screen w-[100vw] bg-gray-50 p-4 md:p-8">
      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Manage Natural Stones
      </h2>

      <form
        onSubmit={handleFormSubmit}
        className="bg-white shadow-lg rounded-xl p-6 space-y-5 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Marble Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
            required
          />
        </div>

        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border border-gray-300 text-black px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-black border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
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
          {editingId ? "Update Marble" : "Add Marble"}
        </button>
      </form>

      <hr className="my-8 border-gray-300" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {marbles.map((marble) => (
          <div
            key={marble._id}
            className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <img
              src={`https://prime-backend-i91j.onrender.com${marble.imageUrl}`}
              alt={marble.name}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-black mb-1">
                {marble.name}
              </h3>
              <p className="text-sm textblack">Stock: {marble.stock}</p>
              <p className="text-sm text-black mb-3">Status: {marble.status}</p>
              <button
                onClick={() => handleEdit(marble)}
                className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 text-sm rounded-md"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
