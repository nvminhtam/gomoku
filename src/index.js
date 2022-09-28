import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  if (props.winner) {
    return <button className='win' onClick={props.onClick}>
      {props.value}
    </button>
  }
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={this.props.winners[i]}
      />
    );
  }
  makeBoard(nRow, nCol) {
    const options = [];
    for (let i = 0; i < nRow; i++) {
      const temp = [];
      for (let j = 0; j < nCol; j++) {
        temp.push(this.renderSquare(i * nRow + j));
      }
      options.push(<div>{temp}</div>)
    }
    return options;
  }
  render() {
    const temp = this.makeBoard(this.props.n, this.props.m);
    return (
      <div>
        {temp}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    var n = 5;
    var m = 5;
    this.state = {
      n: n,
      m: m,
      squares: Array(n * m).fill(null),
      history: [
        -1
      ],
      xIsNext: true,
      descendingSort: false,
      winner: Array(n * m).fill(null),
      numberOfMovesLeft: n * m,
      isWin: false,
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const squares = this.state.squares;
    if (this.state.isWin || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        i,
      ]),
      xIsNext: !this.state.xIsNext,
      descendingSort: this.state.descendingSort,
      numberOfMovesLeft: this.state.numberOfMovesLeft - 1,
    });
  }
  calculateWinner(squares) {
    let n = this.state.n;
    let m = this.state.m;
    let nMoveToWin = Math.min(n, m);
    var winner = null;
    var winnerMoves = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        var i2 = i;
        var j2 = j;
        var tmp = i * n + j;
        if (squares[tmp] == null) continue;
        var tmp2 = i2 * n + j2;
        var tmpMoves = [];
        while (i2 < n && j2 < m && squares[tmp] === squares[tmp2]) {
          i2++;
          j2++;
          tmpMoves.push(tmp2);
          tmp2 = i2 * n + j2;
        }
        if (i2 - i === nMoveToWin) {
          winnerMoves = tmpMoves;
          winner = squares[tmp];
          break;
        }
        i2 = i;
        j2 = j;
        tmp2 = i2 * n + j2;
        tmpMoves = [];
        while (i2 < n && j2 < m && squares[tmp2] === squares[tmp]) {
          i2++;
          tmpMoves.push(tmp2);
          tmp2 = i2 * n + j2;
        }
        if (i2 - i === nMoveToWin) {
          winnerMoves = tmpMoves;
          winner = squares[tmp];
          break;
        }
        i2 = i;
        j2 = j;
        tmp2 = i2 * n + j2;
        tmpMoves = [];
        while (i2 < n && j2 < m && squares[tmp2] === squares[tmp]) {
          j2++;
          tmpMoves.push(tmp2);
          tmp2 = i2 * n + j2;
        }
        if (j2 - j === nMoveToWin) {
          winnerMoves = tmpMoves;
          winner = squares[tmp];
          break;
        }
        i2 = i;
        j2 = j;
        tmp2 = i2 * n + j2;
        tmpMoves = [];
        while (i2 >= 0 && j2 >= 0 && squares[tmp2] === squares[tmp]) {
          i2--;
          j2--;
          tmpMoves.push(tmp2);
          tmp2 = i2 * n + j2;
        }
        if (i - i2 === nMoveToWin) {
          winnerMoves = tmpMoves;
          winner = squares[tmp];
          break;
        }
      }
      if (winner != null) break;
    }
    var winners = Array(n * m).fill(null);
    if (winner != null) {
      for (var i = 0; i < winnerMoves.length; i++) {
        winners[winnerMoves[i]] = 1;
      }
    }
    return {
      winner: winner,
      winnerMoves: winners
    };
  }

  jumpTo(move) {
    var n = this.state.n;
    var m = this.state.m;
    if (move !== this.state.history.length - 1) {
      this.setState({
        isWin: false,
      })
    }
    const squares = Array(n * m).fill(null);

    const history = this.state.history.slice(0, move + 1);
    for (let i = 1; i < history.length; i++) {
      squares[history[i]] = (i % 2 === 1 ? 'X' : 'O');
    }
    this.setState({
      winner: Array(n * m).fill(null),
      history: history,
      squares: squares,
      xIsNext: (move % 2 === 0),
      descendingSort: this.state.descendingSort,
      numberOfMovesLeft: n * m - move,
    });
  }

  changeSortOrder() {
    this.setState({
      descendingSort: !this.state.descendingSort,
    });
  }

  render() {
    const squares = this.state.squares;
    const history = this.state.history;
    var status;
    if (this.state.isWin) {
      status = "Game is over, the winner is " + (this.state.xIsNext ? 'O' : 'X');
    }
    else if (this.state.numberOfMovesLeft === 0) {
      status = "Game is drawn";
    }
    else {
      status = "Next move: " + (this.state.xIsNext ? 'X' : 'O');
    }

    let res = this.calculateWinner(squares);
    var winnerMoves = res.winnerMoves;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const position = step > -1 ?
        '(' + Math.floor(step / this.state.n) + ',' + step % this.state.m + ')' : '(,)';
      return (
        <li key={move}>
          <div>
            {position}
          </div>
          <button class="btn" onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if (this.state.descendingSort) {
      moves.reverse();
    }
    if (res.winner && !this.state.isWin) {
      this.setState({
        winners: res.winnerMoves,
        isWin: true
      });
    }

    let sortOrder;
    if (this.descendingSort) {
      sortOrder = "Ascending Sort";
    }
    else {
      sortOrder = "Descending Sort"
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares}
            onClick={(i) => this.handleClick(i)}
            winners={winnerMoves}
            n={this.state.n}
            m={this.state.m} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
          <button onClick={() => this.changeSortOrder()}>{sortOrder}</button>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
