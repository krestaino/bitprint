import React, { Component } from 'react';
import classNames from 'classnames';

export default class App extends Component {
  state = {
    data: {
      folders: [],
      items: []
    },
    dataToPrint: {
      username: true,
      password: true,
      totp: true,
      notes: true,
      fields: true
    },
    error: null,
    foldersToPrint: [],
    lastModified: null,
    loading: true
  };

  getPrintItemLength = () => {
    const { data, foldersToPrint } = this.state;

    return data.items.filter(item => foldersToPrint.includes(item.folderId)).length;
  };

  formatDate(lastModified) {
    const date = new Date(lastModified);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  readFile = event => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = event => {
      const data = JSON.parse(event.target.result);
      const foldersToPrint = data.folders.map(({ id }) => id);
      const lastModified = this.formatDate(file.lastModified);

      this.setState({ data, foldersToPrint, lastModified });
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

  render() {
    const { dataToPrint, foldersToPrint, data, lastModified } = this.state;

    return (
      <main>
        <div className="bg-gray-900 no-print">
          <div className="container mx-auto px-4 py-8 text-gray-100">
            <input onChange={this.readFile} type="file" />
            {data.folders.length > 0 && (
              <div>
                <h2>Data</h2>
                <ul className="flex">
                  {Object.keys(dataToPrint).map(option => (
                    <li key={option}>
                      <input
                        id={option}
                        type="checkbox"
                        checked={dataToPrint[option]}
                        onChange={() => this.toggleDataOption(option)}
                      />
                      <label for={option} className="capitalize">
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>

                <h2>Folders</h2>
                <ul className="flex">
                  {data.folders.map(({ id, name }) => (
                    <li key={id}>
                      <input
                        id={id}
                        type="checkbox"
                        checked={foldersToPrint.includes(id)}
                        onChange={() => this.toggleFolder(id)}
                      />
                      <label for={id}>{name}</label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <section className="container mx-auto px-4 my-8 text-gray-700">
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
                      {Object.keys(dataToPrint).map(
                        option =>
                          dataToPrint[option] && (
                            <span className="inline-block capitalize">{option}</span>
                          )
                      )}
                    </span>
                  </span>
                  <span>{lastModified}</span>
                </div>
              </div>
              <ul>
                {data.items.map(({ fields, folderId, login, name, notes }, index) => (
                  <li
                    className={classNames({
                      hidden: !foldersToPrint.includes(folderId),
                      'bg-gray-200 border border-gray-400 rounded mt-4 break-words': true
                    })}
                    key={index}
                  >
                    <div className="px-4 py-2 font-bold">{name}</div>
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
                            <div className="px-4 py-2 border-t border-gray-400" key={index}>
                              <span className="text-gray-500">{field.name} – </span>
                              <span>{field.value}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    );
  }
}
