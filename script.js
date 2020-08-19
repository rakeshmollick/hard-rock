const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const result = document.getElementById('result');
const more = document.getElementById('getMore');

const apiUrl = 'https://api.lyrics.ovh'

// Search Songs
function searchSongs(value){
  fetch(`${apiUrl}/suggest/${value}`)
  .then(res => res.json())
  .then(data => {
    showSongs(data);
  })
}

// Show Songs
function showSongs(data){
  let outPut = '';

  data.data.forEach((song) => {
    outPut += `
    <div class="single-result row align-items-center my-3 p-3">
      <div class="col-md-9">
        <h3 class="lyrics-name">${song.title}</h3>
        <p class="author lead">Album by <span>${song.artist.name}</span></p>
      </div>
      <div class="col-md-3 text-md-right text-center">
        <button class="btn btn-success" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </div>
    </div>
    `
  });

  result.innerHTML = outPut;

  
  if(data.prev || data.next){
    more.setAttribute('style', 'display: block');
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn btn-primary btn-sm" onclick="getMoreSongs('${data.prev}')">prev</button>` 
          : ''
      }
      ${
        data.next
          ? `<button class="btn btn-primary btn-sm" onclick="getMoreSongs('${data.next}')">Next</button>` 
          : ''
      }
    `;
  }
  else {
    more.innerHTML = '';
  }
  
}

// Get prev And Next Songs
function getMoreSongs(url){
  fetch(`https://cors-anywhere.herokuapp.com/${url}`)
  .then(res => res.json())
  .then(data => {
    showSongs(data);
  })
}

// Get Lyrics For Song
function getLyrics(artist, songtitle){
  fetch(`${apiUrl}/v1/${artist}/${songtitle}`)
  .then(res => res.json())
  .then(data => {
    const lyrics = data.lyrics;

    if(lyrics){
      result.innerHTML = `
      <h2 class="text-success mb-4">${songtitle}</h2>
      <pre class="lyric text-white">
        ${lyrics}
      </pre>
      `;
      more.innerHTML = '';
      more.setAttribute('style', 'display:none')
    }
    else {
      alert('Lyrics Not Available For This Song ..')
    }
    
  })
}


// Search Btn Click Event
searchBtn.addEventListener('click', () => {
  const searchValue = searchInput.value;

  if(!searchValue){
    alert('Please Type Something ..')
  }
  else {
    searchSongs(searchValue);
  }
  
});

// Get Lyrics Button Click
result.addEventListener('click', e => {
  const clickEl = e.target;

  if(clickEl.tagName === 'BUTTON'){
    const artist = clickEl.getAttribute('data-artist');
    const songTitle = clickEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});