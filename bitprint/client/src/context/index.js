import React from 'react';

const Context = React.createContext();

export const initialContext = {
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

export default Context;
