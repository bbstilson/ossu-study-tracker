// @flow

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './CollapsibleContainer.css'

import type { Node } from 'react';

type CollapsibleContainerProps = {
  children: Node | Node[]
}
type CollapsibleContainerState = {
  collapsed: boolean
}

export default class CollapsibleContainer extends Component<CollapsibleContainerProps, CollapsibleContainerState> {
  state = {
    collapsed: true
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element.isRequired,
      PropTypes.arrayOf(PropTypes.element.isRequired).isRequired
    ]).isRequired
  }

  render() {
    const { collapsed } = this.state;
    const { children } = this.props;

    return (
      <div>
        {collapsed && (
          <button
            onClick={() => { this.setState({ collapsed: false }); }}
            className="collapsible-container__button"
          >
            Show
          </button>
        )}
        {!collapsed && (
          <button
            onClick={() => { this.setState({ collapsed: true }); }}
            className="collapsible-container__button"
          >
            Hide
          </button>
        )}
        {!collapsed && children}
      </div>
    );
  }
}
