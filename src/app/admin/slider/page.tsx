import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SliderManager } from "@/components/admin/SliderManager";
import { getHeroSlides } from "@/lib/data/store";

export const metadata = {
  title: "Hero Slider | Locksmith Admin",
  description: "Manage homepage hero banner slides, imagery, badges, and headlines",
};

export default async function AdminSliderPage() {
  const slides = await getHeroSlides();

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Homepage Hero Slider"
        subtitle="Manage hero banner slides, headlines, emergency badges, and responsive photos"
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
        <SliderManager initialSlides={slides} />
      </div>
    </div>
  );
}
