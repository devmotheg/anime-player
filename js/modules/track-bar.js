/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import PlayList from "./playlist.js";

const TrackBar = (_ => {
  const trackBarEl = document.querySelector(".track-bar"),
    trackBarFillEl = document.querySelector(".track-bar__fill");
  const state = {
    currentTrackTime: 0,
    fullTrackTime: 0,
    fillWidth: 0,
  };

  const getPercentage = (current, full) => (current / full) * 100;

  const render = _ => {
    trackBarFillEl.style.width = `${state.fillWidth}%`;
  };

  const setState = obj => {
    state.currentTrackTime = obj.currentTime;
    state.fullTrackTime = obj.duration;
    state.fillWidth = getPercentage(
      state.currentTrackTime,
      state.fullTrackTime
    );
    render();
  };

  const listeners = _ => {
    trackBarEl.addEventListener("click", function (e) {
      const current = e.clientX - this.offsetLeft,
        full = this.offsetWidth,
        percentage = getPercentage(current, full),
        currentSong = PlayList.getCurrentSong();
      currentSong.currentTime = Math.floor(
        currentSong.duration * (percentage / 100)
      );
    });
  };

  const init = _ => {
    render();
    listeners();
  };

  return {
    init,
    setState,
  };
})();

export default TrackBar;
