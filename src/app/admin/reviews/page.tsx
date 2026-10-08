import React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReviewsManager } from "@/components/admin/ReviewsManager";
import { getAllTestimonials } from "@/lib/data/store";

export const metadata = {
  title: "Customer Reviews & Google Sync | Locksmith Admin",
  description: "Moderate reviews, add customer testimonials, and sync Google Maps ratings",
};

export default async function AdminReviewsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Customer Reviews & Ratings"
        subtitle="Review moderation, testimonial management, and live Google Maps reviews synchronization"
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
        <ReviewsManager initialTestimonials={testimonials} />
      </div>
    </div>
  );
}
