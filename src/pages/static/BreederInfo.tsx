import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import KoiOwnerSearchNotAuthComponent from "~/components/search/KoiOwnerSearchComponentNotAuth";
import { koiBreeders } from "../../utils/data/koibreeders";
import LoadingComponent from "~/components/shared/LoadingComponent";
import NavigateButton from "~/components/shared/NavigateButton";
import { Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BreederInfo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [breeder, setBreeder] = useState<(typeof koiBreeders)[0] | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchStateChange = (isActive: boolean) => {
    setIsSearchActive(isActive);
  };

  useEffect(() => {
    if (!id) return;

    const breederId = parseInt(id, 10);
    const foundBreeder = koiBreeders.find((b) => b.id === breederId);

    if (!foundBreeder) {
      navigate("/notfound");
      return;
    }

    setBreeder(foundBreeder);
  }, [id, navigate]);

  if (!breeder) {
    return <LoadingComponent />;
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
            alt={`${breeder.name} logo`}
            className="mr-4 h-20 w-20"
          />
          <h1 className="text-3xl font-bold">{breeder.name}</h1>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">About {breeder.name}</h2>
          <p className="text-gray-700">
            {breeder.name} is a renowned koi breeder known for their exceptional
            quality and unique varieties. They have been in the business for
            many years, consistently producing award-winning koi.
          </p>
        </div>
        <div className="mb-4">
          <h2 className="mb-2 text-xl font-semibold">Specialties</h2>
          <ul className="list-inside list-disc text-gray-700">
            <li>High-quality Kohaku</li>
            <li>Rare Showa varieties</li>
            <li>Champion Sanke bloodlines</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-xl font-semibold">Contact Information</h2>
          <p className="text-gray-700">
            Email: info@{breeder.name.toLowerCase()}.com
          </p>
          <p className="text-gray-700">Phone: +81 XXX-XXX-XXXX</p>
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
