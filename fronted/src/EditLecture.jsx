import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditLecture = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [lecture, setLecture] = useState({
    teacher: "",
    venue: "",
    class: "",
    time: "",
    strength: "",
    resourcePerson: "",
    company: "",
    location: "",
    designation: "",
    topic: "",
    date: "",
  });

  const [banner, setBanner] = useState(null);
  const [images, setImages] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/lectures/${id}`);
        const lec = res.data;

        setLecture({
          teacher: lec.teacher || "",
          venue: lec.venue || "",
          class: lec.class || "",
          time: lec.time || "",
          strength: lec.strength || "",
          resourcePerson: lec.resourcePerson || "",
          company: lec.company || "",
          location: lec.location || "",
          designation: lec.designation || "",
          topic: lec.topic || "",
          date: lec.date ? new Date(lec.date).toISOString().split("T")[0] : "",
        });

        if (lec.banner) {
          setPreviewBanner(`http://localhost:5000/uploads/${lec.banner}?t=${Date.now()}`);
        }

        if (lec.images) {
          setPreviewImage(`http://localhost:5000/uploads/${lec.images}?t=${Date.now()}`);
        }

        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch lecture details");
        console.error(err);
        setLoading(false);
      }
    };

    fetchLecture();
  }, [id]);

  const handleChange = (e) => {
    setLecture({ ...lecture, [e.target.name]: e.target.value });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    setPreviewBanner(file ? URL.createObjectURL(file) : null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImages(file);
    setPreviewImage(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(lecture).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (banner) formData.append("banner", banner);
    if (images) formData.append("images", images);

    try {
      await axios.put(`http://localhost:5000/api/lectures/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Lecture updated successfully");
      navigate("/view-lectures");
    } catch (err) {
      toast.error("Failed to update lecture");
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Loading lecture details...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8 border">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">✏️ Edit Lecture</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "teacher", label: "Teacher" },
              { name: "venue", label: "Venue" },
              { name: "class", label: "Class" },
              { name: "time", label: "Time" },
              { name: "strength", label: "Strength" },
              { name: "resourcePerson", label: "Resource Person" },
              { name: "company", label: "Company" },
              { name: "location", label: "Location" },
              { name: "designation", label: "Designation" },
              { name: "topic", label: "Topic" },
              { name: "date", label: "Date", type: "date" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={lecture[field.name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                  required
                />
              </div>
            ))}
          </div>

          {/* Banner Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Banner Image</label>
            {previewBanner && (
              <img
                src={previewBanner}
                alt="Banner"
                className="w-40 h-28 object-cover rounded-lg mb-2 border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 file:text-sm file:font-semibold 
              file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
            />
          </div>

          {/* Lecture Image Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Lecture Image</label>
            {previewImage && (
              <img
                src={previewImage}
                alt="Lecture"
                className="w-40 h-28 object-cover rounded-lg mb-2 border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 
              file:rounded-full file:border-0 file:text-sm file:font-semibold 
              file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              ✅ Update Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLecture;
