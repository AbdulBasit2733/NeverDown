"use client"

import Dashboard from "@/components/dashboard";
import { useRouter } from "next/navigation";

export default function () {
  const router = useRouter();

  return (
    <div>
      <Dashboard
        onSignout={() => {
          localStorage.removeItem("token");
          router.push("/");
        }}
      />
    </div>
  );
}
