import React, { Component } from 'react';

import Context from '../context/index.js';

import Step1 from '../assets/step-1.png';
import Step2 from '../assets/step-2.png';
import Step3 from '../assets/step-3.png';

export default class Intro extends Component {
  static contextType = Context;

  render() {
    const host = window.location.host;

    if (this.context.file.size !== 0) {
      return false;
    }

    return (
      <div className="container my-4 md:my-8 mx-auto">
        <section className="mb-4 py-4">
          <h2 className="border-b border-gray-400 pb-1 mb-4 text-gray-600 font-bold text-sm uppercase">
            What is this?
          </h2>
          <p className="mb-4">
            <strong>BitPrint</strong> turns an{' '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://help.bitwarden.com/article/export-your-data/"
            >
              exported Bitwarden vault
            </a>{' '}
            into a layout designed to be printed. Processing is handled client side.
          </p>
          <p className="mb-4">
            I would not recommend using this for personal use. I made this for myself, more as of a
            proof of concept rather than something meant to be shared. Always be cautious when
            dealing with your exported vault.
          </p>
          <p className="mt-4">
            <strong className="font-bold">
              TL;DR: Do not import your personal vault on this site. Use the{' '}
              <a className="font-bold" href="/?demo">
                demo
              </a>
              , your own fake data, or fork the repo and run it yourself.
            </strong>
          </p>
        </section>
        <section className="mb-4 py-4">
          <h2 className="border-b border-gray-400 pb-1 mb-4 text-gray-600 font-bold text-sm uppercase">
            Can I see a demo?
          </h2>
          <ul className="list-disc ml-4">
            <li>
              <a className="inline-block" href={'//' + host + '/?demo'}>
                {host}/?demo
              </a>
              <span> (start here)</span>
            </li>
            <li>
              <a className="inline-block" href={'//' + host + '/demo.json'}>
                {host + '/demo.json'}
              </a>
              <span> (vault export)</span>
            </li>
            <li>
              <a className="inline-block" href={'//' + host + '/demo.pdf'}>
                {host + '/demo.pdf'}
              </a>
              <span> (pdf to print)</span>
            </li>
          </ul>
        </section>
        <section className="mb-4 py-4">
          <h2 className="border-b border-gray-400 pb-1 mb-4 text-gray-600 font-bold text-sm uppercase">
            How do I get my vault export?
          </h2>
          <ul className="list-disc ml-4">
            <li>
              <a
                className="mb-4 inline-block"
                rel="noopener noreferrer"
                target="_blank"
                href="https://help.bitwarden.com/article/export-your-data/"
              >
                help.bitwarden.com/article/export-your-data/
              </a>
            </li>
          </ul>
          <ol className="flex flex-col md:flex-row justify-center flex-wrap text-center md:-mt-8 flex-1 -mx-4">
            <li className="md:mt-6 flex-1">
              <div className="p-4">
                <img alt="" className="rounded shadow-lg mx-auto" src={Step1} />
                <h3 className="font-medium my-4">
                  Login to your <strong>Bitwarden Vault</strong>
                </h3>
              </div>
            </li>
            <li className="md:mt-6 flex-1">
              <div className="p-4">
                <img alt="" className="rounded shadow-lg mx-auto" src={Step2} />
                <h3 className="font-medium my-4">
                  Go to <strong>Tools</strong>
                </h3>
              </div>
            </li>
            <li className="md:mt-6 flex-1">
              <div className="p-4">
                <img alt="" className="rounded shadow-lg mx-auto" src={Step3} />
                <div className="my-4">
                  <h4 className="font-medium mb-2">
                    Go to <strong>Export Vault</strong>
                  </h4>
                  <p>
                    Enter your password and click <strong>Export Vault</strong>.
                  </p>
                  <p className="mb-2">
                    <em>(JSON and CSV are supported)</em>
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </section>
      </div>
    );
  }
}
