import React, { Component } from 'react';
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
          <div className="container pb-8 pt-6 relative">
            <div className="flex justify-between">
              <h1
                className={classNames({
                  hidden: file.size !== 0,
                  'font-hairline text-3xl -mb-2': true
                })}
              >
                Bitwarden Print
              </h1>
              <div className="absolute bottom-0 right-0 flex flex-col">
                {file.size > 0 && <label className="label">Selected backup</label>}
                <div className="mb-8 flex">
                  <div
                    className={classNames({
                      active: file.name
                    })}
                  >
                    <div className="relative btn-blue">
                      <button className="font-bold uppercase text-xs">
                        {(file.name && `${file.name} (${(file.size / 1000).toFixed(1)} kB)`) ||
                          'Select Backup'}
                      </button>
                      <input
                        className="opacity-0 absolute h-full w-full inset-0"
                        onChange={this.readFile}
                        type="file"
                      />
                    </div>
                  </div>
                  {file.name && (
                    <button className="btn-blue" onClick={() => this.setState({ ...initialState })}>
                      <UndoLogo className="h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {data.items.length > 0 && (
              <div className="flex">
                {data.folders.length > 0 && (
                  <div>
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
                          <label className="btn-blue" htmlFor={id}>
                            {name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
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
                        <label className="btn-blue" htmlFor={option}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
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
                          {login && login.uris && console.log(login.uris) && (
                            <img
                              alt={name}
                              className={classNames({
                                hidden: !dataToPrint['logos'],
                                'inline-block mr-2 h-5': true
                              })}
                              src={`https://icons.bitwarden.net/${
                                new URL(login.uris[0].uri).hostname
                              }/icon.png`}
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
