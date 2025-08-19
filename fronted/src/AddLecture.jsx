import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLecture = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [selectedBannerName, setSelectedBannerName] = React.useState('No file chosen');

  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key !== 'banner') formData.append(key, data[key]);
    }

    const bannerFile = document.getElementById('bannerUpload').files[0];
    if (bannerFile) formData.append('banner', bannerFile);

    try {
      const response = await fetch('http://localhost:5000/api/lectures', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add lecture');

      toast.success('Lecture added successfully!');
      reset();
      setSelectedBannerName('No file chosen');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error(error);
      toast.error('Error adding lecture');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 md:px-10 pt-24 md:pt-10">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#C10007] mb-8 text-center md:text-left">
          Add Guest Lecture
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          noValidate
        >
          {/* Lecture Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Lecture Details</h3>

            <InputField label="Teacher" name="teacher" register={register} errors={errors} />
            <InputField label="Venue" name="venue" register={register} errors={errors} />
            <InputField label="Class" name="class" register={register} errors={errors} />
            <InputField label="Time" name="time" register={register} errors={errors} type="time" />
            <InputField label="Date" name="date" register={register} errors={errors} type="date" />
            <InputField label="Strength" name="strength" register={register} errors={errors} type="number" />
            
          </div>

          {/* Guest Details */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Guest Details</h3>

            <InputField label="Resource Person" name="resourcePerson" register={register} errors={errors} />
            <InputField label="Company" name="company" register={register} errors={errors} />
            <InputField label="Location" name="location" register={register} errors={errors} />
            <InputField label="Designation" name="designation" register={register} errors={errors} />
            <InputField label="Topic" name="topic" register={register} errors={errors} />

            {/* Banner Upload */}
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Upload Banner</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label
                  htmlFor="bannerUpload"
                  className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded cursor-pointer text-center"
                >
                  Choose File
                </label>
                <input
                  id="bannerUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register('banner', { required: 'Banner is required' })}
                  onChange={(e) =>
                    setSelectedBannerName(e.target.files[0]?.name || 'No file chosen')
                  }
                />
                <span className="text-sm text-gray-600 break-all">{selectedBannerName}</span>
              </div>
              {errors.banner && <p className="text-red-600 text-sm mt-1">{errors.banner.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#C10007] text-white px-6 py-2 rounded hover:bg-[#990005] transition-all"
            >
              Add Lecture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Reusable InputField Component
const InputField = ({ label, name, register, errors, type = 'text' }) => (
  <div>
    <input
      type={type}
      {...register(name, { required: `${label} is required` })}
      placeholder={label}
      className={`w-full border-b border-gray-300 p-2 focus:outline-none focus:border-[#C10007] ${
        errors[name] ? 'border-red-600' : ''
      }`}
    />
    {errors[name] && <p className="text-red-600 text-sm mt-1">{errors[name].message}</p>}
  </div>
);

export default AddLecture;
