import React, { useState } from "react";
import PrimaryBtn from "./PrimaryBtn";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Mandeep Shah",
    phone: "123-456-7890",
    image: "https://via.placeholder.com/150",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prevData) => ({
        ...prevData,
        image: imageUrl,
      }));
    }
  };

  const handleSave = () => {
    handleCloseModal();
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="m-auto flex flex-col items-center gap-4 relative mt-10 px-4 ">
        <img
          src={profileData.image}
          alt="profile"
          className="w-32 h-32 sm:w-48 sm:h-48 md:w-60 md:h-60 rounded-full object-cover"
        />

        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl sm:text-4xl font-bold font-sfpro text-center">
            {profileData.name}
          </h1>

          <div className="flex items-center gap-5">
            <PrimaryBtn
              name="Edit Profile"
              style="max-w-[180px]"
              onClick={handleOpenModal}
            />
            <div className="w-[190px] sm:absolute sm:top-4 sm:right-20 sm:w-auto">
              <PrimaryBtn
                name="Add Book +"
                style="max-w-[180px]"
                onClick={() => navigate("/addbook")}
              />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg mx-6">
            <h2 className="text-3xl font-semibold mb-6 text-gray-900">
              Edit Profile
            </h2>

            <div className="flex flex-col gap-6">
              <label className="block">
                <span className="text-lg font-medium">Name</span>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-lg font-medium">Phone Number</span>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block">
                <span className="text-lg font-medium">Profile Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 block w-full border border-gray-300 rounded-lg px-4 py-2 text-lg"
                />
              </label>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleCloseModal}
                  className="text-lg bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-150"
                >
                  Cancel
                </button>

                <PrimaryBtn
                  name="Save"
                  style="max-w-[150px]"
                  onClick={handleSave}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
