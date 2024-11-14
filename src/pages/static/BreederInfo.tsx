import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingComponent from "~/components/shared/LoadingComponent";
import NavigateButton from "~/components/shared/NavigateButton";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import KoiOwnerSearchNotAuthComponent from "~/components/search/KoiOwnerSearchComponentNotAuth";

const BreederInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Grab breeder ID from URL
  const navigate = useNavigate();
  const [breeder, setBreeder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  const fetchBreederById = async (breederId: string) => {
    try {
      const response = await axios.get(
        `https://koi-auction-be-az-dtarcyafdhc2gcen.southeastasia-01.azurewebsites.net/api/v1/breeders/${breederId}`,
      );

      if (response.data) {
        setBreeder(response.data); // Store the breeder data
      } else {
        navigate("/notfound"); // Redirect if breeder not found
      }
    } catch (error) {
      console.error("Error fetching breeder:", error);
      navigate("/notfound"); // Redirect on error
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    if (id) {
      fetchBreederById(id); // Fetch breeder details on component mount
    }
  }, [id]);

  if (isLoading) {
    return <LoadingComponent />; // Show loading spinner
  }

  if (!breeder) {
    return <div>Breeder not found</div>; // Show if no breeder found
  }

  return (
    <div className="container mx-auto mt-8 px-4 mb-8">
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          marginBottom: "1rem",
        }}
      >
        <NavigateButton
          to="/"
          icon={<FontAwesomeIcon icon={faArrowLeft} />}
          text=""
          className="rounded bg-gray-300 px-5 py-3 text-lg text-black transition hover:bg-gray-200"
        />
      </Box>

      <div className="rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center">
          <img
            src={breeder.avatar_url}
            alt={`${breeder.first_name} logo`}
            className="mr-4 h-20 w-20"
          />
          <h1 className="text-3xl font-bold">
            {breeder.first_name} {breeder.last_name}
          </h1>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">
            About {breeder.first_name}
          </h2>
          <p className="text-gray-700">
            {breeder.description ||
              "This breeder specializes in high-quality Koi fish."}
          </p>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">Specialties</h2>
          <ul className="list-inside list-disc text-gray-700">
            {breeder.specialties?.map((specialty: string, index: number) => (
              <li key={index}>{specialty}</li>
            )) || (
              <>
                <li>High-quality Kohaku</li>
                <li>Rare Showa varieties</li>
                <li>Champion Sanke bloodlines</li>
              </>
            )}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Contact Information</h2>
          <p className="text-gray-700">
            Email:{" "}
            {breeder.email || `info@${breeder.first_name.toLowerCase()}.com`}
          </p>
          <p className="text-gray-700">
            Phone: {breeder.phone || "+81 XXX-XXX-XXXX"}
          </p>
        </div>
      </div>

      <KoiOwnerSearchNotAuthComponent
        owner_id={breeder.id}
        onSearchStateChange={handleSearchStateChange}
      />
    </div>
  );
};

export default BreederInfo;
