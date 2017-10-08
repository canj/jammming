import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {
  constructor(props) {
    super(props);
  this.state = {
      searchResults: [
        name: 'Thundershock',
        artist: 'Pikachu',
        album: 'Life in the dark'
      ],
      playlistName: 'Matts Playlist',
      playlistTracks: [
        name: 'Thundershock',
        artist: 'Pikachu',
        album: 'Life in the dark'
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);


  }

  addTrack(track) {
    const inPlaylist = this.state.playlistTracks.some(playlistTrack => track.id === playlistTrack.id);
    if (!inPlaylist) {
      const state = this.state.playlistTracks;
      state.push(track);
      this.setState({playlistTracks: state });
    }
  }

  removeTrack(track) {
    const newState = this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    this.setState({ playlistTracks: newState});
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(playlistTrack => {
      return playlistTrack.uri;
    })

  }

  search(searchTerm) {
    console.log(`App.js search term ${searchTerm}`)
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
        <SearchResults searchResults={this.state.searchResults} />
        <Playlist
          playlistName={this.state.playlistName}
          playlistTracks={this.state.playlistTracks}
          onRemove={this.removeTrack}
          onNameChange={this.updatePlaylistName}
          onSave={this.savePlaylist}
          />
    </div>
  </div>
</div>
    );
  }
}

export default App;
