import { useState } from "react";
import { languages } from "./languages";

const Main = () => {
  const [currentWord, setCurrentWord] = useState("react");

  return (
    <main>
      <section className="game-status">
        <h2>You win!</h2>
        <p>Well done!🎉</p>
      </section>
      <section className="language-chips">
        {languages.map((lang) => (
          <span
            className="chip"
            key={lang.name}
            style={{ backgroundColor: lang.backgroundColor, color: lang.color }}
          >
            {lang.name}
          </span>
        ))}
      </section>
      <section className="word">
        {currentWord.split("").map((word, index) => (
          <span key={index}>{word.toUpperCase()}</span>
        ))}
      </section>
    </main>
  );
};

export default Main;
