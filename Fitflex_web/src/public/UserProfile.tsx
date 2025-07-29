import React, { useEffect, useState } from "react";
import { useUpdateUser } from "./query";

interface User {
  name: string;
  image: string;
  phone: string;
  email: string;
  id: string;
}

const UserDetails: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { mutate: updateUser, isPending } = useUpdateUser();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditableUser(parsedUser);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImageFile(file); // store file for upload
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableUser) {
      setEditableUser({
        ...editableUser,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleUpdate = () => {
    if (editableUser) {
      updateUser(
        {
          userId: editableUser.email,
          name: editableUser.name,
          phone: editableUser.phone,
          image: imageFile || undefined,
          email: "",
        },
        {
          onSuccess: (response) => {
            const updatedUser = response.data.user;
            setSuccessMessage("Profile updated successfully!");
            setErrorMessage(null);
            setUser(updatedUser);
            setEditableUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
          },
          onError: () => {
            setErrorMessage("Failed to update profile.");
            setSuccessMessage(null);
          },
        }
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h2 className="text-3xl font-semibold mb-8">User Details</h2>

      {successMessage && (
        <div className="mb-4 text-green-500">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mb-4 text-red-500">{errorMessage}</div>
      )}

      {editableUser ? (
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <img
  src={
    selectedImage
      ? URL.createObjectURL(selectedImage)
      : user?.image
      ? `https://localhost:3001/uploads/${user.image}`
      : "/default-avatar.png"
  }
  alt="User Avatar"
  className="w-36 h-36 rounded-full border-4 border-gray-300 shadow-lg"
/>

          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300">Name</label>
              <input
                type="text"
                name="name"
                value={editableUser.name}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 bg-gray-700 text-white rounded-md border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={editableUser.email}
                readOnly
                className="w-full p-3 mt-2 bg-gray-700 text-white rounded-md border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Phone</label>
              <input
                type="text"
                name="phone"
                value={editableUser.phone}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 bg-gray-700 text-white rounded-md border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 mt-2 bg-gray-700 text-white rounded-md border border-gray-600"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleUpdate}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "UPDATE"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 mt-4">No user data available.</p>
      )}
    </div>
  );
};

export default UserDetails;
