import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

const TakeQuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [participantName, setParticipantName] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data } = await axios.get(`${API_BASE_URL}/quizzes/${id}`);
      setQuiz(data);
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
  };

  if (!quiz) return <div>Loading...</div>;

  if (result) {
    return (
      <div>
        <h2>Result for: {quiz.title}</h2>
        <p>
          Score: {result.score}/{result.totalQuestions} (
          {result.percentage.toFixed(2)}%)
        </p>
        <h3>Answers</h3>
        <ul>
          {result.detailed.map((item) => (
            <li key={item.questionId}>
              <strong>{item.questionText}</strong>
              <br />
              Your answer: {String(item.userAnswer)}
              <br />
              Correct answer: {String(item.correctAnswer)}
              <br />
              {item.isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Your Name (optional):{" "}
            <input
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
          </label>
        </div>

        {quiz.questions.map((q) => (
          <div key={q._id} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>{q.text}</strong>
            </p>

            {q.type === "mcq" &&
              q.options?.map((opt) => (
                <label key={opt} style={{ display: "block" }}>
                  <input
                    type="radio"
                    name={q._id}
                    value={opt}
                    checked={answers[q._id] === opt}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                  />
                  {opt}
                </label>
              ))}

            {q.type === "true_false" && (
              <>
                <label style={{ display: "block" }}>
                  <input
                    type="radio"
                    name={q._id}
                    value="true"
                    checked={answers[q._id] === true}
                    onChange={() => handleChange(q._id, true)}
                  />
                  True
                </label>
                <label style={{ display: "block" }}>
                  <input
                    type="radio"
                    name={q._id}
                    value="false"
                    checked={answers[q._id] === false}
                    onChange={() => handleChange(q._id, false)}
                  />
                  False
                </label>
              </>
            )}

            {q.type === "text" && (
              <textarea
                value={answers[q._id] || ""}
                onChange={(e) => handleChange(q._id, e.target.value)}
              />
            )}
          </div>
        ))}

        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default TakeQuizPage;
