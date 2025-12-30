import { Link } from "react-router-dom";

import home from "../assets/photos/home.jpg";
import PhotoCarousel from "./components/PhotoCarousel";

import livingRoom1 from "../assets/photos/living-room.jpeg";
import livingRoom2 from "../assets/photos/living-room2.jpeg";
import kitchen1 from "../assets/photos/kitchen.jpeg";
import kitchen2 from "../assets/photos/kitchen2.jpeg";
import diningArea from "../assets/photos/dining-area.jpeg";
import master1 from "../assets/photos/master.jpeg";
import master2 from "../assets/photos/master2.jpeg";
import hall from "../assets/photos/hall.jpeg";
import entryFront from "../assets/photos/left-front.jpg";

const galleryImages = [
  { src: livingRoom1, alt: "Living room" },
  { src: livingRoom2, alt: "Living room angle 2" },
  { src: kitchen1, alt: "Kitchen" },
  { src: kitchen2, alt: "Kitchen alternate view" },
  { src: diningArea, alt: "Dining area" },
  { src: master1, alt: "Primary bedroom" },
  { src: master2, alt: "Primary bedroom alternate" },
  { src: hall, alt: "Hallway" },
  { src: entryFront, alt: "Front entryway" },
];

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-hairline">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left – Login link */}
          <nav>
            <Link
              to="/login"
              className="px-3 py-1 rounded-md text-sm font-medium text-body hover:bg-brand-light/60 transition-colors"
            >
              Log in
            </Link>
          </nav>

          {/* Right – Brand */}
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-black">
              MP
            </span>
            <span className="font-semibold text-body text-sm">
              MITSPROP, LLC Rental Property
            </span>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1">
        <section className="bg-teal-700 text-white">
          <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-2 items-center">
            {/* Hero text */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
                Welcome home
              </p>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                A cozy place to live, with everything you need nearby.
              </h1>
              <p className="text-sm md:text-base text-slate-200">
                In a quiet East El Paso neighborhood with quick access to nearby
                shopping centers, restaurants, and daily conveniences.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-accent-teal text-sm text-white hover:bg-accent-teal/90 transition-colors"
                >
                  Schedule a tour
                </button>
              </div>
            </div>

            {/* Hero image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <img
                src={home}
                alt="view of the rental property"
                className="w-full h-full object-cover"
              />
              <p className="text-xs text-slate-300 p-2 bg-slate-900/60">
                12549 Martin Bauman Dr · El Paso, TX 79928
              </p>
            </div>
          </div>
        </section>

        {/* Features row */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "The home",
                title: "Comfortable 4 bed / 2 bath layout",
                body: "Lots of natural light, updated finishes, and room to make it your own.",
              },
              {
                label: "Convenience",
                title: "Easy access to everyday essentials",
                body: "Near Loop 375 with quick drives to groceries, shopping, and dining throughout East El Paso.",
              },
              {
                label: "Community",
                title: "Quiet, friendly neighborhood feel",
                body: "A calm area where neighbors look out for each other.",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-5"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {c.label}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900 leading-snug">
                  {c.title}
                </p>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Image strip + about area */}
        <section className="max-w-6xl mx-auto px-4 pb-12 grid gap-8 lg:grid-cols-3">
          {/* Image strip / gallery */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-semibold text-body">
              A quick look inside
            </h2>
            <p className="text-sm text-body/80">
              Swipe through a few photos to get a feel for the space.
            </p>

            <PhotoCarousel images={galleryImages} />

            {/* Thumbnail strip */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
              {galleryImages.slice(0, 10).map((img) => (
                <div
                  key={img.alt}
                  className="rounded-lg overflow-hidden border border-hairline bg-white shadow-sm"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-20 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About the area */}
          <div className="space-y-3 bg-surface-muted rounded-xl p-4 border border-hairline">
            <h3 className="text-sm font-semibold text-body uppercase tracking-wide">
              About the area
            </h3>
            <p className="text-sm text-body/80">
              In a quiet East El Paso neighborhood with quick access to Loop
              375, shopping, dining, and everyday essentials just a short drive
              away.
            </p>

            {/* Mini cards instead of bullets */}
            <div className="grid gap-3">
              {[
                {
                  title: "Essentials",
                  body: "5–10 minutes to groceries & daily needs",
                },
                {
                  title: "Access",
                  body: "Easy connection to Loop 375 + main roads",
                },
                {
                  title: "Lifestyle",
                  body: "Short drive to parks, schools, and local spots",
                },
              ].map((x) => (
                <div
                  key={x.title}
                  className="rounded-lg bg-white/60 border border-hairline p-3"
                >
                  <p className="text-sm font-semibold text-body">{x.title}</p>
                  <p className="mt-1 text-sm text-body/80 leading-relaxed">
                    {x.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} Rental Property</span>
          <span>Tenant & Admin Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
