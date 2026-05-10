/**
 * Feature: personal-portfolio-blog
 *
 * `Layout` — root layout for every route. Wraps the outlet in a page
 * transition and a Suspense boundary so that lazy-loaded pages show a
 * full-screen skeleton instead of a blank frame.
 *
 * Requirements: 4.6, 4.7, 12.3, 13.5, 14.1
 */
import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { GradientBackground } from "./GradientBackground";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";
import { PageTransition } from "../ui/PageTransition";
import { FullScreenSkeleton } from "../ui/Skeleton";

export function Layout(): JSX.Element {
  const location = useLocation();

  return (
    <>
      <GradientBackground />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-accentContrast"
      >
        Skip to content
      </a>
      <NavBar />
      <main
        id="main"
        className="mx-4 md:mx-8 min-h-[calc(100vh-180px)] pt-8"
      >
        <PageTransition locationKey={location.pathname}>
          <Suspense fallback={<FullScreenSkeleton />}>
            <Outlet />
          </Suspense>
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}

export default Layout;
