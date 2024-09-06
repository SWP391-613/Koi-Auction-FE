// import axios from 'axios';
// import 'dotenv/config'

// const UNSPLASH_ROOT = process.env.REACT_APP_UNSPLASH_ROOT ?? "https://api.unsplash.com" 
// const UNSPLASH_ACCESS_KEY=process.env.REACT_APP_UNSPLASH_ACCESS_KEY ?? ""
// const totalPage = 2

// type ImageModel = {
//   id: string;
//   slug: string;
//   alternative_slugs: Record<string, string>; // Assuming it's an object with key-value pairs
//   created_at: string; // ISO date string
//   updated_at: string; // ISO date string
//   promoted_at: string | null; // Nullable string
//   width: number;
//   height: number;
//   color: string;
//   blur_hash: string;
//   description: string | null; // Nullable string
//   alt_description: string | null; // Nullable string
//   breadcrumbs: string[]; // Assuming an array of strings
//   urls: {
//     raw: string;
//     full: string;
//     regular: string;
//     small: string;
//     thumb: string;
//   }; // Object with different URL formats
//   links: {
//     self: string;
//     html: string;
//     download: string;
//     download_location: string;
//   }; // Object with various links
//   likes: number;
//   liked_by_user: boolean;
//   current_user_collections: any[]; // Assuming an array of any type
//   sponsorship: null; // Assuming sponsorship is null in this case
//   topic_submissions: Record<string, any>; // Assuming an object with key-value pairs
//   asset_type: string;
//   user: {
//     id: string;
//     username: string;
//     name: string;
//     first_name: string;
//     last_name: string | null;
//     portfolio_url: string | null;
//     bio: string | null;
//     location: string | null;
//     total_likes: number;
//     total_photos: number;
//     total_collections: number;
//     profile_image: {
//       small: string;
//       medium: string;
//       large: string;
//     };
//     links: {
//       self: string;
//       html: string;
//       photos: string;
//       likes: string;
//       portfolio: string;
//       following: string;
//       followers: string;
//     };
//   }; // User object
//   tags: {
//     title: string;
//   }[]; // Array of tag objects
// };


// type Image = {
//   total: number
//   total_pages: number
//   result: ImageModel[] 
// }

// // Want to use async/await? Add the `async` keyword to your outer function/method.
// async function getUser() {
//   try {
//     const response = await axios.get(`${UNSPLASH_ROOT}/search/photos?query=koi&client_id=${UNSPLASH_ACCESS_KEY}&per_page=${totalPage}`);
//     // Make sure the results array is not empty
//     if (response.data.results.length > 0) {
//         const firstResult = response.data.results[0]; // Access the first object in the results array
//         console.log(firstResult.urls.raw); // Now access the 'urls.raw' property correctly
//       } else {
//         console.log("No results found.");
//       }
//   } catch (error) {
//     console.error(error);
//   }
// };

// getUser();