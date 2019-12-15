import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import csv from 'csvtojson';

import packageJson from '../package.json';
import { ReactComponent as FileImportIcon } from './assets/file-import.svg';
import { ReactComponent as PrintIcon } from './assets/print.svg';
import { ReactComponent as ArrowLogo } from './assets/arrow.svg';
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
    const response = await fetch('/demo.json');
    const data = await response.json();
    const foldersToPrint = data.folders.map(({ id }) => id);
    const file = {
      name: 'demo.json',
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
    return date.toLocaleDateString() + ' – ' + date.toLocaleTimeString();
  }

  readFile = event => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = event => {
      if (file.type === 'application/json') {
        const data = JSON.parse(event.target.result);
        const foldersToPrint = data.folders.map(({ id }) => id);

        this.setState({ data, file, foldersToPrint });
      }

      if (file.type === 'text/csv') {
        csv()
          .fromString(event.target.result)
          .then(csvRow => {
            const onlyUnique = (value, index, self) => {
              return self.indexOf(value) === index;
            };

            const foldersToPrint = csvRow
              .map(item => item.folder)
              .filter(onlyUnique)
              .filter(item => item !== '');
            const folders = foldersToPrint.map(item => ({ id: item, name: item }));

            const items = csvRow.map(item => ({
              fields: [
                {
                  name: '',
                  value: item.fields
                }
              ],
              folderId: item.folder,
              name: item.name,
              notes: item.notes,
              login: {
                username: item.login_username,
                password: item.login_password,
                totp: item.login_totp,
                uris: [
                  {
                    match: null,
                    uri: item.login_uri
                  }
                ]
              },
              type: 1
            }));

            const data = { folders, items };

            this.setState({ data, file, foldersToPrint });
          });
      }
    };
    reader.readAsText(file);
  };

  resetState = () => {
    document.querySelector('input[type=file]').value = null;
    window.history.pushState(null, null, '/');
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
    if (window.location.search.includes('demo')) {
      this.demoData();
    }
  }

  render() {
    const { dataToPrint, foldersToPrint, data, file } = this.state;
    const dataToPrintKeys = Object.keys(dataToPrint);

    return (
      <main className="font-body leading-relaxed h-screen flex flex-col">
        <div className="bg-gray-900 no-print text-white sticky top-0">
          <div className="container py-6 xl:py-8 xl:pt-6 relative">
            <div
              className={classNames({
                hidden: file.size !== 0,
                'flex justify-between items-center flex-col md:flex-row': true
              })}
            >
              <h1 className="font-hairline text-2xl md:text-3xl mb-4 md:-mb-2 -m-1 flex items-center">
                <PrintIcon className="h-6 mr-2" />
                <span>BitPrint</span>
              </h1>
              <div className="flex items-center font-bold uppercase">
                <span className="flex items-center mr-4 slide-in-left text-xs">
                  Click to start <ArrowLogo className="ml-2 h-5" />
                </span>
                <div className="relative btn -active">
                  <span className="flex items-center">
                    <FileImportIcon className="h-4 mr-2" />
                    <span className="text-xs">Import Vault</span>
                  </span>
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
                <div className="flex flex-col lg:flex-row flex-1">
                  {data.folders.length > 0 && (
                    <div className="xl:mt-auto">
                      <label className="label">Selected folders</label>
                      <ul className="flex flex-wrap -mx-2">
                        {data.folders.map(({ id, name }) => (
                          <li
                            className={classNames({
                              'mb-4 flex-1 px-2 lg:mb-0': true,
                              '-active': foldersToPrint.includes(id)
                            })}
                            key={id}
                          >
                            <input
                              checked={foldersToPrint.includes(id)}
                              className="hidden"
                              id={id}
                              onChange={() => this.toggleFolder(id)}
                              type="checkbox"
                            />
                            <label className="btn w-full" htmlFor={id}>
                              {name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 lg:mt-auto flex-1 lg:pl-8 xl:px-8">
                    <label className="label">Selected data</label>
                    <ul className="flex flex-wrap -mx-2">
                      {dataToPrintKeys.map(option => (
                        <li
                          className={classNames({
                            'mb-4 flex-1 px-2 lg:mb-0': true,
                            '-active': dataToPrint[option]
                          })}
                          key={option}
                        >
                          <input
                            checked={dataToPrint[option]}
                            className="hidden"
                            id={option}
                            onChange={() => this.toggleDataOption(option)}
                            type="checkbox"
                          />
                          <label className="btn w-full" htmlFor={option}>
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="xl:ml-auto mt-4 xl:mt-auto flex flex-col ">
                  {file.name && (
                    <Fragment>
                      {file.size > 0 && <label className="label">Selected export</label>}
                      <div className="flex">
                        <span
                          className="font-bold uppercase text-xs btn mr-4 w-full"
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

        {data.items.length > 0 && (
          <div className="container my-8 text-gray-700">
            <div className="px-4 print-fix">
              <div className="flex justify-between items-baseline">
                <h1
                  spellCheck="false"
                  suppressContentEditableWarning={true}
                  onKeyPress={event => {
                    (event.nativeEvent.keyCode === 13 || event.nativeEvent.which === 13) &&
                      event.target.blur();
                  }}
                  contentEditable="true"
                  className="focus:shadow-outline focus:border-transparent outline-none px-1 -ml-1 rounded min-w-full font-bold text-2xl text-gray-900 border-b border-blue-500 border-dashed hover:bg-gray-200 whitespace-no-wrap flex"
                  style={{ minWidth: '185px' }}
                  title="Edit title"
                >
                  Bitwarden Vault
                </h1>
                <span>Logins – {this.getPrintItemLength()}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span>
                  <span>Data – </span>
                  <span className="comma-list">
                    <span>Names</span>
                    {dataToPrintKeys.map(
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
            <div className="fixed bottom-0 right-0 w-full no-print pointer-events-none">
              <div className="container flex">
                <span className="ml-auto inline-flex p-8 pb-8 slide-in-bottom">
                  <button
                    className="btn -rounded -lg -active shadow-md flex items-center"
                    onClick={() => window.print()}
                    style={{ pointerEvents: 'all' }}
                  >
                    <PrintIcon className="h-4 mr-2" /> Print
                  </button>
                </span>
              </div>
            </div>
            <ul className="leading-snug">
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
                            src={`https://icons.bitwarden.net/${this.getHostName(login)}/icon.png`}
                            style={{ textIndent: '-9999px' }}
                          />
                        )}
                        <span>{name}</span>
                      </div>
                      {login && (
                        <div className="font-mono">
                          {login.username && (
                            <div
                              className={classNames({
                                hidden: !dataToPrint['username'],
                                'px-4 py-2 border-t border-gray-400': true
                              })}
                            >
                              <span className="text-gray-500">U – </span>
                              <span>{login.username}</span>
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
                              <span>{login.password}</span>
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
                              <span>{login.totp}</span>
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
                              <span>{notes}</span>
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
                                <span className="text-gray-500">
                                  {field.name && field.name + ' – '}
                                </span>
                                <span>{field.value}</span>
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
      </main>
    );
  }
}
