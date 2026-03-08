import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GiBrain } from "react-icons/gi";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <GiBrain className="text-green-500 text-2xl" />
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
            onClick={() => setShowLogoutModal(true)}
            className="bg-red-500 hover:bg-red-600 transition px-4 py-2 text-white rounded-lg text-sm md:text-base"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center animate-scaleIn">

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Logout
            </h2>

            <p className="text-gray-500 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;