import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { GiBrain } from "react-icons/gi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must include uppercase, lowercase, number and be 8+ characters"
      );
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-slate-100 to-emerald-100 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
      >

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-xl shadow-md">
            <GiBrain size={28} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create your account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Name */}
        <div className="relative mb-5">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder=" "
            required
            className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 focus:border-blue-500 outline-none"
          />
          <label className="absolute left-3 top-2 text-gray-500 text-sm
          transition-all
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400
          peer-focus:top-2
          peer-focus:text-sm
          peer-focus:text-blue-600">
            Full Name
          </label>
        </div>

        {/* Email */}
        <div className="relative mb-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            required
            className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 focus:border-blue-500 outline-none"
          />
          <label className="absolute left-3 top-2 text-gray-500 text-sm
          transition-all
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400
          peer-focus:top-2
          peer-focus:text-sm
          peer-focus:text-blue-600">
            Email Address
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
            className="peer w-full border border-gray-300 rounded-lg p-3 pt-5 focus:border-blue-500 outline-none"
          />

          <label className="absolute left-3 top-2 text-gray-500 text-sm
          transition-all
          peer-placeholder-shown:top-3
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-gray-400
          peer-focus:top-2
          peer-focus:text-sm
          peer-focus:text-blue-600">
            Password
          </label>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-semibold shadow transition"
        >
          Register
        </button>

        <div className="my-6 border-t"></div>

        <p className="text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}

export default Register;