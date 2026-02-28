import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import QuizPage from "./pages/QuizPage";
import AddQuiz from "./pages/admin/AddQuiz";
import UpdateQuiz from "./pages/admin/UpdateQuiz";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz/:topic" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute adminOnly={true}><AddQuiz /></ProtectedRoute>} />
        <Route path="/admin/update/:id" element={<ProtectedRoute adminOnly={true}><UpdateQuiz /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;