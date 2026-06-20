const player =
document.getElementById("audioPlayer");
 const progress = document.getElementById("progress");
const songElements =
document.querySelectorAll("#songList li");
const overlayProgress =
document.getElementById("overlayProgress");
const songInfo = {

"Daylight - David Kushner.mp3": {
    artist: "David Kushner",
    genre: "Pop",
    year: "2023",
    album: "The Beginning"
},

"Perfect - Ed Sheeran.mp3": {
    artist: "Ed Sheeran",
    genre: "Pop",
    year: "2017",
    album: "÷ (Divide)"
},

"If The World Was Ending - JP Saxe.mp3": {
    artist: "JP Saxe",
    genre: "Pop",
    year: "2019",
    album: "Hold It Together"
},

"Die With A Smile - Lady Gaga & Bruno Mars.mp3": {
    artist: "Lady Gaga & Bruno Mars",
    genre: "Pop",
    year: "2024",
    album: "Single"
},

"Night Changes - One Direction.mp3": {
    artist: "One Direction",
    genre: "Pop",
    year: "2014",
    album: "Four"
},

"Lover - Taylor Swift.mp3": {
    artist: "Taylor Swift",
    genre: "Pop",
    year: "2019",
    album: "Lover"
},

"The Fate of Ophelia - Taylor Swift.mp3": {
    artist: "Roe Kapara",
    genre: "Alternative",
    year: "2024",
    album: "Single"
},

"Closer - The Chainsmokers.mp3": {
    artist: "The Chainsmokers",
    genre: "EDM / Pop",
    year: "2016",
    album: "Collage"
},

"Blue - Yung Kai.mp3": {
    artist: "Yung Kai",
    genre: "Indie Pop",
    year: "2024",
    album: "Single"
}

};
let songs = [];

songElements.forEach(song => {
    let button = 
    song.querySelector(".favBtn");

    if(button){
        songs.push(
            button.dataset.song
        );
    }

});

let currentIndex = 0;

let repeat = false;
let recentSongs = [];

function updateRecent(song){

recentSongs =
recentSongs.filter(
s => s !== song
);

recentSongs.unshift(song);

if(recentSongs.length > 5){

recentSongs.pop();

}

renderRecent();

}

function renderRecent(){

let list =
document.getElementById(
"recentList"
);

list.innerHTML = "";

recentSongs.forEach(song => {

let li =
document.createElement("li");

li.innerText =
song.replace(".mp3","");

li.onclick =
() => playSong(song);

list.appendChild(li);

});

}

function updateQueue(){
    
    let queueList =
    document.getElementById("queueList");

    if(!queueList) return;

    queueList.innerHTML = "";

    for(
        let i = currentIndex + 1;
        i < songs.length;
        i++
    ){

        let li =
        document.createElement("li");

        li.innerText =
        songs[i].replace(".mp3","");

        queueList.appendChild(li);
    }

}
function playSong(song){

    currentIndex =
    songs.indexOf(song);

    player.src =
    "/static/songs/" + song;

    player.play();
    document.getElementById(
    "miniSong"
    ).innerText =
    song.replace(".mp3","");
    document.getElementById(
        "nowPlaying"
    ).innerText =
    "Now Playing: " + song.replace(".mp3", "");
    let overlaySong =
    document.getElementById("overlaySong");

    if(overlaySong){
    overlaySong.innerText =
    song.replace(".mp3", "");
    }
    let cover =
    "/static/images/" +
    song.replace(".mp3",".jpg");
    document.getElementById(
    "bigCover"
    ).src = cover;
    document.getElementById(
    "playerOverlay"
    ).style.backgroundImage =
    `url('${cover}')`;
    document.getElementById(
    "bigCover"
    ).onerror = function(){

        this.src =
        "/static/images/default.jpg";
        console.log(currentIndex);
        console.log(songs);
};
updateRecent(song);
updateSongDetails(song);
updateQueue();
localStorage.setItem("lastSong", song);
}


function updateSongDetails(song){

    let title =
    song.replace(".mp3","");

    document.getElementById(
    "detailTitle"
    ).innerText = title;
    document.getElementById(
    "overlayTitle"
    ).innerText = title;
    let info = songInfo[song];

    if(info){

        document.getElementById(
        "detailArtist"
        ).innerText = info.artist;

        document.getElementById(
        "detailGenre"
        ).innerText = info.genre;

        document.getElementById(
        "detailYear"
        ).innerText = info.year;

        document.getElementById(
        "detailAlbum"
        ).innerText = info.album;

    }

}
function nextSong(){

    currentIndex++;

    if(currentIndex >= songs.length){
        currentIndex = 0;
    }

    playSong(
        songs[currentIndex]
    );
}

function previousSong(){

    currentIndex--;

    if(currentIndex < 0){
        currentIndex =
        songs.length - 1;
    }

    playSong(
        songs[currentIndex]
    );
}

function shuffleSongs(){

    currentIndex =
    Math.floor(
        Math.random() *
        songs.length
    );

    playSong(
        songs[currentIndex]
    );
}

function toggleRepeat(){

    repeat = !repeat;

    showToast(
    repeat ?
    "🔁 Repeat ON"
    :
    "🔁 Repeat OFF"
    );
}

player.addEventListener(
"ended",
function(){

    if(repeat){
        player.currentTime = 0;

        player.play();

    }else{

        nextSong();

    }

});

function togglePlay(){

    if(player.paused){

        player.play();

    }else{

        player.pause();

    }
}

document
.getElementById("search")
.addEventListener(
"keyup",
function(){

    let value =
    this.value.toLowerCase();

    let items =
    document.querySelectorAll(
        "#songList li"
    );

    items.forEach(item => {

        item.style.display =
        item.innerText
        .toLowerCase()
        .includes(value)
        ? "block"
        : "none";

    });

});

function toggleDarkMode(){

    document.body
    .classList
    .toggle("dark");
}
player.addEventListener(
"timeupdate",
function(){

let percent =
(player.currentTime /
player.duration) * 100;

progress.value =
percent || 0;

let current =
formatTime(
player.currentTime
);

let total =
formatTime(
player.duration
);

document.getElementById(
"timeDisplay"
).innerText =
current + " / " + total;

overlayProgress.value =
percent || 0;

document.getElementById(
"overlayTime"
).innerText =
current + " / " + total;
localStorage.setItem("lastTime", player.currentTime);
});
progress.addEventListener(
"input",
function(){

player.currentTime =
(progress.value / 100)
*
player.duration;

});

overlayProgress.addEventListener(
"input",
function(){

player.currentTime =
(this.value/100)
*
player.duration;

});
function formatTime(sec){

if(isNaN(sec))
return "0:00";

let min =
Math.floor(sec / 60);

let seconds =
Math.floor(sec % 60);

return min + ":" +
String(seconds)
.padStart(2,'0');

}
let favorites =
JSON.parse(
localStorage.getItem(
"favorites"
)
) || [];
let playlists =
JSON.parse(
localStorage.getItem(
"playlists"
)
) || {};
function toggleFavorite(
event,
song
){

event.stopPropagation();

if(
favorites.includes(song)
){

favorites =
favorites.filter(
s => s !== song
);

}
else{

favorites.push(song);

}

localStorage.setItem(
"favorites",
JSON.stringify(
favorites
)
);
updateFavoriteIcons();
showToast(
favorites.includes(song)
?
"❤️ Added to Favorites"
:
"💔 Removed from Favorites"
);

}
function loadFavorites(){

const list =
document.getElementById(
"favoriteList"
);

list.innerHTML = "";

favorites.forEach(song => {

let li =
document.createElement("li");

li.innerHTML = song.replace(".mp3", "");

li.onclick = () =>
playSong(song);

list.appendChild(li);

});

}

loadFavorites();

function updateFavoriteCount(){

document.getElementById(
"favoriteCounter"
).innerText =
"❤️ Favorites: " +
favorites.length;


}

function toggleFavorites(){

    let section =
    document.getElementById(
        "favoritesSection"
    );

    if(
        section.style.display
        === "none"
    ){

        loadFavorites();

        section.style.display =
        "block";

    }
    else{

        section.style.display =
        "none";

    }

}
const volume =
document.getElementById(
"volume"
);

volume.addEventListener(
"input",
function(){

player.volume =
this.value/100;

});
function updateFavoriteIcons(){

    document
    .querySelectorAll(".favBtn")
    .forEach(btn => {

        let song =
        btn.dataset.song;

        btn.innerText =
        favorites.includes(song)
        ? "❤️"
        : "🤍";

    });

}
updateFavoriteIcons();
updateFavoriteCount();

function openPlayer(){

let song =
localStorage.getItem("lastSong");

if(!song){
return;
}

let overlay =
document.getElementById("playerOverlay");

overlay.style.opacity = "0";
overlay.style.display = "block";

setTimeout(() => {

overlay.style.opacity = "1";

},10);

/* FORCE SYNC SCREEN 2 */
document.getElementById("overlaySong").innerText =
song.replace(".mp3","");

}
function closePlayer(){
let overlay =
document.getElementById(
"playerOverlay"
);
overlay.style.opacity = "0";

setTimeout(() => {
overlay.style.display = "none";

},300);
}
function createPlaylist(){

let name =
prompt(
"Enter Playlist Name"
);

if(!name) return;

if(playlists[name]){

showToast(
"Playlist already exists"
);

return;

}

playlists[name] = [];

localStorage.setItem(
"playlists",
JSON.stringify(
playlists
)
);

renderPlaylists();

showToast(
"Playlist Created"
);

}

function renderPlaylists(){

let list =
document.getElementById(
"playlistList"
);

if(!list) return;

list.innerHTML = "";

Object.keys(
playlists
).forEach(name => {

let li =
document.createElement("li");

li.innerHTML =
`
<span onclick="openPlaylist('${name}')">
📂 ${name}
</span>

<button
onclick="deletePlaylist(event,'${name}')">
🗑
</button>
`;

li.onclick =
() => openPlaylist(name);

list.appendChild(li);

});

}

function addToPlaylist(
event,
song
){

event.stopPropagation();

let names =
Object.keys(
playlists
);

if(names.length === 0){

showToast(
"Create a playlist first"
);

return;

}

let selected =
prompt(
"Enter Playlist Name:\n\n" +
names.join("\n")
);

if(!playlists[selected]){

showToast(
"Playlist not found"
);

return;

}

if(
playlists[selected]
.includes(song)
){

showToast(
"Song already exists in playlist"
);

return;

}

playlists[selected]
.push(song);

localStorage.setItem(
"playlists",
JSON.stringify(
playlists
)
);

showToast(
"Added to " +
selected
);

}

function openPlaylist(name){

document.getElementById(
"playlistBack"
).style.display =
"inline-block";

let items =
document.querySelectorAll(
"#songList li"
);

items.forEach(li => {

let song =
li.querySelector(
".favBtn"
).dataset.song;

li.style.display =
playlists[name]
.includes(song)
?
"block"
:
"none";

});

}
function showAllSongs(){

document.getElementById(
"playlistBack"
).style.display =
"none";

document
.querySelectorAll(
"#songList li"
)
.forEach(li => {

li.style.display =
"flex";

});

}

function deletePlaylist(
event,
name
){

event.stopPropagation();

if(
!confirm(
"Delete playlist: " +
name +
" ?"
)
){
return;
}

delete playlists[name];

localStorage.setItem(
"playlists",
JSON.stringify(
playlists
)
);

renderPlaylists();

showToast(
"Playlist Deleted"
);

}
player.addEventListener(
"play",
function(){

if(visualizer){
visualizer.style.display =
"flex";
}

});

player.addEventListener(
"pause",
function(){

if(visualizer){
visualizer.style.display =
"none";
}

});
window.addEventListener(
"load",
function(){

let lastSong =
localStorage.getItem(
"lastSong"
);

let lastTime =
localStorage.getItem(
"lastTime"
);

if(lastSong){

playSong(lastSong);

document.getElementById(
"nowPlaying"
).innerText =
"Continue Listening: " +
lastSong;

player.pause();


player.addEventListener(
"loadedmetadata",
function(){

if(lastTime){

player.currentTime =
parseFloat(lastTime);

}

},
{once:true}
);

}

});
function showToast(message){

let toast =
document.getElementById(
"toast"
);

toast.innerText =
message;

toast.classList.add(
"show"
);

setTimeout(() => {

toast.classList.remove(
"show"
);

},2000);

}
renderPlaylists();
function showAllSongs(){

document.getElementById(
"playlistBack"
).style.display =
"none";

document
.querySelectorAll(
"#songList li"
)
.forEach(li => {

li.style.display =
"flex";

});

}