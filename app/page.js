export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-black text-primary">LinkSmart 🚀</h1>
      <p className="mt-4 text-gray-600 text-lg text-center px-4">
        Prêt à créer ta page de liens personnalisée ?
      </p>
      <div className="mt-8 space-x-4">
        <a href="/login" className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg">
          Se connecter
        </a>
      </div>
    </div>
  );
}