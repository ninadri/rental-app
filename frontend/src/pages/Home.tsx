import { Link } from "react-router-dom";
import home from "../assets/photos/home.jpg";

const Home = () => {
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
            <span className="font-semibold text-body">
              MITSPROP, LLC Rental Property
            </span>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-1">
        <section className="bg-brand text-white">
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
                Use this space to describe your property: number of bedrooms,
                natural light, updates you’ve made, and what it feels like to
                live here. Later you can swap this copy for real details.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-white text-brand text-sm font-medium hover:bg-brand-light/70 transition-colors"
                >
                  Tenant / Admin Login
                </Link>

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
            </div>
          </div>
        </section>

        {/* Features row */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                The home
              </p>
              <p className="text-sm font-semibold text-slate-900">
                2–3 bedroom layout, lots of natural light, updated finishes, and
                room to make it your own.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Convenience
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Close to grocery stores, coffee shops, and quick access to main
                roads or transit.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Community
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Quiet, friendly neighborhood where people look out for each
                other.
              </p>
            </div>
          </div>
        </section>

        {/* Image strip + about area */}
        <section className="max-w-6xl mx-auto px-4 pb-12 grid gap-8 lg:grid-cols-3">
          {/* Image strip / gallery */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              A quick look inside
            </h2>
            <p className="text-sm text-slate-700">
              Swap these photos with real pictures of your property later. You
              can keep the layout and just update the image URLs.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src="https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg"
                  alt="Living room"
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src="https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg"
                  alt="Kitchen"
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src="https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg"
                  alt="Bedroom"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          </div>

          {/* About the area */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              About the area
            </h3>
            <p className="text-sm text-slate-700">
              Use this space to talk about nearby parks, trails, favorite local
              coffee shops, schools, or anything that makes this location feel
              special.
            </p>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• 5–10 minutes to groceries & essentials</li>
              <li>• Short drive to dining, shopping, or entertainment</li>
              <li>• Easy access to major roads or transit</li>
            </ul>
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

export default Home;
