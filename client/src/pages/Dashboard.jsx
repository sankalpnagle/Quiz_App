

import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE_URL = "http://localhost:8000/api";

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { text: "", type: "mcq", options: [""], correctAnswer: "" },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(
        `${API_BASE_URL}/admin/quizzes`,
        {
          title,
          description,
          isPublic: true,
          questions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Quiz created successfully");
      setTitle("");
      setDescription("");
      setQuestions([]);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to create quiz"
      );
    }
  };

  return  (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800">
              Create Quiz
            </h2>
            <p className="text-sm text-slate-500">
              Design and publish a quiz with multiple question types.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
            Admin Panel
          </span>
        </div>

        {/* Card */}
        <div className="bg-white shadow-md rounded-2xl p-6 md:p-8">
          {message && (
            <p
              className={`mb-4 text-sm font-medium ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. JavaScript Basics Quiz"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Short description about this quiz..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Questions header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                Questions
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                <span className="text-base leading-none">+</span>
                Add Question
              </button>
            </div>

            {questions.length === 0 && (
              <p className="text-sm text-slate-500">
                No questions added yet. Click <span className="font-medium">“Add Question”</span> to get started.
              </p>
            )}

            {/* Questions list */}
            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-700">
                      Question {qIndex + 1}
                    </h4>
                  </div>

                  {/* Question text + type (responsive) */}
                  <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-600">
                        Question Text
                      </label>
                      <input
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter the question..."
                        value={q.text}
                        onChange={(e) =>
                          updateQuestion(qIndex, "text", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-600">
                        Type
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={q.type}
                        onChange={(e) =>
                          updateQuestion(qIndex, "type", e.target.value)
                        }
                      >
                        <option value="mcq">MCQ</option>
                        <option value="true_false">True / False</option>
                        <option value="text">Text</option>
                      </select>
                    </div>
                  </div>

                  {/* MCQ options */}
                  {q.type === "mcq" && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs font-medium text-slate-600">
                        Options
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, optIndex) => (
                          <input
                            key={optIndex}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={opt}
                            onChange={(e) =>
                              updateOption(qIndex, optIndex, e.target.value)
                            }
                            placeholder={`Option ${optIndex + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addOption(qIndex)}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        + Add Option
                      </button>

                      <div className="mt-3 space-y-1">
                        <label className="block text-xs font-medium text-slate-600">
                          Correct Answer (must match one of the options)
                        </label>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={q.correctAnswer}
                          onChange={(e) =>
                            updateQuestion(
                              qIndex,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          placeholder="Paste exact option text here"
                        />
                      </div>
                    </div>
                  )}

                  {/* True/False */}
                  {q.type === "true_false" && (
                    <div className="mt-4 space-y-1">
                      <label className="block text-xs font-medium text-slate-600">
                        Correct Answer
                      </label>
                      <select
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={String(q.correctAnswer)}
                        onChange={(e) =>
                          updateQuestion(
                            qIndex,
                            "correctAnswer",
                            e.target.value === "true"
                          )
                        }
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  )}

                  {/* Text */}
                  {q.type === "text" && (
                    <div className="mt-4 space-y-1">
                      <label className="block text-xs font-medium text-slate-600">
                        Correct Answer (exact match, case-insensitive)
                      </label>
                      <input
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={q.correctAnswer}
                        onChange={(e) =>
                          updateQuestion(qIndex, "correctAnswer", e.target.value)
                        }
                        placeholder="Enter the expected answer"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Submit button */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
              >
                Save Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
