import axios from "axios";
import { UnsplashImageDTO } from "~/types/unsplashImage.type";

export async function getImagesFromUnsplash(
  search: string,
  quantity: number,
): Promise<UnsplashImageDTO[]> {
  try {
    const response = await axios.get(
      `http://localhost:4000/api/v1/products/test/view?query=${search}&perPage=${quantity}`,
    );

    // Ensure the response data matches the expected type
    const data: UnsplashImageDTO[] = response.data;

    console.log(data); // Output the data to verify
    return data; // Return the data to satisfy the return type
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array if there's an error
  }
}
