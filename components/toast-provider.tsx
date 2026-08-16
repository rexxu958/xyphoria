"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#0F0F1A",
          color: "#F2F2F7",
          border: "1px solid #1E1E2E"
        }
      }}
    />
  );
}
