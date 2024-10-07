import React, { useState } from "react";

const ShrinkDescription = ({ desc, size = 150 }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const MAX_DESCRIPTION_LENGTH = size;

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const renderDescription = () => {
    if (!desc) return <p>No description available!</p>;

    if (desc.length <= MAX_DESCRIPTION_LENGTH) {
      return <p>{desc}</p>;
    }

    if (showFullDescription) {
      return (
        <div>
          <p className="text-lg text-gray-700">{desc}</p>
          <button
            onClick={toggleDescription}
            className="text-blue-500 mt-2 hover:text-blue-700"
          >
            Show Less
          </button>
        </div>
      );
    }

    return (
      <div>
        <p className="text-lg text-gray-700">
          {desc.slice(0, MAX_DESCRIPTION_LENGTH)}...
        </p>
        <button
          onClick={toggleDescription}
          className="text-blue-500 mt-2 hover:text-blue-700"
        >
          Show More
        </button>
      </div>
    );
  };

  return <div className="">{renderDescription()}</div>;
};

export default ShrinkDescription;
