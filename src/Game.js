import React, { Component } from 'react';
import Dice from './Dice';
import Scoring from './Scoring';
import './Game.css';

const NUM_DICE = 5;
const NUM_ROLLS = 3;

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dice: Array.from({ length: NUM_DICE }),
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      currentScore: 0,
      gameOver: undefined,
      highScore: localStorage.getItem('highScore') || 0,
      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined
      }
    };
    this.roll = this.roll.bind(this);
    this.doScore = this.doScore.bind(this);
    this.toggleLocked = this.toggleLocked.bind(this);
    this.handleGameOver = this.handleGameOver.bind(this);
    this.reset = this.reset.bind(this);
    this.handleHighScore = this.handleHighScore.bind(this);
  }

  roll(evt) {
    // roll dice whose indexes are in reroll
    this.setState(st => ({
      // dice: [5, 5, 2, 2, 2],
      dice: st.dice.map(
        (d, i) => (st.locked[i] ? d : Math.ceil(Math.random() * 6))
      ),
      locked: st.rollsLeft > 1 ? st.locked : Array(NUM_DICE).fill(true),
      rollsLeft: st.rollsLeft - 1,
      gameOver: false
    }));
  }

  // not bound correctly
  toggleLocked(idx) {
    // toggle whether idx is in locked or not
    this.setState(st => ({
      locked: [
        ...st.locked.slice(0, idx),
        !st.locked[idx],
        ...st.locked.slice(idx + 1)
      ]
    }));
  }

  handleGameOver() {
    for (let score in this.state.scores) {
      if (this.state.scores[score] === undefined) {
        return false;
      }
    }
    //remove reroll button, show game over, and create restart button
    this.setState(
      {
        gameOver: true,
        dice: 'GAMEOVER'.split('')
      },
      this.handleHighScore
    );
  }

  handleHighScore() {
    if (
      localStorage.getItem('highScore') === undefined ||
      localStorage.getItem('highScore') < this.state.currentScore
    ) {
      localStorage.setItem('highScore', this.state.currentScore);
      this.setState({ highScore: this.state.currentScore });
    }
  }

  // Num_rolls resets to default value, unlocks all dice and fills in score for
  // TODO Add game end with total score and restart button
  doScore(rulename, ruleFn) {
    // evaluate this ruleFn with the dice and score this rulename
    if (
      this.state.scores[rulename] === undefined &&
      this.state.gameOver === false
    ) {
      this.setState(
        st => ({
          scores: { ...st.scores, [rulename]: ruleFn(this.state.dice) },
          currentScore: st.currentScore + ruleFn(this.state.dice),
          rollsLeft: NUM_ROLLS,
          locked: Array(NUM_DICE).fill(false)
        }),
        this.handleGameOver
      );
      this.roll();
    }
  }

  reset() {
    this.setState({
      dice: Array.from({ length: NUM_DICE }),
      locked: Array(NUM_DICE).fill(false),
      rollsLeft: NUM_ROLLS,
      currentScore: 0,
      gameOver: undefined,
      scores: {
        ones: undefined,
        twos: undefined,
        threes: undefined,
        fours: undefined,
        fives: undefined,
        sixes: undefined,
        threeOfKind: undefined,
        fourOfKind: undefined,
        fullHouse: undefined,
        smallStraight: undefined,
        largeStraight: undefined,
        yahtzee: undefined,
        chance: undefined
      }
    });
  }

  render() {
    let rerollButton = (
      <button
        className="Game-reroll"
        disabled={this.state.locked.every(x => x)}
        onClick={this.roll}
      >
        {this.state.rollsLeft === NUM_ROLLS
          ? 'Roll Dice'
          : `${this.state.rollsLeft} Rerolls Left`}
      </button>
    );

    let resetButton = (
      <button className="Game-reset" onClick={this.reset}>
        Restart
      </button>
    );

    return (
      <section>
        <Dice
          dice={this.state.dice}
          locked={this.state.locked}
          handleClick={this.toggleLocked}
        />
        {this.state.gameOver ? resetButton : rerollButton}
        <Scoring doScore={this.doScore} scores={this.state.scores} />
        <h1>Score: {this.state.currentScore}</h1>
        <h1>High Score: {this.state.highScore}</h1>
      </section>
    );
  }
}

export default Game;
