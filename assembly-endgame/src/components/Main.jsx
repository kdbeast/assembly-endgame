import { useState } from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getFarewellText, randomWord } from "./utils";
import Confetti from "react-confetti";

const Main = () => {
  const [currentWord, setCurrentWord] = useState(() => randomWord());

  const [guessedLetters, setGuessedLetters] = useState([]);

  const numGuessesLeft = languages.length - 1;
  const wrongGuessCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const isGameLost = wrongGuessCount >= numGuessesLeft;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const addGuessedLetter = (letter) => {
    setGuessedLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  };

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect,
  });
  const renderGameStatus = () => {
    if (!isGameOver && isLastGuessIncorrect)
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      );

    if (isGameWon) {
      return (
        <>
          <h2>You Won!</h2>
          <p>Well done!🎉</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2> You Lost</h2>
          <p> Better Luck Next Time😭</p>
        </>
      );
    }
  };

  const newGame = () => {
    setCurrentWord(randomWord());
    setGuessedLetters([]);
  };

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>

      <section className="language-chips">
        {languages.map((lang, index) => {
          const isLanguageLost = index < wrongGuessCount;
          const className = clsx("chip", isLanguageLost && "lost");
          return (
            <span
              className={className}
              key={lang.name}
              style={{
                backgroundColor: lang.backgroundColor,
                color: lang.color,
              }}
            >
              {lang.name}
            </span>
          );
        })}
      </section>

      <section className="word">
        {currentWord.split("").map((word, index) => {
          const shouldRevealLetter =
            isGameLost || guessedLetters.includes(word);
          const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(word) && "missed-letter"
          );
          return (
            <span className={letterClassName} key={index}>
              {shouldRevealLetter ? word.toUpperCase() : ""}
            </span>
          );
        })}
      </section>

      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter)
            ? `Correct! The letter ${lastGuessedLetter} is in the word.`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
          You have {numGuessesLeft} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessedLetters.includes(letter) ? letter + "." : "blank."
            )
            .join("")}
        </p>
      </section>

      <section className="keyboard">
        {alphabet.split("").map((letter) => {
          const isGuessed = guessedLetters.includes(letter);
          const isCorrect = isGuessed && currentWord.includes(letter);
          const isWrong = isGuessed && !currentWord.includes(letter);
          const className = clsx({
            correct: isCorrect,
            wrong: isWrong,
          });

          return (
            <button
              aria-disabled={guessedLetters.includes(letter)}
              aria-label={`Letter ${letter}`}
              disabled={isGameOver}
              className={className}
              onClick={() => addGuessedLetter(letter)}
              key={letter}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </section>

      {isGameOver && (
        <button onClick={newGame} className="new-game">
          New Game
        </button>
      )}
    </main>
  );
};

export default Main;
