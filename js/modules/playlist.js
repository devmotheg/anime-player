/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import songs from "../data/songs.js";
import PlayInfo from "./play-info.js";
import TrackBar from "./track-bar.js";

const Playlist = (_ => {
  const playerPlaylistEl = document.querySelector(".player__playlist"),
    bodyEl = document.querySelector("body");
  const state = {
    currentlyPlayingId: null,
    currentSong: new Audio(),
    currentPlayPause: null,
  };

  const render = _ => {
    songs.forEach(s => {
      playerPlaylistEl.innerHTML += `
      <li class="song">
        <div class="song__play-pause">
          <i class="fa fa-play" data-id="${s.id}" tabindex="0" role="button"></i>
        </div>
        <div class="song__details">
          <h2 class="song__name">${s.title}</h2>
          <p class="song__artist">${s.artist}</p>
        </div>
        <p class="song__duration">${s.time}</p>
      </li>
      `;
    });
  };

  const getCurrentSong = _ => state.currentSong;

  const toggle = _ => {
    if (state.currentSong.paused) {
      state.currentPlayPause.classList.add("fa-play");
      state.currentPlayPause.classList.remove("fa-pause");
    } else {
      state.currentPlayPause.classList.remove("fa-play");
      state.currentPlayPause.classList.add("fa-pause");
    }
  };

  const playPauseSong = _ => {
    if (!state.currentSong.src) PlayInfo.controlError("display");
    else {
      PlayInfo.controlError("hide");
      state.currentSong.paused
        ? state.currentSong.play()
        : state.currentSong.pause();
      PlayInfo.setState({
        songsLength: songs.length,
        isPlaying: !state.currentSong.paused,
      });
      toggle();
    }
  };

  const changeSongAndPlay = (currentId, target) => {
    const songObj = songs[currentId];
    if (state.currentSong.src) {
      state.currentSong.pause();
      toggle();
      state.currentPlayPause.parentNode.parentNode.classList.remove(
        "song--active"
      );
    }
    state.currentlyPlayingId = currentId;
    state.currentSong.src = songObj.song;
    state.currentPlayPause = target;
    state.currentPlayPause.parentNode.parentNode.classList.add("song--active");
    bodyEl.style.backgroundImage = `url("${songObj.img}")`;
    playPauseSong();
  };

  const listeners = _ => {
    ["click", "keydown"].forEach(cE => {
      playerPlaylistEl.addEventListener(cE, e => {
        if (e.type === "keydown" && e.key !== "p" && e.key !== "P") return;
        if (e.target.matches(".fa")) {
          const currentId = e.target.getAttribute("data-id");
          if (state.currentlyPlayingId === currentId) playPauseSong();
          else changeSongAndPlay(currentId, e.target);
        }
      });
    });

    state.currentSong.addEventListener("timeupdate", _ =>
      TrackBar.setState(state.currentSong)
    );

    state.currentSong.addEventListener("ended", _ => {
      const nextId = String(
        (state.currentlyPlayingId - "0" + 1) % songs.length
      ),
        nextTarget = playerPlaylistEl.children[nextId].querySelector(".fa");
      changeSongAndPlay(nextId, nextTarget);
    });
  };

  const init = _ => {
    render();
    listeners();
    PlayInfo.setState({
      songsLength: songs.length,
      isPlaying: !state.currentSong.paused,
    });
  };

  return {
    init,
    playPauseSong,
    getCurrentSong,
  };
})();

export default Playlist;
