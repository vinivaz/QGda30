import startSimulation from './renderPost'
import savePost from './savePost'
import loadVideo from './loadVideo'
import {addTxtLinkScreen, addImgLinkScreen} from './addLinkScreen'

export function eventListeners(news){
    $(document).on('click', function (e) {

        var element = $(e.target)
      
        if (element.className == 'simulate') {
            
         startSimulation(news)
        }
      
        // if (element.className == 'img-input' && element.parent().hasClass('block-ctrl')) {
        //   element.change(function (e) {
        //     var inputID = this.id
        //     var blockID = inputID.slice(0, inputID.length - 6)
        //     console.log(blockID)
        //     var oldVideoDiv = $('div#' + blockID + '-yt-p')
        //     element.unbind()
        //     for (var i = news.blocks.length; i--;) {
        //       if (news.blocks[i].id == blockID) {
        //         news.blocks[i].content = e.target.value;
        //         oldVideoDiv.empty()
        //         if (e.target.value == '') return;
      
        //         $('div#' + blockID + '-yt-p').append('<div class="block-content youtube"id="' + blockID + '-yt"></div>')
        //         loadVideo(news.blocks[i].content, (news.blocks[i].id + '-yt'))
        //         return
        //       }
        //     }
        //   })
        // }
      
        if (element.className == 'add-txt-link-btn') {
          addTxtLinkScreen(e, news)
        }
      
        if (element.className == 'add-img-link-btn') {
          addImgLinkScreen(e, news)
        }
      
        if (element.className == 'save') {
          savePost(news)
        }
      
        if (element.className == 'description') {
          $(element).bind('click', function () {
            $(this).attr('contentEditable', true);
          }).blur(function () {
            $(this).attr('contentEditable', false)
            
            var blockID = this.id.slice(0, this.id.length - 13)
            for (var i = news.blocks.length; i--;) {
              if (news.blocks[i].id == blockID) {
                if(this.innerHTML.trim() == 'picture description'){
                  news.blocks[i].description = ''
                  return;
                }
                news.blocks[i].description = this.innerHTML
                
                if(this.innerHTML == ''){
                  this.innerHTML = 'picture description'
                  
                }
              }
            }
      
            $(this).unbind()
          });
      
        }
      
        $('p.editable').bind('click', function () {
          $(this).attr('contentEditable', true);
        }).blur(function () {
          $(this).attr('contentEditable', false)
          var blockID = this.id.slice(0, this.id.length - 2)
          for (var i = news.blocks.length; i--;) {
            if (news.blocks[i].id == blockID) {
              news.blocks[i].content = this.innerHTML
              
            }
          }
        });
      })
}