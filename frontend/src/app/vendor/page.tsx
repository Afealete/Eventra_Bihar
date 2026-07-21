import Link from "next/link";

export default function VendorPortalPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B000F]">Vendor portal</p>
      <h1 className="mt-4 text-4xl font-extrabold text-[#6b1839]">Grow your wedding business with Eventra.</h1>
      <p className="mt-5 text-lg text-black/75">
        Create your vendor profile, add services, manage availability, and respond to booking requests.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/vendor/auth" className="rounded-lg bg-[#8B000F] px-6 py-3 font-semibold text-white hover:bg-[#6b000f]">
          Vendor sign in or register
        </Link>
        <Link href="/services" className="rounded-lg border border-[#8B000F] px-6 py-3 font-semibold text-[#8B000F] hover:bg-[#fff0f3]">
          Browse vendors
        </Link>
      </div>
    </main>
  );
}
