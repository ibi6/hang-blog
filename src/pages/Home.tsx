/**
 * Feature: personal-portfolio-blog
 *
 * `Home` — landing page. Composes the hero, featured projects, and
 * latest blog posts sections. Home is eagerly imported (not lazy) so
 * the first-meaningful-paint happens as quickly as possible.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
import { HeroSection } from "../components/home/HeroSection";
import { FeaturedProjects } from "../components/home/FeaturedProjects";
import { LatestPosts } from "../components/home/LatestPosts";

export function Home(): JSX.Element {
  return (
    <div className="mx-auto max-w-6xl">
      <HeroSection />
      <FeaturedProjects />
      <LatestPosts />
    </div>
  );
}

export default Home;
