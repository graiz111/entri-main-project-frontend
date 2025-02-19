import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeftCircle } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">
        <div className="flex justify-center">
          <Lock className="w-16 h-16 text-red-500 animate-bounce" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <ArrowLeftCircle className="w-5 h-5" /> Go Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
