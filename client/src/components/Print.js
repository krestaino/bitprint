import React, { Component } from 'react';
import classNames from 'classnames';

import Context from '../context/index.js';

import { ReactComponent as FrownOpenIcon } from '../assets/frown-open.svg';
import { ReactComponent as PrintIcon } from '../assets/print.svg';

import Logo from './Logo.js';

export default class Print extends Component {
  static contextType = Context;

  formatDate() {
    const date = new Date(this.context.file.lastModified);
    return date.toLocaleDateString() + ' – ' + date.toLocaleTimeString();
  }

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
    const { data, foldersToPrint } = this.context;

    if (foldersToPrint.length || data.folders.length) {
      return data.items.filter(item => foldersToPrint.includes(item.folderId)).length;
    } else {
      return data.items.length;
    }
  };

  toggleFolder = id => {
    const foldersToPrint = [...this.context.foldersToPrint];
    const index = foldersToPrint.indexOf(id);

    foldersToPrint.includes(id) ? foldersToPrint.splice(index, 1) : foldersToPrint.push(id);

    this.context.setContext({ foldersToPrint });
  };

  render() {
    const { dataToPrint, foldersToPrint, data, file } = this.context;
    const dataToPrintKeys = Object.keys(dataToPrint);

    return (
      <div>
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
                  className="focus:shadow-outline focus:border-transparent outline-none px-1 -ml-1 rounded min-w-full font-bold text-2xl text-gray-900 border-b border-blue-500 border-dashed hover:bg-gray-400 whitespace-no-wrap flex"
                  style={{ minWidth: '185px' }}
                  title="Edit title"
                >
                  Bitwarden Vault
                </h1>
                <span>
                  Logins <strong>({this.getPrintItemLength()})</strong>
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span>{this.formatDate(file.lastModified)}</span>
                <span>
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
              </div>
            </div>
            <div className="fixed bottom-0 right-0 w-full no-print pointer-events-none">
              <div className="container flex">
                <span className="ml-auto inline-flex p-4 md:p-8 slide-in-bottom">
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
              {foldersToPrint.length === 0 && data.folders.length !== 0 && (
                <li className="text-center py-40 text-sm text-gray-500">
                  <FrownOpenIcon className="h-4 mx-auto mb-2" />
                  <div>Nothing to see here.</div>
                </li>
              )}
              {data.items.map(
                ({ fields, folderId, login, name, notes, type }, index) =>
                  type === 1 && (
                    <li
                      className={classNames({
                        hidden:
                          (data.folders.length && !foldersToPrint.includes(folderId)) || false,
                        'bg-white border border-gray-400 rounded mt-4 break-words shadow-md': true
                      })}
                      key={index}
                    >
                      <div className="px-4 py-2 font-bold flex items-center">
                        {login.uris && (
                          <Logo
                            alt={name}
                            className={classNames({
                              hidden: !dataToPrint['logos'],
                              'inline-block mr-2 h-5 w-5 text-blue-500': true
                            })}
                            src={`https://icons.bitwarden.net/${this.getHostName(login)}/icon.png`}
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
      </div>
    );
  }
}
