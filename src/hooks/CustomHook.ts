import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRedirectIfEmpty = (
  data: any[] | null | undefined,
  redirectPath: string = "/notfound",
) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      navigate(redirectPath);
    }
  }, [data, navigate, redirectPath]);
};
