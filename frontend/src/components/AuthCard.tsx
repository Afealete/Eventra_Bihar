"use client";
import React from "react";

type AuthCardProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fffdfc] via-[#fff7f3] to-[#ffe9df] px-4 py-12">
      <div className="w-full flex justify-center">
        <div className="z-20 mx-auto w-full max-w-md rounded-3xl border border-[#f0ded8] bg-white px-6 py-8 shadow-xl md:px-8 md:py-10">
          {title && (
            <div className="mb-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#8B000F]">Eventra Bihar</p>
              <h2 className="font-serif text-3xl font-bold text-[#5c1632]">{title}</h2>
              {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
            </div>
          )}

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
