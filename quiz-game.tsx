import React, { useState, useEffect } from 'react';
import { Clock, Award, RotateCcw, Play, CheckCircle, XCircle, Star } from 'lucide-react';

// ✅ Type for Answer object
type Answer = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

const QuizGame = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [timerActive, setTimerActive] = useState(false);

  const quizData: Record<string, { question: string; options: string[]; correct: string; explanation: string; }[]> = {
    'Science': [
      {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: "Au",
        explanation: "Gold's chemical symbol Au comes from the Latin word 'aurum'."
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: "Mars",
        explanation: "Mars appears red due to iron oxide (rust) on its surface."
      },
      {
        question: "What is the speed of light in a vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "299,792,458 m/s", "186,000 miles/s"],
        correct: "299,792,458 m/s",
        explanation: "The speed of light in vacuum is exactly 299,792,458 meters per second."
      },
      {
        question: "Which gas makes up about 78% of Earth's atmosphere?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
        correct: "Nitrogen",
        explanation: "Nitrogen makes up about 78% of Earth's atmosphere, with oxygen at about 21%."
      },
      {
        question: "What is the smallest unit of matter?",
        options: ["Molecule", "Atom", "Proton", "Electron"],
        correct: "Atom",
        explanation: "Atoms are the smallest units of matter that retain the properties of an element."
      }
    ],
    'History': [
      {
        question: "In which year did World War II end?",
        options: ["1944", "1945", "1946", "1947"],
        correct: "1945",
        explanation: "World War II ended in 1945 with Japan's surrender in September."
      },
      {
        question: "Who was the first person to walk on the moon?",
        options: ["Buzz Aldrin", "Neil Armstrong", "John Glenn", "Alan Shepard"],
        correct: "Neil Armstrong",
        explanation: "Neil Armstrong was the first human to step onto the moon on July 20, 1969."
      },
      {
        question: "Which ancient wonder of the world was located in Alexandria?",
        options: ["Hanging Gardens", "Lighthouse", "Colossus", "Mausoleum"],
        correct: "Lighthouse",
        explanation: "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World."
      },
      {
        question: "The French Revolution began in which year?",
        options: ["1789", "1776", "1799", "1804"],
        correct: "1789",
        explanation: "The French Revolution began in 1789 with the storming of the Bastille."
      },
      {
        question: "Who painted the ceiling of the Sistine Chapel?",
        options: ["Leonardo da Vinci", "Raphael", "Michelangelo", "Donatello"],
        correct: "Michelangelo",
        explanation: "Michelangelo painted the famous ceiling of the Sistine Chapel between 1508-1512."
      }
    ],
    'Geography': [
      {
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: "Canberra",
        explanation: "Canberra is the capital city of Australia, not Sydney or Melbourne."
      },
      {
        question: "Which is the longest river in the world?",
        options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correct: "Nile",
        explanation: "The Nile River is approximately 6,650 km long, making it the world's longest river."
      },
      {
        question: "Mount Everest is located in which mountain range?",
        options: ["Andes", "Rockies", "Alps", "Himalayas"],
        correct: "Himalayas",
        explanation: "Mount Everest is part of the Himalayan mountain range on the Nepal-Tibet border."
      },
      {
        question: "Which country has the most time zones?",
        options: ["Russia", "USA", "China", "Canada"],
        correct: "Russia",
        explanation: "Russia spans 11 time zones, more than any other country in the world."
      },
      {
        question: "What is the smallest country in the world?",
        options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
        correct: "Vatican City",
        explanation: "Vatican City is the smallest sovereign nation with an area of just 0.17 square miles."
      }
    ]
  };

  const categories = Object.keys(quizData);
  const currentQuiz = selectedCategory ? quizData[selectedCategory] : [];

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0 && gameState === 'playing' && !showFeedback) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, gameState, showFeedback]);

  const startQuiz = (category: string) => {
    setSelectedCategory(category);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer('');
    setShowFeedback(false);
    setUserAnswers([]);
    setTimerActive(true);
  };

  const handleAnswerSelect = (answer: string) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleTimeUp = () => {
    if (!showFeedback) {
      submitAnswer('');
    }
  };

  const submitAnswer = (answer = selectedAnswer) => {
    setTimerActive(false);
    setShowFeedback(true);

    const correct = currentQuiz[currentQuestion].correct;
    const isCorrect = answer === correct;

    if (isCorrect) {
      setScore(score + 1);
    }

    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuiz[currentQuestion].question,
        userAnswer: answer,
        correctAnswer: correct,
        isCorrect,
        explanation: currentQuiz[currentQuestion].explanation
      }
    ]);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setGameState('finished');
      setTimerActive(false);
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setSelectedCategory('');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setSelectedAnswer('');
    setShowFeedback(false);
    setUserAnswers([]);
    setTimerActive(false);
  };

  const getScoreColor = () => {
    const percentage = (score / currentQuiz.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // ✅ The rest of your render logic (menu, playing, finished) remains the same...
  // I've kept your original UI intact.

  // Paste your menu, playing and finished JSX sections here (unchanged)
  // because they don't need type changes.

  // Only the state and submitAnswer function required fixes.
};

export default QuizGame;
