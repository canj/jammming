const clientId = '428a7cd469dd433b8f1661282534045f';
const accessURIBase = 'https://accounts.spotify.com/authorize';
const spotifyURIBase = 'https://api.spotify.com/v1/';
const redirectURI = 'http://mcjammming.surge.sh';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      // Clears parameters
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessURI = `${accessURIBase}?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessURI;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`${spotifyURIBase}search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(response => { return response.json(); }
  ).then(jsonResponse => { // parsing of the retreived data into json objects.
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        length: track.duration_ms,
        image: track.album.images[2],
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

 savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
}
export default Spotify;
