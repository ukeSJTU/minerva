"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <Image
          src="/images/not-found.jpg"
          alt="Not Found"
          height={800}
          width={800}
          className="mb-8"
        />
        <h1 className="text-2xl font-bold mb-4">
          You have come to an unknown place.
        </h1>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    </div>
  );
}
