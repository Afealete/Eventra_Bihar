import Link from "next/link";

export default function VendorPortalPage() {
  return (
    <main className="bg-gradient-to-br from-[#fffdfc] via-[#fff7f3] to-[#ffe9df] px-4 py-12 sm:px-6 sm:py-20">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#f0ded8] bg-white shadow-xl">
        <div className="grid lg:grid-cols-[1.15fr_.85fr]">
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B000F]">Vendor portal</p>
            <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-[#5c1632] sm:text-5xl">Grow your event business with Eventra.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700">
              Create your vendor profile, showcase services, manage availability, and respond to customer booking requests from one workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/vendor/auth" className="rounded-xl bg-[#8B000F] px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-[#6b000f]">
                Sign in or register
              </Link>
              <Link href="/services" className="rounded-xl border border-[#8B000F] bg-white px-6 py-3 text-center font-semibold text-[#8B000F] transition hover:bg-[#fff0f3]">
                Browse marketplace
              </Link>
            </div>
          </div>
          <aside className="border-t border-[#f0ded8] bg-[#fff7f3] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#8B000F]">Your workspace</p>
            <div className="mt-6 grid gap-4">
              {["Build a trusted business profile", "Publish services and starting prices", "Control unavailable event dates", "Review and manage booking requests"].map((benefit, index) => (
                <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-[#f0ded8] bg-white p-4 shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0f3] text-sm font-bold text-[#8B000F]">{index + 1}</span>
                  <p className="pt-1 font-semibold text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
