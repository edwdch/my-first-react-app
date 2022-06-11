import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  const highLight = props.highLight ? "high-hight" : "";
  let buttonClasses = `square ${highLight}`;

  return (
    <button className={buttonClasses} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  renderSquare(i) {
    return (
      <Square
        key={i}
        highLight={this.props.highLights[i]}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const boardRows = [];
    let start = 0;
    for (let i = 0; i < 3; i++) {
      let renderDivs = [];
      for (let j = 0; j < 3; j++) {
        renderDivs.push(this.renderSquare(start));
        start++;
      }
      boardRows.push(<div key={start}>{renderDivs}</div>);
    }

    return <div>{boardRows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumer: 0,
      isDesc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumer + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // slice 函数创建 squares 的副本
    const { winner, _ } = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    let x = Math.abs(Math.floor(i / 3 + 1));
    let y = i - (x - 1) * 3 + 1;
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares, position: [x, y] }]),
      xIsNext: !this.state.xIsNext,
      stepNumer: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumer: step,
      xIsNext: step % 2 === 0,
    });
  }

  reverseHistory() {
    const history = this.state.history.slice();
    const reverseHistory = history.reverse();
    this.setState({
      history: reverseHistory,
      isDesc: !this.state.isDesc,
      stepNumer: history.length - 1 - this.state.stepNumer,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumer];
    const { winner, line } = calculateWinner(current.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const highLights = Array(9).fill(false);
    if (line) {
      const [a, b, c] = line;
      highLights[a] = highLights[b] = highLights[c] = true;
    }

    const moves = history.map((step, move) => {
      const startPostion = this.state.isDesc
        ? 0
        : this.state.history.length - 1;
      const desc =
        move != startPostion
          ? `Go to move #${move}, position = (${step.position})`
          : "Go to game start";
      if (move === this.state.stepNumer) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>
              <b>{desc}</b>
            </button>
          </li>
        );
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            highLights={highLights}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            <button onClick={() => this.reverseHistory()}>Reverse</button>
          </div>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: lines[i],
      };
    }
  }
  return {};
}
