// server/src/controllers/quizController.js
import Quiz from "../models/QuizModel.js";
import QuizAttempt from "../models/QuizAttemptModel.js";

// ----------------- ADMIN CONTROLLERS -----------------

export const createQuiz = async (req, res) => {
  try {
    const { title, description, isPublic, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Title and at least one question are required" });
    }

    const quiz = await Quiz.create({
      title,
      description,
      isPublic: isPublic ?? true,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllQuizzesAdmin = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error("Get quizzes admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getQuizByIdAdmin = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    console.error("Get quiz admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { title, description, isPublic, questions } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    quiz.title = title ?? quiz.title;
    quiz.description = description ?? quiz.description;
    if (typeof isPublic === "boolean") quiz.isPublic = isPublic;
    if (Array.isArray(questions)) quiz.questions = questions;

    const updated = await quiz.save();
    res.json(updated);
  } catch (error) {
    console.error("Update quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    await quiz.deleteOne();
    res.json({ message: "Quiz deleted" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------- PUBLIC CONTROLLERS -----------------

// list public quizzes (for homepage)
export const getPublicQuizzes = async (_req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublic: true })
      .select("title description createdAt")
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error) {
    console.error("Get public quizzes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get quiz for taking (hide correctAnswer)
export const getQuizForTaking = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.isPublic) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Don't send correctAnswer to client
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        text: q.text,
        type: q.type,
        options: q.type === "mcq" ? q.options : undefined,
      })),
    };

    res.json(safeQuiz);
  } catch (error) {
    console.error("Get quiz public error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// submit answers and get result
export const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz || !quiz.isPublic) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const { answers, participantName } = req.body;
    // answers: [{ questionId, userAnswer }]

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const questionMap = new Map();
    quiz.questions.forEach((q) => {
      questionMap.set(q._id.toString(), q);
    });

    let score = 0;
    const detailedAnswers = [];

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      let isCorrect = false;
      let normalizedUser = ans.userAnswer;

      if (q.type === "true_false") {
        // accept booleans or "true"/"false"
        const correct = Boolean(q.correctAnswer);
        const userBool =
          typeof ans.userAnswer === "boolean"
            ? ans.userAnswer
            : String(ans.userAnswer).toLowerCase() === "true";

        isCorrect = userBool === correct;
        normalizedUser = userBool;
      } else if (q.type === "mcq") {
        isCorrect =
          String(ans.userAnswer).trim().toLowerCase() ===
          String(q.correctAnswer).trim().toLowerCase();
      } else if (q.type === "text") {
        isCorrect =
          String(ans.userAnswer).trim().toLowerCase() ===
          String(q.correctAnswer).trim().toLowerCase();
      }

      if (isCorrect) score++;

      detailedAnswers.push({
        questionId: q._id,
        questionText: q.text,
        correctAnswer: q.correctAnswer,
        userAnswer: normalizedUser,
        isCorrect,
      });
    }

    const totalQuestions = quiz.questions.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    // Save attempt
    await QuizAttempt.create({
      quiz: quiz._id,
      participantName: participantName || null,
      answers: detailedAnswers.map((a) => ({
        questionId: a.questionId,
        userAnswer: a.userAnswer,
        isCorrect: a.isCorrect,
      })),
      score,
      totalQuestions,
    });

    res.json({
      quizId: quiz._id,
      title: quiz.title,
      score,
      totalQuestions,
      percentage,
      detailed: detailedAnswers,
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
