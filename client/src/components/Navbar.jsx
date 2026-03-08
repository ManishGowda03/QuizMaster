import { useNavigate } from "react-router-dom";
import { FaBrain } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* Logo + Brand */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <FaBrain className="text-emerald-300 text-2xl" />
        <h1 className="text-xl font-bold text-gray-900">
          QuizMaster
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">

        {user && (
          <span className="text-gray-700 flex items-center gap-2 text-sm md:text-base">
            Welcome, <span className="font-semibold">{user.user?.name}</span>

            {user.user?.role === "admin" && (
              <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold">
                Admin
              </span>
            )}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition px-4 py-2 text-white rounded-lg text-sm md:text-base"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;