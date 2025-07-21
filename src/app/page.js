export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-24 min-h-screen bg-gradient-to-br from-white to-gray-100 pt-40">
      {/* Text + Buttons Section */}
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Welcome to <span className="text-indigo-600">BuildScheduler</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto lg:mx-0">
          A smart system to manage construction workforce & equipment with role-based access and real-time scheduling.
        </p>

        {/* Register & Login Buttons */}
        <div className="flex justify-center lg:justify-start gap-4">
          <a
            href="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition shadow text-base font-medium"
          >
            Register
          </a>
          <a
            href="/login"
            className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition border text-base font-medium"
          >
            Login
          </a>
        </div>
      </div>

      {/* Static Image Section */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
        <img
          src="/images/landing.jpg"
          alt="BuildScheduler"
          className="rounded-lg shadow-lg h-[350px] w-full max-w-md object-cover"
        />
      </div>
    </div>
  );
}
