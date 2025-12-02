import React from 'react'


import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api";

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { data } = await axios.get(`${API_BASE_URL}/quizzes/public`);
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  return (
    <div>
      <h2>Available Quizzes</h2>
      {quizzes.length === 0 && <p>No quizzes available</p>}
      <ul>
        {quizzes.map((q) => (
          <li key={q._id}>
            <h3>{q.title}</h3>
            <p>{q.description}</p>
            <Link to={`/TakeQuizPage/${q._id}`}>Take Quiz</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
