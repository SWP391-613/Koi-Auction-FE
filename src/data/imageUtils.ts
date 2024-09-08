import axios from 'axios';
// import 'dotenv/config';

// const BASE_URL_DEVELOPMENT_BE = process.env.BASE_URL_DEVELOPMENT_BE ?? "http://localhost:8080/api/v1"
type UnsplashImageDTO = {
    slug: string;
    description: string;
    alt_description: string;
    urls: Record<string, {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
        small_s3: string;
    }>;
};

export async function getImagesFromUnsplash(search: string, quantity: number): Promise<UnsplashImageDTO[]> {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/products/test/view?query=${search}&perPage=${quantity}`);

        // Ensure the response data matches the expected type
        const data: UnsplashImageDTO[] = response.data;

        console.log(data); // Output the data to verify
        return data; // Return the data to satisfy the return type
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array if there's an error
    }
}