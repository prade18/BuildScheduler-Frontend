export default function HeroSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Construction Workforce Management Made Simple
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Schedule crews, track equipment, and manage projects with ease
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/register"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started - It's Free
          </a>
          <a
            href="#demo"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Watch Demo
          </a>
        </div>
      </div>
    </section>
  );
}