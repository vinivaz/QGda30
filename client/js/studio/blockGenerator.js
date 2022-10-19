import gerenateTweet from './loadTweet'
import loadVideo from './loadVideo'
import {removeBlock} from './post'
import {deleteImage} from './deleteImage'
import {popScreen} from '../global/dialogScreen'
import {renderEditor} from './postEditor'

function aspectRatioHandler( aspectRatioBtn, post ){
  console.log(aspectRatioBtn.target.id, post)

  var btnID = aspectRatioBtn.target.id
  var blockID = btnID.slice(0, btnID.length - 6)

  var {element, confirm, deny} = popScreen('O enquadramento da primeira imagem não é de 16:9, isso pode causar problemas no layout de outras páginas, deseja remover?')
  
  confirm.on('click', function(){
    for(var i = 0; i< post.blocks.length; i++){
      if(post.blocks[i].id == blockID){

        if((!post.blocks[i].file || post.blocks[i].file == undefined) && post.blocks[i].url != ''){
          post.imgBlocksToBeDeleted.push(post.blocks[i].url)
          
        }
        removeBlock(blockID, post)
        renderEditor(post)
        element.remove()
      }
    }

  })

  deny.on('click', function(){
    element.remove()
  })
}

function removeBlockConfirmation(blockID, post){

  var {element, confirm, deny} = popScreen('Deseja mesmo remover este bloco?')
  
  confirm.on('click', function(){
    removeBlock(blockID, post)
    element.remove()
  })

  deny.on('click', function(){
    element.remove()
  })

}

let blocksField = $('#post-content')

export function newVideoBlock(block, element, post) {
  let blocksField = $('#post-content')

  var newButton = '<button id="' + block.id + '-button">x</button>'
  var newInput = '<input type="text" class="youtube-input" id="' + block.id + '-input" value="' + block.content + '" placeholder="video ID">'
  var ctrlDiv = '<div class="block-ctrl">' + newInput + newButton + '</div>'

  var finalVideo = '<div class="block-content youtube" id="' + block.id + '-yt-p"><div id="' + block.id + '-yt"></div></div>'
  var ytDiv = '<div class="block yt" id="' + block.id + '">' + ctrlDiv + finalVideo + '</div>'

  var newBlockVessel = '<div id="' + block.id + '-vessel" class="block-vessel">' + ytDiv + '</div>'

  //blocksField.append(newBlockVessel)

  if (!element) {
    blocksField.append(newBlockVessel)
  } else {
    element.append(ytDiv)
  }

  //blocksField.append(ytDiv);

  loadVideo(block.content, (block.id + '-yt'))

  $('button#' + block.id + '-button').click(function (e) {
    var btnID = e.target.id
    var blockID = btnID.slice(0, btnID.length - 7)

    removeBlockConfirmation(blockID, post)
  })

  $('input#' + block.id + '-input').change(function (e) {
    var inputID = this.id
    var blockID = inputID.slice(0, inputID.length - 6)
    
    var oldVideoDiv = $('div#' + blockID + '-yt-p')

    for (var i = post.blocks.length; i--;) {
      if (post.blocks[i].id == blockID) {
        post.blocks[i].content = e.target.value;
        oldVideoDiv.empty()
        if (e.target.value == '') return;

        $('div#' + blockID + '-yt-p').append('<div class="block-content youtube"id="' + blockID + '-yt"></div>')
        loadVideo(post.blocks[i].content, (post.blocks[i].id + '-yt'))
        return
      }
    }
  })
}

export function newTweetBlock(block, element, post) {
  let blocksField = $('#post-content')

  var newButton = '<button id="' + block.id + '-button">x</button>'
  var newInput = '<input type="text" class="tweet-input" value="' + block.content + '" id="' + block.id + '-input" placeholder="tweet ID">'
  var ctrlDiv = '<div class="block-ctrl">' + newInput + newButton + '</div>'

  var finalTweet = '<div class="block-content tweet"id="' + block.id + '-tt"></div>'
  var ttDiv = '<div class="block tt" id="' + block.id + '">' + ctrlDiv + finalTweet + '</div>'

  var newBlockVessel = '<div id="' + block.id + '-vessel" class="block-vessel">' + ttDiv + '</div>'

  //blocksField.append(newBlockVessel)

  if (!element) {
    blocksField.append(newBlockVessel)
  } else {
    element.append(ttDiv)
  }

  //blocksField.append(ttDiv);
  var tweetDiv = document.getElementById(block.id + '-tt')

  gerenateTweet(block.content, tweetDiv)


  $('button#' + block.id + '-button').click(function (e) {
    var btnID = e.target.id
    var blockID = btnID.slice(0, btnID.length - 7)

    removeBlockConfirmation(blockID, post)
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
        var tweetDiv = document.getElementById(post.blocks[i].id + '-tt')
        gerenateTweet(post.blocks[i].content, tweetDiv)
        break;
      }
    }
  })
}

export function newTxtBlock(block, element, post) {
  let blocksField = $('#post-content')

  // var newButton = '<button id="' + block.id + '-button">x</button>'
  // var addLinkButton = '<button class="add-link-btn" id="' + block.id + '-add-link-btn">add link</button>'

  // var ctrlDiv = '<div class="block-ctrl">' + addLinkButton + newButton + '</div>'

  // var p = '<p class="final-text editable" id="' + block.id + '-p">' + block.content + '</p>'
  // var finalTxt = '<div class="block-content txt"id="' + block.id + '-txt">' + p + '</div>'
  // var div = '<div class="block txt" id="' + block.id + '">' + ctrlDiv + finalTxt + '</div>'
  // var newBlockVessel = '<div id="' + block.id + '-vessel" class="block-vessel">' + div + '</div>'

  var st = `
    <div id="${block.id}-vessel" class="block-vessel">
      <div class="block txt" id="${block.id}">
        <div class="block-ctrl">
          <button class="add-txt-link-btn" id="${block.id}-add-link-btn">add link</button>
          <button id="${block.id}-button">x</button>
        </div>
        <div class="block-content txt" id="${block.id}-txt">
          <div class="final-text editable notranslate" id="${block.id}-p">${block.content}</div>
        </div>
      </div>
    </div>
  `

  if (!element) {
    blocksField.append(st)
  } else {
    element.append(st)
  }


  $('button#' + block.id + '-button').click(function (e) {
    var btnID = e.target.id
    var blockID = btnID.slice(0, btnID.length - 7)

    removeBlockConfirmation(blockID, post)
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
}

export function newImgBlock(block, element, post) {

  let blocksField = $('#post-content')

  var imgBlock = `
  <div class="block-vessel" id="${block.id}-vessel">
    <div class="block img" id="${block.id}">
      <div class="block-ctrl">
        <button id="${block.id}-get-img-btn" class="get-img">Picture</button>
        <input type="file"  value="${block.url}" id="${block.id}-input" accept="image/jpeg, image/png, image/jpg, image/jpng, image/gif">
        <button class="add-img-link-btn" id="${block.id}-add-link-btn">add link</button>
        <button id="${block.id}-button">x</button>
      </div>
      <div class="block-content img" id="${block.id}-img-p">
        <img src="${block.url}" id="${block.id}-img">
      </div>
      <div class="img-details">
        ${block.description?`
        <div class="description notranslate" id="${block.id}-img-descript" contentEditable>
          ${block.description}
        </div>
        `
        :
        `<div class="description notranslate" id="${block.id}-img-descript" contentEditable>picture description</div>`
        }
        ${block.credits?`
        <div class="credits">
          <a href="${block.credits.link}" target="blank">${block.credits.content}</a>
        </div>
        `
        :
        ''
        }
      </div>
    </div>
  </div>
  `

  //blocksField.append(newBlockVessel)

  if (!element) {
    blocksField.append(imgBlock)
  } else {
    element.append(imgBlock)
  }

  for(var i = 0; i < post.blocks.length; i++){
    if(i == 0 && post.blocks[i].id == block.id){
      $(`img#${block.id}-img`).on('load', function(e){
        var btnID = e.target.id
        var blockId = btnID.slice(0, btnID.length - 4)

        var img = e.target;
        
        var imgAspectRatio = (img.naturalWidth/img.naturalHeight)
        var expectedAspectRation = (16/9)

        if(imgAspectRatio !== expectedAspectRation){
          $('button#' + blockId + '-button').remove()
          $('button.aspect-ratio-alert').remove()
          $(`div#${blockId}> div.block-ctrl`).append(`<button class="aspect-ratio-alert" id="${blockId}-a-r-a"><span>!</span></button>`)
          $('button.aspect-ratio-alert').on('click', function(e){
            aspectRatioHandler(e, post)
          })
        }
      })
    }
  }


  // for(var i = 0; i < post.blocks.length; i++){
  //   if(i == 0 && post.blocks[i].id == block.id){
  //     $(`img#${block.id}-img`).on('load', function(e){
  //       var img = e.target;
        
  //       console.log("natural width: ", img.naturalWidth)
  //       console.log("natural height: ", img.naturalHeight)
  //       console.log("division of them: ", (img.naturalWidth/img.naturalHeight))
  //       console.log("aspect ration: ", (16/9))
  //       console.log("should warning button appear?: ", !((16/9)===(img.naturalWidth/img.naturalHeight)))

  //       var imgAspectRatio = (img.naturalWidth/img.naturalHeight)
  //       var expectedAspectRation = (16/9)

  //       if(imgAspectRatio !== expectedAspectRation){
  //         $('button#' + block.id + '-button').remove()
  //         $('div.block-ctrl').append(`<button class="aspect-ratio-alert" id="${block.id}-a-r-a"><span>!</span></button>`)
  //         $('button.aspect-ratio-alert').on('click', function(e){
  //           aspectRatioHandler(e, post)
  //         })
  //       }
  //     })
  //   }
  // }



  //blocksField.append(imgDiv)
    // postContent.append('<img src="' + blocks[key].url + '">');

  $('button#' + block.id + '-button').click(function (e) {

    var btnID = e.target.id
      var blockID = btnID.slice(0, btnID.length - 7)

      for(var i = 0; i< post.blocks.length; i++){
        if(post.blocks[i].id == blockID){
          console.log(post.blocks[i])
          if((!post.blocks[i].file || post.blocks[i].file == undefined) && post.blocks[i].url != ''){

            post.imgBlocksToBeDeleted.push(post.blocks[i].url)
          }
          removeBlockConfirmation(blockID, post)
        }
      }
  })

  $('button#' + block.id + '-get-img-btn').click(function (e) {

    var btnID = e.target.id
    console.log(e.target.id)
    var blockID = btnID.slice(0, btnID.length - 12)
    console.log(blockID)
    $(`input#${blockID}-input`).click()
  })

  $('input#' + block.id + '-input').change(function (e) {

    var inputID = this.id
    var blockID = inputID.slice(0, inputID.length - 6)
    var oldImg = $('div#' + blockID + '-img-p')

    if(e.target.files && e.target.files.length > 0){
      const reader = new FileReader();
      reader.onload = ()=>{
        var newImgUrl = reader.result;

        for(var i = post.blocks.length; i--;) {

          if(post.blocks[i].id == blockID) {

            if((!post.blocks[i].file || post.blocks[i].file == undefined) && post.blocks[i].url != ''){

              post.imgBlocksToBeDeleted.push(post.blocks[i].url)

            }
            
            post.blocks[i].url = newImgUrl;

            post.blocks[i].file = e.target.files[0]

            oldImg.empty()

            $('div#' + post.blocks[i].id + '-img-p').append('<img src="' + newImgUrl + '" id="' + post.blocks[i].id + '-img">')

            if(i == 0){

              $('img#' + post.blocks[i].id + '-img').on('load', function(e){
                var img = e.target;

                var btnID = e.target.id
                var blockId = btnID.slice(0, btnID.length - 4)
        
                var imgAspectRatio = (img.naturalWidth/img.naturalHeight)
                var expectedAspectRation = (16/9)
        
                if(imgAspectRatio !== expectedAspectRation){

                  $('button#' + blockId + '-button').remove()

                  $('button.aspect-ratio-alert').remove()

                  $(`div#${blockId}> div.block-ctrl`).append(`<button class="aspect-ratio-alert" id="${blockId}-a-r-a"><span>!</span></button>`)

                  $('button.aspect-ratio-alert').on('click', function(event){

                    aspectRatioHandler(event, post)

                  })
                  $('img#' + blockId + '-img').off()
                }

              })

            }
            return
          }
        }

      }
      reader.readAsDataURL(e.target.files[0]);
    }

  })
}


export function oldImgBlock(block, element, post) {
  let blocksField = $('#post-content')

  var imgBlock = `
  <div class="block-vessel" id="${block.id}-vessel">
    <div class="block img" id="${block.id}">
      <div class="block-ctrl">
        <input type="text" class="img-input" value="${block.url}" id="${block.id}-input" placeholder="img URL">
        <button class="add-img-link-btn" id="${block.id}-add-link-btn">add link</button>
        <button id="${block.id}-button">x</button>
      </div>
      <div class="block-content img" id="${block.id}-img-p">
        <img src="${block.url}" id="${block.id}-img">
      </div>
      <div class="img-details">
        ${block.description?`
        <div class="description" id="${block.id}-img-descript" contentEditable>
          ${block.description}
        </div>
        `
        :
        `<div class="description" id="${block.id}-img-descript" contentEditable>picture description</div>`
        }
        ${block.credits?`
        <div class="credits">
          <a href="${block.credits.link}" target="blank">${block.credits.content}</a>
        </div>
        `
        :
        ''
        }
      </div>
    </div>
  </div>
  `

  //blocksField.append(newBlockVessel)

  if (!element) {
    blocksField.append(imgBlock)
  } else {
    element.append(imgBlock)
  }

  //blocksField.append(imgDiv)
    // postContent.append('<img src="' + blocks[key].url + '">');

  $('button#' + block.id + '-button').click(function (e) {
    var btnID = e.target.id
    var blockID = btnID.slice(0, btnID.length - 7)

    removeBlockConfirmation(blockID, post)
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