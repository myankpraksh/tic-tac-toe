import readline from "readline";
import { ticTacToe } from "./ticTacToeEngine";
interface ScoreBoard {
  user: number;
  comp: number;
  draw: number;
}
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function getValidInput(
  prompt: string,
  validationFn: (input: string) => boolean
): Promise<string> {
  let input: string;
  do {
    input = await askQuestion(prompt);
    if (!validationFn(input)) {
      console.log("Invalid input. Please try again.");
    }
  } while (!validationFn(input));
  return input;
}

async function playRound(game: ticTacToe, scoreBoard: ScoreBoard) {
  let gameOver = false;

  while (!gameOver) {
    console.log("\nCurrent Board:");
    console.table(game.board);

    if (game.currentPlayer === "user") {
      const x = parseInt(
        await getValidInput("Enter X coordinate (0-2): ", (input) =>
          ["0", "1", "2"].includes(input)
        )
      );
      const y = parseInt(
        await getValidInput("Enter Y coordinate (0-2): ", (input) =>
          ["0", "1", "2"].includes(input)
        )
      );

      if (game.setMove(x, y)) {
        const winner = game.isWinner(x, y);
        if (winner) {
          console.log("\nCurrent Board:");
          console.table(game.board);
          const winMessage =
            winner[1] === "user"
              ? `Congratulations!!🎉 You (${winner[0]}) Win!`
              : `You Lost 🙁. Computer (${winner[0]}) Wins!`;
          console.log(winMessage);
          scoreBoard[winner[1]]++;
          console.log("Current Score");
          console.table(scoreBoard);
          gameOver = true;
        } else if (game.isBoardFull()) {
          console.log("It's a draw!");
          scoreBoard["draw"]++;
          console.log("Current Score");
          console.table(scoreBoard);
          gameOver = true;
        }
        game.switchCurrentPlayer();
      } else {
        console.log("Invalid move. Try again.");
        continue;
      }
    } else {
      console.log("Computer's turn...");
      const randomMoveMade = game.makeRandomMove();
      if (randomMoveMade) {
        const [x, y] = randomMoveMade;
        const winner = game.isWinner(x, y);
        if (winner) {
          console.log("\nCurrent Board:");
          console.table(game.board);
          const winMessage =
            winner[1] === "user"
              ? `Congratulations!!🎉 You (${winner[0]}) Win!`
              : `You Lost 🙁. Computer (${winner[0]}) Wins!`;
          console.log(winMessage);
          scoreBoard[winner[1]]++;
          console.log("Current Score");
          console.table(scoreBoard);
          gameOver = true;
        } else if (game.isBoardFull()) {
          console.log("It's a draw!");
          scoreBoard["draw"]++;
          console.log("Current Score");
          console.table(scoreBoard);
          gameOver = true;
        }
      } else {
        const tryAgain = await getValidInput(
          "Oops! Something went wrong. Do you want to try again? (yes/no): ",
          (input) =>
            input.toLowerCase() === "yes" || input.toLowerCase() === "no"
        );
        if (tryAgain) {
          continue;
        } else {
          gameOver = true;
        }
      }

      game.switchCurrentPlayer();
    }
  }
}

async function main() {
  console.log("Welcome to Tic Tac Toe!");
  let scoreBoard: ScoreBoard = {
    user: 0,
    comp: 0,
    draw: 0,
  };
  while (true) {
    const userSymbol = (await getValidInput(
      "Choose your symbol (X/O): ",
      (input) => input === "X" || input === "O"
    )) as "X" | "O";
    const firstPlayer = await getValidInput(
      "Do you want to start first? (yes/no): ",
      (input) => input.toLowerCase() === "yes" || input.toLowerCase() === "no"
    );

    const ticTacToeGame = new ticTacToe(
      userSymbol,
      firstPlayer.toLowerCase() === "yes" ? "user" : "comp"
    );
    await playRound(ticTacToeGame, scoreBoard);

    const playAgain = await getValidInput(
      "Do you want to play another round? (yes/no): ",
      (input) => input.toLowerCase() === "yes" || input.toLowerCase() === "no"
    );
    if (playAgain.toLowerCase() === "no") {
      break;
    }
  }

  rl.close();
}

main();
