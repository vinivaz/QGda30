export default function loadVideo(id, element) {
  if (id == '') return;

  window.YT.ready(function () {
    new window.YT.Player(element, {
      height: "390",
      width: "640",
      videoId: id,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  });

  function onPlayerReady(event) {
    //event.target.playVideo();
  }

  function onPlayerStateChange(event) {
    var videoStatuses = Object.entries(window.YT.PlayerState)
    console.log(videoStatuses.find(status => status[1] === event.data)[0])
  }
}