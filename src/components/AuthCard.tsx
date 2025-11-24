"use client";
import React from "react";

type AuthCardProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#fffaf8] py-12 px-4">
      <div className="w-full flex justify-center">
        <div className="bg-white rounded-3xl shadow px-6 py-8 md:py-10 w-full max-w-md mx-auto z-20">
          {title && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black">{title}</h2>
              {subtitle && <p className="text-sm text-black/80">{subtitle}</p>}
            </div>
          )}

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
