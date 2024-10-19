import { useState, useEffect, useCallback } from "react";

interface SearchResult {
  id: number;
  name: string;
  // Add other properties as needed
}

export const useSearch = (debounceTime = 300) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState<Error | null>(null);

  const searchApi = useCallback(async (searchQuery: string) => {
    setLoadingSearch(true);
    setErrorSearch(null);

    console.log("heheheh");
    try {
      // Replace with your actual API call
      const response = await fetch(
        `https://api.example.com/search?q=${searchQuery}`,
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setErrorSearch(
        err instanceof Error ? err : new Error("An error occurred"),
      );
      setResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      const handler = setTimeout(() => searchApi(query), debounceTime);
      return () => clearTimeout(handler);
    } else {
      setResults([]);
    }
  }, [query, debounceTime, searchApi]);

  const handleSearch = useCallback(() => {
    searchApi(query);
  }, [query, searchApi]);

  return { query, setQuery, results, loadingSearch, errorSearch, handleSearch };
};
