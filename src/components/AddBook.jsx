import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  doc,
  increment,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../config/firebase.config";
import { capitalizeFirstLetter } from "./utils/Capitalise";

const bookSchema = z
  .object({
    bookName: z.string().min(1, "Book name is required"),
    category: z.string().min(1, "Category is required"),
    bookLanguage: z.string().min(1, "Language is required"),
    author: z.string().min(1, "Author is required"),
    edition: z.string().min(1, "Edition is required"),
    publishYear: z
      .string()
      .length(4, "Must be a valid year")
      .refine((year) => {
        const numYear = parseInt(year);
        const currentYear = new Date().getFullYear();
        return numYear >= 1800 && numYear <= currentYear;
      }, "Year must be between 1800 and current year"),
    bookFor: z.enum(["donation", "sell", "rent"], {
      required_error: "Please select an option",
    }),
    originalPrice: z
      .number({
        required_error: "Original price is required",
        invalid_type_error: "Original price must be a number",
      })
      .nonnegative("Price cannot be negative")
      .optional(),
    sellingPrice: z
      .number({
        invalid_type_error: "Selling price must be a number",
      })
      .nonnegative("Price cannot be negative")
      .optional(),
    perWeekPrice: z
      .number({
        invalid_type_error: "Per week price must be a number",
      })
      .nonnegative("Price cannot be negative")
      .optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.bookFor === "sell") {
        return (
          typeof data.originalPrice === "number" &&
          typeof data.sellingPrice === "number"
        );
      }
      return true;
    },
    {
      message:
        "Original price and selling price are required for selling books",
      path: ["sellingPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.bookFor === "rent") {
        return (
          typeof data.originalPrice === "number" &&
          typeof data.perWeekPrice === "number"
        );
      }
      return true;
    },
    {
      message:
        "Original price and per week price are required for renting books",
      path: ["perWeekPrice"],
    }
  )
  .refine(
    (data) => {
      if (
        data.bookFor === "sell" &&
        typeof data.originalPrice === "number" &&
        typeof data.sellingPrice === "number"
      ) {
        return data.sellingPrice <= data.originalPrice * 0.4;
      }
      return true;
    },
    {
      message: "Selling price must be less than 40% of original price",
      path: ["sellingPrice"],
    }
  )
  .refine(
    (data) => {
      if (
        data.bookFor === "rent" &&
        typeof data.originalPrice === "number" &&
        typeof data.perWeekPrice === "number"
      ) {
        return data.perWeekPrice <= data.originalPrice * 0.06;
      }
      return true;
    },
    {
      message: "Per week price must be less than 6% of original price",
      path: ["perWeekPrice"],
    }
  );

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
      originalPrice: 0,
      sellingPrice: 0,
      perWeekPrice: 0,
    },
  });

  const bookForValue = watch("bookFor");
  const originalPrice = watch("originalPrice") || 0;

  const onSubmit = async (data) => {
    if (!bookImage) {
      alert("Please select a book image");
      return;
    }

    try {
      setLoading(true);

      const storageRef = ref(storage, `books/${bookImage.name}`);
      await uploadBytes(storageRef, bookImage);
      const imageUrl = await getDownloadURL(storageRef);

      const bookData = {
        title: capitalizeFirstLetter(data.bookName),
        author: data.author,
        category: data.category,
        publishYear: data.publishYear,
        language: data.bookLanguage,
        originalPrice: data.originalPrice || 0,
        sellingPrice: data.sellingPrice || 0,
        perWeekPrice: data.perWeekPrice || 0,
        edition: data.edition,
        description: data.description || "",
        sellerId: currentUser?.uid,
        sellerName: currentUser?.displayName || "",
        updatedAt: new Date().toISOString(),
        condition: "new",
        images: [imageUrl],
        availability: data.bookFor,
        postedAt: Timestamp.now(),
      };

      switch (data.bookFor) {
        case "rent":
          delete bookData.sellingPrice;
          break;
        case "donation":
          delete bookData.perWeekPrice;
          delete bookData.sellingPrice;
          delete bookData.originalPrice;
          break;
        case "sell":
          delete bookData.perWeekPrice;
          break;
      }

      await addDoc(collection(db, "pendingBooks"), bookData);

      const userRef = doc(db, "users", currentUser?.uid);
      const fieldName =
        data.bookFor === "donation"
          ? "donated"
          : data.bookFor === "sell"
          ? "sold"
          : null;

      if (fieldName) {
        await updateDoc(userRef, {
          [fieldName]: increment(1),
        });
      }

      setPreviewImage("/image/addbook.png");
      setBookImage(null);
      reset();

      alert("Book added successfully!");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Error adding book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }
      setBookImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:mt-10 mb-12">
      <div className="flex flex-col lg:flex-row justify-center items-start">
        <div className="w-full lg:w-1/2 lg:pr-4 mb-8 lg:mb-0">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md h-64 sm:h-80 md:h-[790px] flex items-center justify-center">
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
            <label className="block mb-1">Category:</label>
            <input
              type="text"
              {...register("category")}
              className={`border rounded-3xl px-4 py-3 w-full ${
                errors.category ? "border-red-500" : "border-primaryColor"
              }`}
            />
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
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
                <label className="block mb-1">
                  Selling Price (must be less than{" "}
                  {(originalPrice * 0.4).toFixed(2)}):
                </label>
                <input
                  type="number"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1">Original Price:</label>
                <input
                  type="number"
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
                <label className="block mb-1">
                  Per week Price (must be less than{" "}
                  {(originalPrice * 0.06).toFixed(2)}):
                </label>
                <input
                  type="number"
                  {...register("perWeekPrice", { valueAsNumber: true })}
                  className={`border rounded-3xl px-4 py-3 w-full ${
                    errors.perWeekPrice
                      ? "border-red-500"
                      : "border-primaryColor"
                  }`}
                />
                {errors.perWeekPrice && (
                  <p className="text-red-500 text-sm">
                    {errors.perWeekPrice.message}
                  </p>
                )}
              </div>
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
            disabled={loading}
            className="mt-6 w-full bg-blue-500 px-4 py-3 bg-gradient-to-t from-primaryColor to-secondaryColor rounded-3xl text-white font-bold shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding Book...
              </span>
            ) : (
              "Add Book"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
