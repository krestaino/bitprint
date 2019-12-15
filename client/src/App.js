import React, { Component, Fragment } from 'react';
import classNames from 'classnames';

import { ReactComponent as UndoLogo } from './assets/undo.svg';
import Intro from './components/Intro.js';

const initialState = {
  data: {
    folders: [],
    items: []
  },
  dataToPrint: {
    logos: true,
    username: true,
    password: true,
    totp: true,
    notes: true,
    fields: true
  },
  error: null,
  file: {
    name: '',
    size: 0
  },
  foldersToPrint: [],
  loading: true
};

export default class App extends Component {
  state = { ...initialState };

  demoData = async () => {
    const response = await fetch('/example.json');
    const data = await response.json();
    const foldersToPrint = data.folders.map(({ id }) => id);
    const file = {
      name: 'example.json',
      lastModified: 1576401686010,
      size: 15941
    };

    this.setState({ data, file, foldersToPrint });
  };

  getHostName = login => {
    try {
      const hostname = new URL(login.uris[0].uri).hostname;
      let _hostname = hostname.split('.');
      return _hostname[_hostname.length - 2] + '.' + _hostname[_hostname.length - 1];
    } catch {
      return false;
    }
  };

  getPrintItemLength = () => {
    const { data, foldersToPrint } = this.state;

    if (foldersToPrint.length || data.folders.length) {
      return data.items.filter(item => foldersToPrint.includes(item.folderId)).length;
    } else {
      return data.items.length;
    }
  };

  formatDate() {
    const date = new Date(this.state.file.lastModified);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  readFile = event => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = event => {
      const data = JSON.parse(event.target.result);
      const foldersToPrint = data.folders.map(({ id }) => id);

      this.setState({ data, file, foldersToPrint });
    };
    reader.readAsText(file);
  };

  resetState = () => {
    document.querySelector('input[type=file]').value = null;
    this.setState({ ...initialState });
  };

  toggleDataOption = option => {
    const dataToPrint = { ...this.state.dataToPrint };
    dataToPrint[option] = !dataToPrint[option];
    this.setState({ dataToPrint });
  };

  toggleFolder = id => {
    const foldersToPrint = [...this.state.foldersToPrint];
    const index = foldersToPrint.indexOf(id);

    foldersToPrint.includes(id) ? foldersToPrint.splice(index, 1) : foldersToPrint.push(id);

    this.setState({ foldersToPrint });
  };

  componentDidMount() {
    if (window.location.pathname.includes('demo')) {
      this.demoData();
    }
  }

  render() {
    const { dataToPrint, foldersToPrint, data, file } = this.state;

    return (
      <main className="font-body">
        <div className="bg-gray-900 no-print text-white sticky top-0">
          <div className="container py-6 xl:py-8 xl:pt-6 relative">
            <div
              className={classNames({
                hidden: file.size !== 0,
                'flex justify-between': true
              })}
            >
              <h1 className="font-hairline text-3xl -mb-2 -m-1">Bitwarden Print</h1>
              <div className="flex flex-col">
                <div className="relative btn">
                  <span className="font-bold uppercase text-xs">Select Backup</span>
                  <input
                    className="opacity-0 absolute h-full w-full inset-0"
                    onChange={this.readFile}
                    type="file"
                  />
                </div>
              </div>
            </div>
            {data.items.length > 0 && (
              <div className="flex flex-col xl:flex-row -mt-2">
                {data.folders.length > 0 && (
                  <div className="xl:mt-auto">
                    <label className="label">Selected folders</label>
                    <ul className="flex mr-8">
                      {data.folders.map(({ id, name }) => (
                        <li className={foldersToPrint.includes(id) && 'active'} key={id}>
                          <input
                            checked={foldersToPrint.includes(id)}
                            className="hidden"
                            id={id}
                            onChange={() => this.toggleFolder(id)}
                            type="checkbox"
                          />
                          <label className="btn" htmlFor={id}>
                            {name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 xl:mt-auto">
                  <label className="label">Selected data</label>
                  <ul className="flex">
                    {Object.keys(dataToPrint).map(option => (
                      <li className={dataToPrint[option] && 'active'} key={option}>
                        <input
                          checked={dataToPrint[option]}
                          className="hidden"
                          id={option}
                          onChange={() => this.toggleDataOption(option)}
                          type="checkbox"
                        />
                        <label className="btn" htmlFor={option}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="xl:ml-auto mt-4 xl:mt-auto flex flex-col ">
                  {file.name && (
                    <Fragment>
                      {file.size > 0 && <label className="label">Selected backup</label>}
                      <div className="flex">
                        <span
                          className="font-bold uppercase text-xs btn"
                          style={{ cursor: 'not-allowed' }}
                        >
                          {`${file.name} (${(file.size / 1000).toFixed(1)} kB)`}
                        </span>
                        <button
                          className="btn warning"
                          onClick={this.resetState}
                          title="Select new file"
                        >
                          <UndoLogo className="h-4" />
                        </button>
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {file.size === 0 && <Intro />}
        <section className="container my-8 text-gray-700">
          {data.items.length > 0 && (
            <div>
              <div className="px-4">
                <div className="flex justify-between items-baseline">
                  <h1 className="font-bold text-2xl text-gray-900">Bitwarden Vault</h1>
                  <span>Logins – {this.getPrintItemLength()}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span>
                    <span>Data – </span>
                    <span className="comma-list">
                      <span>Names</span>
                      {Object.keys(dataToPrint).map(
                        option =>
                          dataToPrint[option] && (
                            <span className="inline-block capitalize" key={option}>
                              {option}
                            </span>
                          )
                      )}
                    </span>
                  </span>
                  <span>{this.formatDate(file.lastModified)}</span>
                </div>
              </div>
              <ul>
                {data.items.map(
                  ({ fields, folderId, login, name, notes, type }, index) =>
                    type === 1 && (
                      <li
                        className={classNames({
                          hidden:
                            (data.folders.length && !foldersToPrint.includes(folderId)) || false,
                          'bg-gray-200 border border-gray-400 rounded mt-4 break-words': true
                        })}
                        key={index}
                      >
                        <div className="px-4 py-2 font-bold flex items-center">
                          {login.uris && (
                            <img
                              alt={name}
                              className={classNames({
                                hidden: !dataToPrint['logos'],
                                'inline-block mr-2 h-5 w-5': true
                              })}
                              src={`https://icons.bitwarden.net/${this.getHostName(
                                login
                              )}/icon.png`}
                              style={{ textIndent: '-9999px' }}
                            />
                          )}
                          <span>{name}</span>
                        </div>
                        {login && (
                          <div>
                            {login.username && (
                              <div
                                className={classNames({
                                  hidden: !dataToPrint['username'],
                                  'px-4 py-2 border-t border-gray-400': true
                                })}
                              >
                                <span className="text-gray-500">U – </span>
                                <span className="font-mono">{login.username}</span>
                              </div>
                            )}
                            {login.password && (
                              <div
                                className={classNames({
                                  hidden: !dataToPrint['password'],
                                  'px-4 py-2 border-t border-gray-400': true
                                })}
                              >
                                <span className="text-gray-500">P – </span>
                                <span className="font-mono">{login.password}</span>
                              </div>
                            )}
                            {login.totp && (
                              <div
                                className={classNames({
                                  hidden: !dataToPrint['totp'],
                                  'px-4 py-2 border-t border-gray-400': true
                                })}
                              >
                                <span className="text-gray-500">T – </span>
                                <span className="font-mono">{login.totp}</span>
                              </div>
                            )}
                            {notes && (
                              <div
                                className={classNames({
                                  hidden: !dataToPrint['notes'],
                                  'px-4 py-2 border-t border-gray-400': true
                                })}
                              >
                                <span className="text-gray-500">N – </span>
                                <span className="font-mono">{notes}</span>
                              </div>
                            )}
                            {fields &&
                              fields.map((field, index) => (
                                <div
                                  className={classNames({
                                    hidden: !dataToPrint['fields'],
                                    'px-4 py-2 border-t border-gray-400': true
                                  })}
                                  key={index}
                                >
                                  <span className="text-gray-500">{field.name} – </span>
                                  <span className="font-mono">{field.value}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}
        </section>
      </main>
    );
  }
}
