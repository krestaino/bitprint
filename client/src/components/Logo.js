import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as ErrorIcon } from '../assets/exclamation-circle.svg';

export default class Logo extends Component {
  state = { error: false };

  render() {
    const { alt, src, ...props } = this.props;

    return this.state.error ? (
      <ErrorIcon {...props} />
    ) : (
      <img
        alt={alt}
        src={this.props.src}
        onError={() => this.setState({ error: true })}
        {...props}
      />
    );
  }
}

Logo.propTypes = { src: PropTypes.string };
