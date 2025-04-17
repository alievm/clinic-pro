import { Outlet, Link } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-blue-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">ClinicPro</h1>
        <nav className="space-y-2">
          <Link to="/" className="block hover:text-gray-300">🏠 Home</Link>
          {/* Добавь другие ссылки */}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
