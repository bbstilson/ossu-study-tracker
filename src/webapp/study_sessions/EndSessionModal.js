import classnames from 'classnames';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import './EndSessionModal.css';

function Difficulty({ num, onClick, selected }) {
  return (
    <span
      className={classnames('difficulty', { active: num === selected })}
      onClick={() => { onClick(num); }}
    >
      {num}
    </span>
  )
}

export default class EndSessionModal extends PureComponent {
  state = {
    selected: null
  }

  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onDeny: PropTypes.func.isRequired,
    endTime: PropTypes.number.isRequired
  }

  handleSelection = (selected) => {
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
