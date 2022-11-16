import { useCallback, useState } from "react";
import { useStorage, StorageKeys } from "./useStorage";

export function useLotteryGame() {
  const { get, set } = useStorage();
  const [game, setGame] = useState<number[]>([]);

  function getLotteryGameHistory(numberOfGames = 0) {
    const history = get<number[][]>(StorageKeys.GAMES);

    if (!history) return [];
    if (!!numberOfGames) return history.reverse().splice(0, numberOfGames);

    return history;
  }

  const generateGame = useCallback(
    (random: number[], maxNumber: number, amountOfNumbers: number) => {
      if (random?.length === amountOfNumbers) {
        setGame(random);

        const history = getLotteryGameHistory();

        if (!history?.length) {
          set(StorageKeys.GAMES, [random]);
          return;
        }

        set(StorageKeys.GAMES, [...history, random]);
        return;
      }

      const randomNumbers = [...new Array(amountOfNumbers)]
        .map(() => Math.ceil(Math.random() * maxNumber))
        .sort((a, b) => a - b);

      const uniqueNumbers = [...new Set(randomNumbers)];

      generateGame(uniqueNumbers, maxNumber, amountOfNumbers);
    },
    []
  );

  return { game, generateGame, getLotteryGameHistory };
}
