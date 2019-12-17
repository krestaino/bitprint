import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import csv from 'csvtojson';

import Context, { initialContext } from '../context/index.js';

import { ReactComponent as FileImportIcon } from '../assets/file-import.svg';
import { ReactComponent as PrintIcon } from '../assets/print.svg';
import { ReactComponent as ArrowLogo } from '../assets/arrow.svg';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';

export default class Header extends Component {
  static contextType = Context;

  toggleFolder = id => {
    const foldersToPrint = [...this.context.foldersToPrint];
    const index = foldersToPrint.indexOf(id);

    foldersToPrint.includes(id) ? foldersToPrint.splice(index, 1) : foldersToPrint.push(id);

    this.context.setContext({ foldersToPrint });
  };

  readFile = event => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = event => {
      if (file.type === 'application/json') {
        const data = JSON.parse(event.target.result);
        const foldersToPrint = data.folders.map(({ id }) => id);

        this.context.setContext({ data, file, foldersToPrint });
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

            this.context.setContext({ data, file, foldersToPrint });
          });
      }
    };
    reader.readAsText(file);
  };

  resetState = () => {
    document.querySelector('input[type=file]').value = null;
    window.history.pushState(null, null, '/');
    this.context.setContext({ ...initialContext });
  };

  toggleDataOption = option => {
    const dataToPrint = { ...this.context.dataToPrint };
    dataToPrint[option] = !dataToPrint[option];
    this.context.setContext({ dataToPrint });
  };

  render() {
    const { dataToPrint, foldersToPrint, data, file } = this.context;
    const dataToPrintKeys = Object.keys(dataToPrint);

    return (
      <div className="bg-gray-900 no-print text-white py-6 xl:h-24">
        <div className="container relative h-full flex items-center w-full">
          <div
            className={classNames({
              hidden: file.size !== 0,
              'flex justify-between items-center flex-col md:flex-row w-full': true
            })}
          >
            <h1 className="font-hairline text-2xl md:text-3xl mb-4 md:-mb-2 -m-1 flex items-center">
              <PrintIcon className="h-6 mr-2 text-blue-500" />
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
            <div className="flex flex-col xl:flex-row -mt-2 w-full">
              <div className="flex flex-col lg:flex-row flex-1">
                {data.folders.length > 0 && (
                  <div className="xl:mt-auto">
                    <label className="label">Folders</label>
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
                          <label
                            className="btn w-full"
                            htmlFor={id}
                            title={
                              (foldersToPrint.includes(id) ? 'Hide ' : 'Show ') +
                              name.charAt(0).toUpperCase() +
                              name.slice(1)
                            }
                          >
                            {name}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className={classNames({
                    'lg:mt-auto flex-1 lg:pl-8 xl:px-8': true,
                    'lg:-ml-8': data.folders.length === 0
                  })}
                >
                  <label className="label">Data</label>
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
                        <label
                          className="btn w-full"
                          htmlFor={option}
                          title={
                            (dataToPrint[option] ? 'Hide ' : 'Show ') +
                            option.charAt(0).toUpperCase() +
                            option.slice(1)
                          }
                        >
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="xl:ml-auto xl:mt-auto flex flex-col lg:mt-4">
                {file.name && (
                  <Fragment>
                    {file.size > 0 && <label className="label">Vault</label>}
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
                        title="Trash and start over"
                      >
                        <TrashIcon className="h-4" />
                      </button>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
