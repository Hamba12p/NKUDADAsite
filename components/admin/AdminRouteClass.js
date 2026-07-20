"use client";

import { useEffect } from "react";

export default function AdminRouteClass({ children }) {
  useEffect(() => {
    document.body.classList.add("admin-route");
    return () => {
      document.body.classList.remove("admin-route");
    };
  }, []);

  return children;
}
