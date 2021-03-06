// @flow

import classnames from 'classnames';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './EndSessionModal.css';

type DifficultyProps = {
  num: number,
  onClick: (num: number) => void,
  selected: number | null
}

function Difficulty(props: DifficultyProps) {
  const { num, onClick, selected } = props;

  return (
    <span
      className={classnames('difficulty', { active: num === selected })}
      onClick={() => { onClick(num); }}
    >
      {num}
    </span>
  )
}

type EndSessionModalProps = {
  onConfirm: (selected: number) => void,
  onDeny: () => void,
  endTime: number
}
type EndSessionModalState = {
  selected: number | null
}

export default class EndSessionModal extends Component<EndSessionModalProps, EndSessionModalState> {
  state = {
    selected: null
  }

  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
    endTime: PropTypes.number.isRequired
  }

  handleSelection = (selected: number) => {
    this.setState({ selected });
  }

  handleConfirm = () => {
    const { selected } = this.state;

    if (selected) {
      this.props.onConfirm(selected);
    }
  }

  render() {
    const { endTime, onDeny } = this.props;
    const { selected } = this.state;

    return (
      <div className="modal__wrapper">
        <div className="modal_display">
          <h3>Finished Studying?</h3>
          <p>Ending at: {format(endTime, 'dddd, MM/DD/YY h:mm A')}</p>
          <div>
            <p>How difficult was this study session?</p>
            <div className="difficulty__wrapper">
              <Difficulty num={1} onClick={this.handleSelection} selected={selected} />
              <Difficulty num={2} onClick={this.handleSelection} selected={selected} />
              <Difficulty num={3} onClick={this.handleSelection} selected={selected} />
              <Difficulty num={4} onClick={this.handleSelection} selected={selected} />
              <Difficulty num={5} onClick={this.handleSelection} selected={selected} />
            </div>
          </div>
          <button onClick={this.handleConfirm}>Yep</button>
          <button onClick={onDeny}>Nope</button>
        </div>
      </div>
    );
  }
}
