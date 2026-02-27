import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <h1 className="text-white font-bold text-xl">
        QuizMaster 🎯
      </h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-gray-300">
            Welcome, {user.user?.name}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;