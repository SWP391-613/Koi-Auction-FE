import React, { useEffect, useState } from "react";
import "./BrandGrid.scss";
import { getImagesFromUnsplash } from "../../utils/data/imageUtils.ts"; // Import your API function

function BrandGrid() {
  // State to hold the images data
  const [koiImages, setKoiImages] = useState([]);

  // Fetch images from the API when the component mounts
  useEffect(() => {
    async function fetchData() {
      const images = await getImagesFromUnsplash("koi", 20); // Adjust the search term and quantity as needed
      setKoiImages(images); // Store the fetched images in state
    }

    fetchData(); // Call the function to fetch data
  }, []); // Empty dependency array means this runs once after the first render

  // Render a loading state if images are not yet available
  if (koiImages.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid-container gap-1 p-2">
      {koiImages.map((image, index) => (
        <div key={index} className="brand-item">
          <img
            src={image.urls.regular}
            alt={image.alt_description || image.description}
            className="brand-logo"
          />
          <p className="brand-name">{image.slug}</p>
        </div>
      ))}
    </div>
  );
}

export default BrandGrid;
