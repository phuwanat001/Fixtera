import Hero from "./components/Hero";
import TagsSection from "./components/TagsSection";
import FeaturedBlogs from "./components/FeaturedBlogs";
import WhySection from "./components/WhySection";
import CTASection from "./components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <TagsSection />
      <FeaturedBlogs />
      <WhySection />
      <CTASection />
    </>
  );
}
