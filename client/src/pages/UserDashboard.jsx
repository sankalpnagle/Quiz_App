import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://quiz-app-g3u7.onrender.com/api";

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/quizzes/public`);
        setQuizzes(data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
              Available Quizzes
            </h2>
            <p className="text-sm text-slate-500">
              Choose a quiz and test your knowledge.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            User Dashboard
          </span>
        </div>

        {/* Content */}
        <div className="bg-white shadow-md rounded-2xl p-4 md:p-6">
          {loading && (
            <p className="text-sm text-slate-500">Loading quizzes...</p>
          )}

          {!loading && quizzes.length === 0 && (
            <p className="text-sm text-slate-500">
              No quizzes available right now. Please check back later.
            </p>
          )}

          {!loading && quizzes.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((q) => (
                <div
                  key={q._id}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1 line-clamp-2">
                      {q.title}
                    </h3>
                    {q.description && (
                      <p className="text-sm text-slate-500 mb-3 line-clamp-3">
                        {q.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {/* If your API returns createdAt, you could format it here */}
                      Ready to attempt
                    </span>
                    <Link
                      to={`/TakeQuizPage/${q._id}`}
                      className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-1.5 text-xs md:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                    >
                      Take Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
