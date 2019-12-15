import React, { Component } from 'react';

import Step1 from '../assets/step-1.png';
import Step2 from '../assets/step-2.png';
import Step3 from '../assets/step-3.png';

export default class Intro extends Component {
  render() {
    return (
      <div className="container my-8 mx-auto">
        <section className="mb-4 py-4">
          <h2 className="border-b border-gray-400 pb-1 mb-4 text-gray-600 font-bold text-sm uppercase">
            What is this?
          </h2>
          <p>
            <strong>Bitwarden Print</strong> aims to provide a convenient format to print your
            Bitwarden backups. Everything is handled in the browser, your data does not go anywhere.
            That said, I would not trust this if without reviewing the <a href="/">source</a>.
          </p>
          <p className="mt-4">
            <strong className="font-bold">
              It's highly recommended to{' '}
              <a className="font-bold" href="/">
                clone the repo
              </a>{' '}
              and run it yourself.
            </strong>
          </p>
        </section>
        <section className="mb-4 py-4">
          <h2 className="border-b border-gray-400 pb-1 mb-4 text-gray-600 font-bold text-sm uppercase">
            Can I see a demo?
          </h2>
          <p>
            <a href="?demo">{window.location.href}?demo</a>
          </p>
        </section>
        <section className="mb-4 py-4">
          <h2 className="border-b border-gray-400 pb-1 mb-4 text-gray-600 font-bold text-sm uppercase">
            How do I get my backup?
          </h2>
          <ol className="flex justify-center flex-wrap text-center -mt-8 flex-1 -mx-4">
            <li className="mt-6 flex-1">
              <div className="p-4">
                <img alt="" className="rounded shadow-lg mx-auto" src={Step1} />
                <h3 className="font-medium my-4">
                  Login to your <strong>Bitwarden Vault</strong>
                </h3>
              </div>
            </li>
            <li className="mt-6 flex-1">
              <div className="p-4">
                <img alt="" className="rounded shadow-lg mx-auto" src={Step2} />
                <h3 className="font-medium my-4">
                  Go to <strong>Tools</strong>
                </h3>
              </div>
            </li>
            <li className="mt-6 flex-1">
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
                    <em>(Only .json is supported right now)</em>
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
