import React, { useState } from "react";

const ShrinkDescription = ({ desc, size = 150 }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const MAX_DESCRIPTION_LENGTH = size;

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const renderDescription = () => {
    if (!desc) return <div>No description available!</div>;

    if (desc.length <= MAX_DESCRIPTION_LENGTH) {
      return <div>{desc}</div>;
    }

    if (showFullDescription) {
      return (
        <div>
          <div className="text-lg text-gray-700">{desc}</div>
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
        <div className="text-lg text-gray-700">
          {desc.slice(0, MAX_DESCRIPTION_LENGTH)}...
        </div>
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
