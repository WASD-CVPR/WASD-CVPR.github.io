(() => {
  'use strict';
  const video = document.getElementById('project-film-video');
  const play = document.getElementById('project-film-play');
  if (!video || !play) return;

  video.controls = false;
  play.hidden = false;

  play.addEventListener('click', async () => {
    video.controls = true;
    play.hidden = true;
    video.focus();
    try {
      await video.play();
    } catch {
      play.hidden = false;
    }
  });

  video.addEventListener('playing', () => {
    video.controls = true;
    play.hidden = true;
  });

  video.addEventListener('ended', () => {
    video.controls = false;
    play.hidden = false;
  });
})();
