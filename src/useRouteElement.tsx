import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const AuthContainer = lazy(() => import("./pages/auth/AuthContainer"));

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: "/auth",
      element: <AuthContainer />,
    },
  ]);
}
