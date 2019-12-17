import React, { Component } from 'react';

import packageJson from '../../package.json';

export default class Footer extends Component {
  render() {
    return (
      <footer className="text-center m-12 text-gray-700 font-mono font-sm mt-auto pt-4 no-print">
        <span>v{packageJson.version}</span>
        <span> – </span>
        <a
          className="font-bold"
          href={packageJson.repository.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
      </footer>
    );
  }
}
