import React, { Component } from 'react';
import axios from 'axios';

export default class App extends Component {
  state = {
    data: { message: null },
    error: null,
    loading: true
  };

  async fetch() {
    try {
      const { data } = await axios.get(process.env.REACT_APP_SERVER_HOST + '/api');
      this.setState({ data });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { data, error, loading } = this.state;

    return (
      <main className="bg-gray-900 text-white flex flex-col h-screen items-center justify-center">
        {loading ? 'Loading…' : data.message || error.toString()}
      </main>
    );
  }
}
