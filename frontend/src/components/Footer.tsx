import Link from "next/link";

export default function Footer() {
  return <footer className="mt-16 border-t border-[#f2ddd5] bg-[#fff8f5] text-slate-700">
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
      <div><h2 className="font-serif text-xl font-bold text-[#8B000F]">Eventra Bihar</h2><p className="mt-3 text-sm leading-6">Discover event professionals across Bihar, compare services, and send booking requests with confidence.</p><p className="mt-4 text-sm">© {new Date().getFullYear()} Eventra Bihar</p></div>
      <div><h2 className="font-semibold text-[#6b1839]">Explore</h2><ul className="mt-3 space-y-2 text-sm"><li><Link href="/">Home</Link></li><li><Link href="/services">Browse vendors</Link></li><li><Link href="/profile#bookings">My bookings</Link></li><li><Link href="/vendor">Vendor portal</Link></li></ul></div>
      <div><h2 className="font-semibold text-[#6b1839]">Support</h2><p className="mt-3 text-sm leading-6">For help with an Eventra account, contact <span className="font-medium">help@eventra.example</span>. Vendor enquiries can be started from the Vendor Portal.</p></div>
    </div>
  </footer>;
}
