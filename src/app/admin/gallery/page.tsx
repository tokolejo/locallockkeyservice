import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getGalleryItems } from "@/lib/data/store";

export const metadata = {
  title: "Completed Works Gallery | Locksmith Admin",
  description: "Upload verified job photos, set cover images, and manage portfolio items",
};

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Completed Works Portfolio"
        subtitle="Upload job photos, choose main cover images, and manage emergency work proofs"
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
        <GalleryManager initialItems={items} />
      </div>
    </div>
  );
}
