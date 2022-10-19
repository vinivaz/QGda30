export default function gerenateTweet(tweetID, elementID) {
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