import { removeBlock } from "./post"

export default function setBlockEventListeners(id, blockType, post){
    if(blockType == 'yt-embed'){
      $('button#' + id + '-button').click(function (e) {
        var btnID = e.target.id
        var blockID = btnID.slice(0, btnID.length - 7)
    
        removeBlock(blockID, post)
      })
  
      $('input#' + id + '-input').change(function (e) {
        var inputID = this.id
        var blockID = inputID.slice(0, inputID.length - 6)
        
        var oldVideoDiv = $('div#' + blockID + '-yt-p')
  
        var i = post.blocks.findIndex(block => block.id == blockID)
  
        post.blocks[i].content = e.target.value;
        oldVideoDiv.empty()
        if (e.target.value !== '') {
          $('div#' + blockID + '-yt-p').append('<div class="block-content youtube"id="' + blockID + '-yt"></div>')
          loadVideo(post.blocks[i].content, (post.blocks[i].id + '-yt'))
        }
      })
      return;
    }
  
    if(blockType == 'tt-embed'){
      $('button#' + block.id + '-button').click(function (e) {
        var btnID = e.target.id
        var blockID = btnID.slice(0, btnID.length - 7)
    
        removeBlock(blockID, post)
      })
    
      $('input#' + block.id + '-input').change(function (e) {
    
        var inputID = this.id
        var blockID = inputID.slice(0, inputID.length - 6)
       
    
        for (var i = post.blocks.length; i--;) {
          if (post.blocks[i].id == blockID) {
            post.blocks[i].content = e.target.value;
            var oldTweetDiv = $('div#' + blockID + '-tt')
    
            if (oldTweetDiv) oldTweetDiv.remove();
            if (this.value == '') return;
            $('div#' + blockID).append('<div class="block-content tweet"id="' + post.blocks[i].id + '-tt"></div>')
            var tweetDiv = document.getElementById(news.blocks[i].id + '-tt')
            gerenateTweet(post.blocks[i].content, tweetDiv)
            break;
          }
        }
      })
      return
    }
    if(blockType == 'text'){
      $('button#' + block.id + '-button').click(function (e) {
        var btnID = e.target.id
        var blockID = btnID.slice(0, btnID.length - 7)
    
        removeBlock(blockID, post)
      })
    
      $('p.editable').bind('click', function () {
        $(this).attr('contentEditable', true);
        $(this).parent().addClass('editing')
        
      }).blur(function () {
        $(this).attr('contentEditable', false);
        var blockID = this.id.slice(0, this.id.length - 2)
        $(this).parent().removeClass('editing')
        for (var i = post.blocks.length; i--;) {
          if (post.blocks[i].id == blockID) {
            post.blocks[i].content = this.innerHTML
           
          }
        }
      });
      return;
    }
  
    if(blockType == 'img'){
      $('button#' + block.id + '-button').click(function (e) {
        var btnID = e.target.id
        var blockID = btnID.slice(0, btnID.length - 7)
    
        removeBlock(blockID, post)
      })
    
      $('input#' + block.id + '-input').change(function (e) {
    
        var inputID = this.id
        var blockID = inputID.slice(0, inputID.length - 6)
    
        var oldImg = $('div#' + blockID + '-img-p')
    
        for (var i = post.blocks.length; i--;) {
          if (post.blocks[i].id == blockID) {
            post.blocks[i].url = e.target.value;
            oldImg.empty()
            if (e.target.value == '') return;
    
            $('div#' + post.blocks[i].id + '-img-p').append('<img src="' + post.blocks[i].url + '" id="' + post.blocks[i].id + '-img">')
            return
          }
        }
      })
    }
  }