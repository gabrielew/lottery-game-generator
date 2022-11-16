import { FormEvent, Fragment, useMemo, useRef } from "react";
import { useClipboard } from "./hooks/useClipboard";
import { useLotteryGame } from "./hooks/useLotteryGame";
import "./styles.css";

export default () => {
  const { game, generateGame, getLotteryGameHistory } = useLotteryGame();
  const { copy } = useClipboard();
  const maxNumberRef = useRef<HTMLInputElement>(null);
  const amountOfNumbersRef = useRef<HTMLInputElement>(null);

  const lastLotteryGames = useMemo(() => getLotteryGameHistory(5), [game]);

  function handleGenerateNumbers(e: FormEvent) {
    e.preventDefault();

    const maxNumber = +maxNumberRef.current?.value!;
    const amountOfNumbers = +amountOfNumbersRef.current?.value!;

    if (!maxNumber || !amountOfNumbers)
      return alert("Preencha todos os campos");
    if (maxNumber <= amountOfNumbers)
      return alert(
        "A quantidade de números deve ser menor que o maior número possível"
      );

    generateGame([], maxNumber, amountOfNumbers);
  }

  function toggleCopy(game: number[]) {
    const sanitizeGameToCopy = game.join(" ");

    copy(sanitizeGameToCopy);
  }

  return (
    <div className="container">
      <form onSubmit={handleGenerateNumbers}>
        <div className="wrapper">
          <label htmlFor="maxNumber" className="label">
            Maior número possível
          </label>
          <input
            id="maxNumber"
            type="number"
            required
            autoFocus
            min={1}
            max={999}
            ref={maxNumberRef}
            placeholder="Ex.: 100"
          />
        </div>
        <div className="wrapper">
          <label htmlFor="amountOfNumbers" className="label">
            Quantidade de números
          </label>
          <input
            id="amountOfNumbers"
            type="number"
            required
            min={1}
            max={999}
            ref={amountOfNumbersRef}
            placeholder="Ex.: 20"
          />
        </div>
        <button type="submit">Novo jogo</button>
      </form>

      {!!game.length && (
        <>
          <p className="lastGames">Último Jogo</p>
          <div className="numbersWrapper">
            {game.map((randomNumber) => (
              <span key={randomNumber}>{` ${randomNumber}`}</span>
            ))}
          </div>
        </>
      )}

      {!!lastLotteryGames.length && (
        <>
          <p className="lastGames">Últimos 5 jogos</p>
          <div className="lotteryGameHistoryWrapper">
            {lastLotteryGames.map((games, index) => (
              <Fragment key={index}>
                <div>
                  <span>{lastLotteryGames.length - index}</span>
                  <div className="numbersWrapper">
                    {games.map((game, index) => (
                      <span key={index}>{` ${game}`}</span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCopy(lastLotteryGames[index])}
                >
                  Copiar
                </button>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
