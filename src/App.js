import React, { useState, useEffect } from "react";
import "./App.css";

function generateQuestions(numQuestions) {
  const tables = [4, 6, 7, 8, 9];
  const exclude = [0, 1, 2, 3, 5, 10];
  let questions = [];

  while (questions.length < numQuestions) {
    const table = tables[Math.floor(Math.random() * tables.length)];
    let factor2 = Math.floor(Math.random() * 10) + 1;
    if (!exclude.includes(factor2)) {
      questions.push({ factor1: table, factor2, answer: table * factor2 });
    }
  }

  return questions;
}

function App() {
  const [testLength, setTestLength] = useState(5);
  const [remainingTime, setRemainingTime] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    // Kontrollera om testet är igång och antingen tiden är slut eller alla frågor har besvarats.
    if (
      testStarted &&
      (remainingTime === 0 || answeredQuestions === questions.length)
    ) {
      setTestStarted(false); // Stoppa testet.

      // Säkerställ att detta bara körs om testet faktiskt har startat och frågor har besvarats.
      if (answeredQuestions > 0) {
        alert(`Testet är över! Du fick ${result} av ${questions.length} rätt.`);
      }
    }
  }, [testStarted, remainingTime, answeredQuestions, questions.length, result]);

  const handleTimeSelection = (minutes) => {
    const questionsPerMinute = { 5: 30, 10: 60, 15: 90, 20: 120 };
    const numQuestions = questionsPerMinute[minutes];
    setTestLength(minutes);
    setRemainingTime(minutes * 60);
    setQuestions(generateQuestions(numQuestions));
    setCurrentQuestion({});
    setResult(0);
    setAnsweredQuestions(0);
    setUserAnswer("");
  };

  const startTest = () => {
    setTestStarted(true);
    if (!questions.length) {
      setQuestions(generateQuestions(testLength * 6));
    }
    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    if (questions.length > 0 && answeredQuestions < questions.length) {
      setCurrentQuestion(questions[answeredQuestions]);
    }
  };

  const nextQuestion = () => {
    if (parseInt(userAnswer, 10) === currentQuestion.answer) {
      setResult(result + 1);
    }
    setAnsweredQuestions(answeredQuestions + 1);
    setUserAnswer("");
    moveToNextQuestion();
  };

  const handleAnswerClick = (number) => {
    setUserAnswer(userAnswer + number.toString());
  };

  const resetTest = () => {
    setTestStarted(false);
    setRemainingTime(testLength * 60);
    setResult(0);
    setAnsweredQuestions(0);
    setUserAnswer("");
    setQuestions(generateQuestions(testLength * 6));
  };

  const buttonStyle = {
    backgroundColor: "#ff69b4",
    border: "none",
    borderRadius: "5px",
    color: "white",
    padding: "15px 30px",
    margin: "10px",
    cursor: "pointer",
    fontSize: "20px",
  };

  return (
    <div>
      <h1>Matteapp</h1>
      {!testStarted ? (
        <div>
          <h2>Välj testlängd</h2>
          {[5, 10, 15, 20].map((minutes) => (
            <button
              key={minutes}
              style={buttonStyle}
              onClick={() => handleTimeSelection(minutes)}
            >
              {minutes} minuter
            </button>
          ))}
          <button style={buttonStyle} onClick={startTest}>
            Starta testet
          </button>
        </div>
      ) : (
        <div>
          <p>
            Tid kvar: {Math.floor(remainingTime / 60)}:
            {String(remainingTime % 60).padStart(2, "0")}
          </p>
          <p>
            Fråga: {answeredQuestions + 1} av {questions.length}
          </p>
          <p>Rätt svar: {result}</p>
          <div className="question">
            {currentQuestion.factor1} * {currentQuestion.factor2}
          </div>
          <p>Svar: {userAnswer}</p>
          {[...Array(10).keys()].map((number) => (
            <button
              key={number}
              style={buttonStyle}
              onClick={() => handleAnswerClick(number)}
            >
              {number}
            </button>
          ))}
          <button style={buttonStyle} onClick={nextQuestion}>
            Nästa fråga
          </button>
          <button style={buttonStyle} onClick={resetTest}>
            Starta om
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
