/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Playlist from "./playlist.js";

const PlayInfo = (_ => {
  const playerCountEl = document.querySelector(".player__count"),
    buttonEl = document.querySelector(".button"),
    errorParagraphEl = document.querySelector(".error-paragraph"),
    playerVolume = document.querySelector(".player__volume"),
    playerVolumeRange = document.querySelector(".player__volume-range"),
    bodyEl = document.querySelector("body");
  const state = {
    songsLength: 0,
    isPlaying: false,
  };

  const getPercentage = (current, full) => {
    return (current / full) * 100;
  };

  const render = _ => {
    playerCountEl.textContent = state.songsLength;
    buttonEl.textContent = state.isPlaying ? "pause" : "play";
  };

  const setState = obj => {
    state.songsLength = obj.songsLength;
    state.isPlaying = obj.isPlaying;
    render();
  };

  const drag = clientX => {
    const current = clientX - playerVolume.offsetLeft,
      full = playerVolume.offsetWidth;
    let percentage = Math.min(getPercentage(current, full), 100);
    percentage = percentage < 0 ? 0 : percentage;
    playerVolumeRange.style.transition = "0s";
    playerVolumeRange.style.width = `${percentage}%`;
    playerVolumeRange.classList.add("--grabbing");
    bodyEl.classList.add("--grabbing");
    Playlist.getCurrentSong().volume = percentage / 100;
  };

  const listeners = _ => {
    const down = ["mousedown", "touchstart"],
      move = ["mousemove", "touchmove"],
      up = ["mouseup", "touchend"];
    let mouseDown = false;

    ["click", "keydown"].forEach(cE => {
      buttonEl.addEventListener(cE, e => {
        if (cE === "keydown" && e.key !== "p" && e.key !== "P") return;
        Playlist.playPauseSong();
      });
    });

    down.forEach(cE =>
      playerVolume.addEventListener(cE, e => {
        mouseDown = true;
        drag(cE === "mousedown" ? e.clientX : e.touches[0].clientX);
      })
    );

    move.forEach(cE =>
      window.addEventListener(cE, function (e) {
        if (mouseDown)
          drag(cE === "mousemove" ? e.clientX : e.touches[0].clientX);
      })
    );

    up.forEach(cE =>
      window.addEventListener(cE, e => {
        mouseDown = false;
        playerVolumeRange.classList.remove("--grabbing");
        bodyEl.classList.remove("--grabbing");
      })
    );
  };

  const init = _ => {
    render();
    listeners();
  };

  const controlError = action => {
    if (action === "display") {
      playerVolumeRange.classList.add("--red");
      buttonEl.classList.add("--red");
      errorParagraphEl.classList.add("error-paragraph--display");
    } else {
      playerVolumeRange.classList.remove("--red");
      buttonEl.classList.remove("--red");
      errorParagraphEl.classList.remove("error-paragraph--display");
    }
  };

  return {
    init,
    setState,
    controlError,
  };
})();

export default PlayInfo;
