import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Ingredients } from "@/components/home/Ingredients";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <FeaturedProducts />
      <Ingredients />
      <Testimonials />
      <FAQ />
    </>
  );
}
