import React, { useState } from "react";
import { searchBooks } from "../hooks/bookService";
import SearchBookCard from "./SearchBookCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import HeadingText from "./Heading";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    const results = await searchBooks(searchTerm);
    setBooks(results);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    if (newValue === "") {
      setHasSearched(false);
      setBooks(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-4">
        <HeadingText fullName="Discover Your Next Read" bgName="Search Book" />
      </div>

      <div className="sticky top-20 bg-white z-10 py-4">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Search by title, author, language, or publish year (e.g., 2000)"
                className="w-full p-4 py-4 rounded-full border-2 border-gray-300 focus:border-primaryColor focus:outline-none transition-colors duration-300 pr-12"
              />
              <button
                type="submit"
                className="absolute h-12 w-12 right-2 top-1/2 transform -translate-y-1/2 bg-secondaryColor text-white rounded-full p-2 hover:bg-primaryColor transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto p-4 flex-grow">
        {loading ? (
          <div className="text-center">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="3x"
              className="text-blue-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books && books.length > 0 ? (
              books.map((book) => <SearchBookCard key={book.id} book={book} />)
            ) : (
              <p className="text-center col-span-full text-xl text-gray-600">
                {hasSearched
                  ? `No books found. ${
                      /^\d{4}$/.test(searchTerm)
                        ? "Try a different year or search by title/author."
                        : "Try a different search term!"
                    }`
                  : "Start your search to discover amazing books!"}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
