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
  const [testLength, setTestLength] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0); // Behålls för att hantera kvarvarande tid

  const [currentQuestion, setCurrentQuestion] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [testStarted, setTestStarted] = useState(false);
  const [hasTestStartedAtLeastOnce, setHasTestStartedAtLeastOnce] =
    useState(false); // Ny tillståndsvariabel

  useEffect(() => {
    let timer;
    if (testStarted && remainingTime > 0) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (
      testStarted &&
      (remainingTime === 0 || answeredQuestions >= questions.length) &&
      hasTestStartedAtLeastOnce
    ) {
      setTestStarted(false);
      clearInterval(timer);
      alert(`Testet är över! Du fick ${result} av ${questions.length} rätt.`);
    }
    return () => clearInterval(timer);
  }, [
    testStarted,
    remainingTime,
    answeredQuestions,
    questions.length,
    result,
    testLength,
  ]);

  const moveToNextQuestion = () => {
    if (answeredQuestions < questions.length - 1) {
      setCurrentQuestion(questions[answeredQuestions]);
    } else {
      // Alla frågor har besvarats; visa resultatet och stoppa testet.
      setTestStarted(false);
      alert(
        `Grattis! Du har slutfört alla frågor och fick ${result} av ${questions.length} rätt.`
      );
    }
  };

  const nextQuestion = () => {
    if (parseInt(userAnswer, 10) === currentQuestion.answer) {
      setResult(result + 1);
    }
    setAnsweredQuestions(answeredQuestions + 1);
    setUserAnswer("");
    if (answeredQuestions < questions.length - 1) {
      moveToNextQuestion();
    } else {
      setTestStarted(false);
      alert(
        `Grattis! Du har slutfört alla frågor och fick ${result} av ${questions.length} rätt.`
      );
    }
  };

  const handleTimeSelection = (minutes) => {
    setTestLength(minutes);
    setRemainingTime(minutes * 60);
    setQuestions(generateQuestions(minutes * 6)); // Antag att du genererar frågor baserat på tid
    setCurrentQuestion({});
    setResult(0);
    setAnsweredQuestions(0);
    setUserAnswer("");
    // Ingen ytterligare ändring behövs här; `testLength`-tillståndet används redan för att spåra det valda alternativet
  };

  const startTest = () => {
    if (testLength) {
      // Kontrollera att testLength inte är null
      setTestStarted(true);
      setRemainingTime(testLength * 60);
      if (!questions.length) {
        setQuestions(generateQuestions(testLength * 6)); // Eller anpassa antalet frågor baserat på testLength
      }
      moveToNextQuestion();
      setHasTestStartedAtLeastOnce(true);
    }
  };

  const clearAnswer = () => {
    setUserAnswer("");
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

  const selectedButtonStyle = {
    ...buttonStyle, // Behåll den grundläggande knappstilen
    borderColor: "#4CAF50", // Grön ram
    backgroundColor: "#A5D6A7", // Ljusgrön bakgrund
    borderWidth: "2px",
    borderStyle: "solid",
  };

  const renderNumberButtons = () => {
    const layout = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]];
    return layout.map((row, index) => (
      <div key={index}>
        {row.map((number) => (
          <button
            key={number}
            style={buttonStyle}
            onClick={() => handleAnswerClick(number)}
          >
            {number}
          </button>
        ))}
      </div>
    ));
  };

  return (
    <div className="App">
      <div className="header">
        {testStarted && (
          <button style={buttonStyle} onClick={resetTest}>
            Starta om
          </button>
        )}
      </div>
      <h1>Matteapp</h1>
      {!testStarted ? (
        <div>
          <h2>Välj testlängd</h2>
          {[5, 10, 15, 20].map((minutes) => (
            <button
              key={minutes}
              style={
                minutes === testLength
                  ? { ...buttonStyle, ...selectedButtonStyle }
                  : buttonStyle
              }
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
          {renderNumberButtons()}
          <button style={buttonStyle} onClick={() => setUserAnswer("")}>
            Rensa
          </button>
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
