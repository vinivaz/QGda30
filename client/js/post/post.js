var blocks = document.querySelectorAll('.block')

//console.log(blocks)

blocks.forEach(function(block){

    if(block.classList.contains('tt')){
       var tweetID = block.children[0].getAttribute('ttId')
       generateTweet(tweetID,block.children[0])
    }

    if(block.classList.contains('yt')){
        var blockContentDiv = block.children[0]
        var videoID = blockContentDiv.getAttribute('vdId')
        var videoDiv = blockContentDiv.children[0].id

        loadVideo(videoID, videoDiv)
    }
})

function generateTweet(tweetID, elementID) {
  console.log('n ta rodandoo tweet')
    if (tweetID == '') return;
  
    twttr.widgets
      .createTweet(tweetID, elementID, {
        conversation: 'none', // or all
        cards: 'visible', // or hidden
        linkColor: '#cc0000', // default is blue
        theme: 'dark', // or dark
      })
      .then(function (el) {
  
        //el.contentDocument.find('.footer').css( "display", "none" );
        //el.contentDocument.querySelector('.footer').style.display = 'none';
      });
}

function loadVideo(id, element) {
  console.log('n ta rodandoo videooo')
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