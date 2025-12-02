import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API_BASE_URL = "https://quiz-app-g3u7.onrender.com/api";

const TakeQuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [participantName, setParticipantName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/quizzes/${id}`);
        setQuiz(data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        participantName,
        answers: Object.entries(answers).map(([questionId, userAnswer]) => ({
          questionId,
          userAnswer,
        })),
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/quizzes/${id}/submit`,
        payload
      );
      setResult(data);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading quiz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-2xl px-6 py-4">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Link
            to="/"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Go back to quizzes
          </Link>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  // Result view
  if (result) {
    return (
      <div className="min-h-screen bg-slate-100 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
                Results
              </h2>
              <p className="text-sm text-slate-500">Quiz: {quiz.title}</p>
            </div>
            <Link
              to="/"
              className="text-xs md:text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to quizzes
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 md:p-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="text-sm text-slate-600">Score</p>
                <p className="text-2xl font-semibold text-slate-800">
                  {result.score}/{result.totalQuestions}
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <p className="text-sm text-slate-600">Percentage</p>
                <p className="text-xl font-semibold text-indigo-600">
                  {result.percentage.toFixed(2)}%
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Question-wise Breakdown
            </h3>
            <ul className="space-y-3">
              {result.detailed.map((item) => (
                <li
                  key={item.questionId}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:p-4"
                >
                  <p className="text-sm font-medium text-slate-800 mb-1">
                    {item.questionText}
                  </p>
                  <p className="text-xs text-slate-600">
                    Your answer:{" "}
                    <span className="font-medium">
                      {String(item.userAnswer)}
                    </span>
                  </p>
                  <p className="text-xs text-slate-600">
                    Correct answer:{" "}
                    <span className="font-medium">
                      {String(item.correctAnswer)}
                    </span>
                  </p>
                  <p className="mt-1 text-xs font-semibold">
                    {item.isCorrect ? (
                      <span className="text-emerald-600">✅ Correct</span>
                    ) : (
                      <span className="text-red-500">❌ Incorrect</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking view
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
              {quiz.title}
            </h2>
            {quiz.description && (
              <p className="text-sm text-slate-500 mt-1">{quiz.description}</p>
            )}
          </div>
          <Link
            to="/"
            className="text-xs md:text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to quizzes
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 md:p-8">
          {error && (
            <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Participant name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Your Name (optional)
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {quiz.questions.map((q, index) => (
                <div
                  key={q._id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5"
                >
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    {index + 1}. {q.text}
                  </p>

                  {/* MCQ */}
                  {q.type === "mcq" && (
                    <div className="space-y-2">
                      {q.options?.map((opt) => (
                        <label
                          key={opt}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="radio"
                            name={q._id}
                            value={opt}
                            checked={answers[q._id] === opt}
                            onChange={(e) =>
                              handleChange(q._id, e.target.value)
                            }
                            className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* True / False */}
                  {q.type === "true_false" && (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name={q._id}
                          value="true"
                          checked={answers[q._id] === true}
                          onChange={() => handleChange(q._id, true)}
                          className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <span>True</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name={q._id}
                          value="false"
                          checked={answers[q._id] === false}
                          onChange={() => handleChange(q._id, false)}
                          className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                        />
                        <span>False</span>
                      </label>
                    </div>
                  )}

                  {/* Text */}
                  {q.type === "text" && (
                    <div className="mt-2">
                      <textarea
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Type your answer here..."
                        value={answers[q._id] || ""}
                        onChange={(e) => handleChange(q._id, e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TakeQuizPage;
