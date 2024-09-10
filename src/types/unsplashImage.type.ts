export interface UnsplashImageDTO {
  slug: string;
  description: string;
  alt_description: string;
  urls: Record<
    string,
    {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
      small_s3: string;
    }
  >;
}
