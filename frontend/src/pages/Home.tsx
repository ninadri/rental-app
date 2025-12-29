import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              RP
            </span>
            <span className="font-semibold text-slate-900">
              Rental Property
            </span>
          </div>

          <nav>
            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <section className="bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome home.
              </h1>
              <p className="text-sm md:text-base text-slate-200 mb-4">
                A cozy, well–kept property in a quiet neighborhood, close to
                everything you need — with a tenant portal to keep maintenance
                requests and announcements organized.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-white text-slate-900 text-sm font-medium hover:bg-slate-100"
              >
                Tenant / Admin Login
              </Link>
            </div>

            {/* Hero image */}
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-800">
              <img
                src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
                alt="Property exterior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              About the property
            </h2>
            <p className="text-sm text-slate-700">
              Describe your property here: number of bedrooms, bathrooms, any
              recent renovations, parking, pet policy, and any special touches
              that make it feel like home.
            </p>
            <p className="text-sm text-slate-700">
              You can later replace this text with real copy and photos of your
              actual unit or building.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
              The area
            </h3>
            <p className="text-sm text-slate-700">
              Talk about nearby parks, grocery stores, restaurants, schools, or
              anything that makes the area special.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} Rental Property</span>
          <span>Tenant & Admin Portal</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
