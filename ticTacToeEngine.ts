type UserSymbol = "X" | "O" | "";
type CurrentPlayer = "user" | "comp";

interface ticTacToeClass {
  currentPlayer: CurrentPlayer;
  userSymbol: UserSymbol;
  board: UserSymbol[][];
  isWinner(
    lastMoveXCoord: number,
    lastMOveYCoord: number
  ): null | false | [UserSymbol, CurrentPlayer];
  setMove(MoveXCoord: number, MoveYCoord: number): boolean;
  verifyMoveValidity(MoveXCoord: number, MoveYCoord: number): boolean;
  isBoardFull(): boolean;
  switchCurrentPlayer(): void;
  makeRandomMove(): number[] | false;
}

export class ticTacToe implements ticTacToeClass {
  #currentPlayer: "user" | "comp" = "user";
  #userSymbol: UserSymbol = "X";
  #board: UserSymbol[][] = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  constructor(userSymbol?: UserSymbol, currentPlayer?: "user" | "comp") {
    if (userSymbol) {
      this.#userSymbol = userSymbol;
    }
    if (currentPlayer) {
      this.#currentPlayer = currentPlayer;
    }
  }
  get userSymbol(): UserSymbol {
    return this.#userSymbol;
  }
  get currentPlayer(): "user" | "comp" {
    return this.#currentPlayer;
  }
  get board(): UserSymbol[][] {
    return this.#board;
  }

  isWinner(
    lastMoveXCoord: number,
    lastMoveYCoord: number
  ): null | [UserSymbol, CurrentPlayer] | false {
    const symbol: UserSymbol = this.#board[lastMoveXCoord][lastMoveYCoord];
    if (!symbol) return null;

    if (this.#board[lastMoveXCoord].every((cell) => cell === symbol)) {
      return [symbol, this.#currentPlayer];
    }

    if (this.#board.every((row) => row[lastMoveYCoord] === symbol)) {
      return [symbol, this.#currentPlayer];
    }

    if (
      lastMoveXCoord === lastMoveYCoord &&
      this.#board.every((row, index) => row[index] === symbol)
    ) {
      return [symbol, this.#currentPlayer];
    }

    if (
      lastMoveXCoord + lastMoveYCoord === 2 &&
      this.#board.every((row, index) => row[2 - index] === symbol)
    ) {
      return [symbol, this.#currentPlayer];
    }

    return false;
  }

  setMove(moveXCoord: number, moveYCoord: number): boolean {
    if (this.verifyMoveValidity(moveXCoord, moveYCoord)) {
      const symbol =
        this.#currentPlayer === "user"
          ? this.#userSymbol
          : this.#userSymbol === "X"
          ? "O"
          : "X";
      this.#board[moveXCoord][moveYCoord] = symbol;
      return true;
    }
    return false;
  }

  verifyMoveValidity(moveXCoord: number, moveYCoord: number): boolean {
    return this.#board[moveXCoord][moveYCoord] === "";
  }

  isBoardFull(): boolean {
    return this.#board.every((row) => row.every((cell) => cell !== ""));
  }

  switchCurrentPlayer(): void {
    this.#currentPlayer = this.#currentPlayer === "user" ? "comp" : "user";
  }
  makeRandomMove(): number[] | false {
    const emptyPositions: [number, number][] = [];

    for (let i = 0; i < this.#board.length; i++) {
      for (let j = 0; j < this.#board[i].length; j++) {
        if (this.#board[i][j] === "") {
          emptyPositions.push([i, j]);
        }
      }
    }

    if (emptyPositions.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyPositions.length);
    const [x, y] = emptyPositions[randomIndex];
    this.setMove(x, y);
    return [x, y];
  }
}
