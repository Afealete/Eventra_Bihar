"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VendorSidebar from "../sidebar";
import { getVendorProfile, saveVendorProfile, uploadProfileImage } from "../../../../lib/vendor-api";
import { getCategories, VendorCategory } from "../../../../lib/vendors";
import { me } from "../../../../lib/auth";

export default function VendorProfile() {
  const router = useRouter();
  const [categories, setCategories] = useState<VendorCategory[]>([]);
  const [businessName, setBusinessName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([me(), getCategories(), getVendorProfile()]).then(([session, categoryData, profileData]) => {
      if (!active) return;
      if (!session?.user || session.user.role !== "vendor") { router.replace("/vendor/auth"); return; }
      setCategories(categoryData.categories);
      const profile = profileData.vendor;
      if (profile) {
        setBusinessName(profile.businessName); setCategorySlug(profile.category?.slug || ""); setCity(profile.city);
        setDescription(profile.description); setPhone(profile.phone || ""); setAvatarUrl(profile.avatarUrl || "");
        setPrice(profile.priceFromMinor === null ? "" : String(profile.priceFromMinor / 100));
        setStatus(profile.approvalStatus === "approved" ? "Your profile is approved and publicly visible." : "Your profile is pending admin approval.");
      } else setBusinessName(session.user.name || "");
    }).catch((error) => active && setStatus(error.message || "Unable to load profile.")).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const rupees = price === "" ? null : Number(price);
    if (rupees !== null && (!Number.isFinite(rupees) || rupees < 0)) { setStatus("Enter a valid starting price."); return; }
    setSaving(true);
    try {
      const data = await saveVendorProfile({ businessName, categorySlug, city, description, phone: phone || null, avatarUrl: avatarUrl || null, priceFromMinor: rupees === null ? null : Math.round(rupees * 100) });
      setStatus(data.vendor.approvalStatus === "approved" ? "Profile saved and visible to customers." : "Profile saved. It is pending admin approval.");
    } catch (error: any) { setStatus(error.message || "Unable to save profile."); }
    finally { setSaving(false); }
  }

  async function uploadImage(file?: File) {
    if (!file) return;
    setUploading(true);
    try { const data = await uploadProfileImage(file); setAvatarUrl(data.url || ""); setStatus("Profile image uploaded. Save the profile to keep it."); }
    catch (error: any) { setStatus(error.message || "Unable to upload image."); }
    finally { setUploading(false); }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading profile…</div>;
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <VendorSidebar />
      <main className="flex-1 p-6 pt-20 md:pt-8 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-[#8B000F]">Vendor Profile</h1>
        <p className="mt-2">Complete this profile before adding services. Public visibility requires admin approval; the approval status cannot be edited here.</p>
        <form onSubmit={submit} className="mt-6 bg-white rounded-xl shadow p-6 grid gap-4">
          {avatarUrl && <img src={avatarUrl} alt="Vendor profile preview" className="h-40 w-40 rounded-2xl object-cover" />}
          <label htmlFor="business-name" className="text-sm font-semibold">Business name</label><input id="business-name" required value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="border rounded p-3" />
          <label htmlFor="vendor-category" className="text-sm font-semibold">Category</label><select id="vendor-category" required value={categorySlug} onChange={(event) => setCategorySlug(event.target.value)} className="border rounded p-3"><option value="">Choose category</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select>
          <label htmlFor="vendor-city" className="text-sm font-semibold">City</label><input id="vendor-city" required value={city} onChange={(event) => setCity(event.target.value)} className="border rounded p-3" />
          <label htmlFor="vendor-phone" className="text-sm font-semibold">Business phone</label><input id="vendor-phone" value={phone} onChange={(event) => setPhone(event.target.value)} className="border rounded p-3" />
          <label htmlFor="vendor-image-url" className="text-sm font-semibold">Profile image URL</label><input id="vendor-image-url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} className="border rounded p-3" />
          <label className="border rounded p-3 font-semibold">Upload profile image <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || saving} onChange={(event) => uploadImage(event.target.files?.[0])} /></label>
          <label htmlFor="vendor-price" className="text-sm font-semibold">Starting price in INR</label><input id="vendor-price" value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="0" placeholder="Optional" className="border rounded p-3" />
          <label htmlFor="vendor-description" className="text-sm font-semibold">Business description</label><textarea id="vendor-description" required value={description} onChange={(event) => setDescription(event.target.value)} className="border rounded p-3 min-h-32" />
          <button disabled={saving || uploading} className="bg-[#8B000F] text-white rounded p-3 font-semibold disabled:opacity-60">{saving ? "Saving…" : "Save profile"}</button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </main>
    </div>
  );
}
