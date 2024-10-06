import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../config/firebase.config";

const bookSchema = z.object({
  bookName: z.string().min(1, "Book name is required"),
  bookLanguage: z.string().min(1, "Language is required"),
  author: z.string().min(1, "Author is required"),
  edition: z.string().min(1, "Edition is required"),
  publishYear: z.string().length(4, "Must be a valid year"),
  bookFor: z.enum(["donation", "sell", "rent"], {
    required_error: "Please select an option",
  }),
  originalPrice: z.number().optional(),
  sellingPrice: z.number().optional(),
  perDayPrice: z.number().optional(),
  description: z.string().optional(),
});

const AddBook = () => {
  const currentUser = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("/image/addbook.png");
  const [bookImage, setBookImage] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      bookFor: "donation",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      let imageUrl = "";
      if (bookImage) {
        const storageRef = ref(storage, `books/${bookImage.name}`);
        await uploadBytes(storageRef, bookImage);
        imageUrl = await getDownloadURL(storageRef);
      }

      const bookData = {
        title: data.bookName,
        author: data.author,
        publishYear: data.publishYear,
        language: data.bookLanguage,
        originalPrice: data.originalPrice,
        sellingPrice: data.sellingPrice,
        perDayPrice: data.perDayPrice,
        edition: data.edition,
        description: data.description,
        sellerId: currentUser?.uid || 0,
        updatedAt: new Date().toISOString(),
        condition: "new",
        images: imageUrl ? [imageUrl] : [],
        availability: data.bookFor,
        postedAt: Timestamp.now(),
      };

      await addDoc(collection(db, "books"), bookData);

      setPreviewImage("/image/addbook.png");
      setBookImage(null);
      reset();
    } catch (error) {
      console.error("Error adding book:", error);
    } finally {
      setLoading(false);
    }
  };

  const bookForValue = watch("bookFor");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:mt-10">
      <div className="flex flex-col lg:flex-row justify-center items-start">
        <div className="w-full lg:w-1/2 lg:pr-4 mb-8 lg:mb-0">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md h-64 sm:h-80 md:h-[695px] items-center justify-center hidden sm:block">
            <img
              src={previewImage}
              alt="Book cover"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full lg:w-1/2 lg:pl-4 bg-white p-6 rounded-lg border-2 shadow-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Add Book</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Book Name:</label>
              <input
                type="text"
                {...register("bookName")}
                className={`border rounded-3xl px-4 py-3 w-full ${
                  errors.bookName ? "border-red-500" : "border-primaryColor"
                }`}
              />
              {errors.bookName && (
                <p className="text-red-500 text-sm">
                  {errors.bookName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Book Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-3xl px-4 py-3 w-full border-primaryColor"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Language:</label>
              <input
                type="text"
                {...register("bookLanguage")}
                className={`border rounded-3xl px-4 py-3 w-full ${
                  errors.bookLanguage ? "border-red-500" : "border-primaryColor"
                }`}
              />
              {errors.bookLanguage && (
                <p className="text-red-500 text-sm">
                  {errors.bookLanguage.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">Author:</label>
              <input
                type="text"
                {...register("author")}
                className={`border rounded-3xl px-4 py-3 w-full ${
                  errors.author ? "border-red-500" : "border-primaryColor"
                }`}
              />
              {errors.author && (
                <p className="text-red-500 text-sm">{errors.author.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Edition:</label>
              <input
                type="text"
                {...register("edition")}
                className={`border rounded-3xl px-4 py-3 w-full ${
                  errors.edition ? "border-red-500" : "border-primaryColor"
                }`}
              />
              {errors.edition && (
                <p className="text-red-500 text-sm">{errors.edition.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Publish Year:</label>
              <input
                type="text"
                {...register("publishYear")}
                className={`border rounded-3xl px-4 py-3 w-full ${
                  errors.publishYear ? "border-red-500" : "border-primaryColor"
                }`}
              />
              {errors.publishYear && (
                <p className="text-red-500 text-sm">
                  {errors.publishYear.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-1">Book for:</label>
            <div className="flex gap-4">
              {["donation", "sell", "rent"].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="radio"
                    value={option}
                    {...register("bookFor")}
                    className="mr-1"
                  />
                  <span className="capitalize">{option}</span>
                </label>
              ))}
            </div>
            {errors.bookFor && (
              <p className="text-red-500 text-sm">{errors.bookFor.message}</p>
            )}
          </div>

          {bookForValue === "sell" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1">Original Price:</label>
                <input
                  type="number"
                  value={0}
                  {...register("originalPrice", { valueAsNumber: true })}
                  className={`border rounded-3xl px-4 py-3 w-full ${
                    errors.originalPrice
                      ? "border-red-500"
                      : "border-primaryColor"
                  }`}
                />
                {errors.originalPrice && (
                  <p className="text-red-500 text-sm">
                    {errors.originalPrice.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1">Selling Price:</label>
                <input
                  type="number"
                  value={0}
                  {...register("sellingPrice", { valueAsNumber: true })}
                  className={`border rounded-3xl px-4 py-3 w-full ${
                    errors.sellingPrice
                      ? "border-red-500"
                      : "border-primaryColor"
                  }`}
                />
                {errors.sellingPrice && (
                  <p className="text-red-500 text-sm">
                    {errors.sellingPrice.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {bookForValue === "rent" && (
            <div className="mt-4">
              <label className="block mb-1">Price per Day:</label>
              <input
                type="number"
                value={0}
                {...register("perDayPrice", { valueAsNumber: true })}
                className={`border rounded-3xl px-4 py-3 w-full ${
                  errors.perDayPrice ? "border-red-500" : "border-primaryColor"
                }`}
              />
              {errors.perDayPrice && (
                <p className="text-red-500 text-sm">
                  {errors.perDayPrice.message}
                </p>
              )}
            </div>
          )}

          <div className="mt-4">
            <label className="block mb-1">Description:</label>
            <textarea
              {...register("description")}
              className={`border rounded-3xl px-4 py-3 w-full ${
                errors.description ? "border-red-500" : "border-primaryColor"
              }`}
              rows={4}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 bg-blue-500 px-4 py-3 bg-gradient-to-t from-primaryColor to-secondaryColor rounded-3xl text-white font-bold shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
