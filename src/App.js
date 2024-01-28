import React, { useState, useEffect } from "react";
import "./App.css";

function generateQuestions() {
  const tables = [4, 6, 7, 8, 9];
  const exclude = [0, 1, 2, 3, 5, 10];
  let questions = [];

  tables.forEach((table) => {
    for (let i = 1; i <= 10; i++) {
      if (!exclude.includes(i)) {
        questions.push({ factor1: table, factor2: i, answer: table * i });
      }
    }
  });

  return questions;
}

function App() {
  const [testLength, setTestLength] = useState(5); // Standardlängd på testet är 5 minuter
  const [remainingTime, setRemainingTime] = useState(testLength * 60);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [questions, setQuestions] = useState(generateQuestions());
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    if (testStarted) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          clearInterval(timer);
          return 0;
        });
      }, 1000);

      setCurrentQuestion(
        questions[Math.floor(Math.random() * questions.length)]
      );

      return () => clearInterval(timer);
    }
  }, [testStarted, questions]);

  const nextQuestion = () => {
    if (parseInt(userAnswer) === currentQuestion.answer) {
      setResult((prevResult) => prevResult + 1);
    }
    setUserAnswer("");
    setAnsweredQuestions((prevCount) => prevCount + 1);

    let newQuestions = questions.filter((q) => q !== currentQuestion);
    setCurrentQuestion(
      newQuestions[Math.floor(Math.random() * newQuestions.length)]
    );
    setQuestions(newQuestions);
  };

  const handleTimeSelection = (minutes) => {
    setTestLength(minutes);
    setRemainingTime(minutes * 60);
  };

  const startTest = () => {
    setTestStarted(true);
    setRemainingTime(testLength * 60);
    setResult(0);
    setAnsweredQuestions(0);
    setQuestions(generateQuestions());
    setUserAnswer("");
  };

  const resetTest = () => {
    setTestStarted(false);
    setRemainingTime(testLength * 60); // Återställ tid baserat på vald testlängd
    setResult(0);
    setAnsweredQuestions(0);
    setQuestions(generateQuestions()); // Generera frågorna på nytt
    setUserAnswer("");
  };

  const handleAnswerClick = (number) => {
    setUserAnswer(userAnswer + number.toString());
  };

  const buttonStyle = {
    backgroundColor: "#ff69b4",
    border: "none",
    borderRadius: "5px",
    color: "white",
    padding: "10px 20px",
    margin: "5px",
    cursor: "pointer",
    fontSize: "16px",
  };

  // Skapa sifferknappar
  const numberButtons = [];
  for (let i = 0; i <= 9; i++) {
    numberButtons.push(
      <button style={buttonStyle} key={i} onClick={() => handleAnswerClick(i)}>
        {i}
      </button>
    );
  }

  return (
    <div>
      <h1>Matteapp</h1>
      {!testStarted ? (
        <div>
          <h2>Välj testlängd</h2>
          {[5, 10, 15, 20].map((minutes) => (
            <button
              style={buttonStyle}
              key={minutes}
              onClick={() => handleTimeSelection(minutes)}
            >
              {minutes} minuter
            </button>
          ))}
          <button style={buttonStyle} onClick={startTest}>
            Starta testet
          </button>
        </div>
      ) : remainingTime <= 0 ? (
        <div>
          <p>
            Testet avslutat! Du svarade på {answeredQuestions} frågor och fick{" "}
            {result} rätt.
          </p>
          <button style={buttonStyle} onClick={resetTest}>
            Starta om
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
          <div>
            <p className="question">
              Vad är {currentQuestion.factor1} * {currentQuestion.factor2}?
            </p>
            <p>Svar: {userAnswer}</p>
            {numberButtons}
            <button style={buttonStyle} onClick={nextQuestion}>
              Nästa fråga
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
