"use client";

import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/app/admin/AdminDashboard";

const ADMIN_PASSWORD = "123456";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = () => {
    if (value === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
    } else {
      alert("Incorrect password");
      setValue("");
    }
  };

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="container mx-auto py-8 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Admin Authentication</h1>
      <div className="space-y-4">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="text-center text-sm">
          {value === "" ? (
            <>Enter the admin password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
        <Button onClick={handleSubmit} className="w-full">
          Submit
        </Button>
      </div>
    </div>
  );
}
