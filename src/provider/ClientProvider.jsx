"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./AuthProvider";

const ClientProvider = ({ children }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
    </QueryClientProvider>
  );
};

export default ClientProvider;
