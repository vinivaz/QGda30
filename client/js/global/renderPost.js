import api from "../../tools/api"
import gerenateTweet from "./loadTweet"
import loadVideo from "./loadVideo"
import {popScreen} from "./dialogScreen.js"


var postElement = $('div.post-simulation')
var returnBtn = $('div.return > button')

returnBtn.on('click', () => {
  postElement.css('display', 'none')
})

var simulatedTitle = $('div.simulated-title > h1')
var simulatedData = $('div.simulated-data')
var simulatedBlocks = $('div.simulated-blocks')
var canClick = true;

var homePosts;

var currentPost;

export default function startSimulation(post, options, cb) {

  currentPost = post;

  insertButtons(options, cb)

  $('div.simulated-title > h1, div.simulated-data, div.simulated-blocks').empty()

  simulatedTitle.html(post.title)
  simulatedData.append(`
        <span>${getDate(post.createdAt)}</span>
        <span>De: ${post.author?.name}</span>
    `)

  post.blocks.map(block => {
    if (block.type == 'img') {
      simulateImgBlock(block)
      return
    }
    if (block.type == 'text') {
      simulateTxtBlock(block)
      return
    }
    if (block.type == 'tt-embed') {
      simulateTweetBlock(block)
      return
    }
    if (block.type == 'yt-embed') {
      simulateVideoBlock(block)
      return
    }
  })

  postElement.css('display', 'flex')


  console.log(post)

}

function getDate(date){
  var currentdate = new Date(date);
  return `${currentdate.getDate()}/${(currentdate.getMonth() + 1)}/${currentdate.getFullYear()}`
}

function simulateImgBlock(block) {
  simulatedBlocks.append(`
    <div class="simulated-block img">
      <img src="${block.url}">
			<div class="simulated-img-details">
				${block.description ?
      `<div class="simulated-description">
					<span>${block.description}</span>
				</div>`
      :
      ''
    }
				${block.credits ?
      `<div class="simulated-link">
					<a href="${block.credits.link}" target="_blank" rel="noopener noreferrer">${block.credits.content}</a>
				</div>`
      :
      ''
    }
			</div>
    </div>
    `)

}

function simulateTxtBlock(block) {
  simulatedBlocks.append(`
    <div class="simulated-block txt">
			<p>${block.content}</p>
		</div>
    `)
}

function simulateTweetBlock(block) {
  console.log(block)

  simulatedBlocks.append(`
	<div class="simulated-block tt">
		<div class="simulated-block-content" id="${block.id}-tt-simulation"></div>
	</div>
	`)

  var tweetDiv = document.getElementById(block.id + '-tt-simulation')

  gerenateTweet(block.content, tweetDiv)
}

function simulateVideoBlock(block) {
  simulatedBlocks.append(`
	<div class="simulated-block yt">
		<div class="simulated-block-content" id="${block.id}-yt-simulation"><div id="${block.id}-yt-video"></div></div>
	</div>
	`)

  loadVideo(block.content, (block.id + '-yt-video'))

}

function updateHomePosts(){

  api.get('/app/home')
  .then(res => {
    console.log(res.data);
    homePosts = res.data;
  })
  .catch(err => {
    console.log(err, 'deu ruim')
  })
}

function insertButtons(options, cb) {
  var simulationBtnArea = $('div.simulation-btn > div.options')
  simulationBtnArea.empty()

  if (options.publish) {
    simulationBtnArea.append(`<button class="publish">Publicar</button>`)

    $('button.publish').on('click', function (e) {
      publish(options, cb)
    })

  }

  if (options.edit) {
    simulationBtnArea.append(`<a href="https://qgda30.herokuapp.com/app/studio?type=post&id=${currentPost._id}" class="edit">Editar</a>`)
  }
  
  if (options.disable) {
    simulationBtnArea.append(`<button class="disable">Desativar</button>`)

    $('button.disable').on('click', function (e) {
      if(!canClick)return;
      canClick = false
    
      currentPost.visible = false;

      if(homePosts != undefined){
        var { banner, highlights, morePosts } = homePosts;

        var _id = currentPost._id;
  
        if(highlights.includes(_id) || banner.includes(_id) || morePosts.includes(_id)){
          updateHomePosts()
        }
      }

      console.log(currentPost)
      api.put('/app/posts', { post: currentPost })
        .then(res => {
          console.log(res)

          options.disable = false;
          options.publish = true;
          options.more = false;

          insertButtons(options, cb)

          if (cb) cb()

          canClick = true
        })
        .catch(err => {
          canClick = true
          console.log(err)
        })
    })
  }

  if (options.enable) {
    simulationBtnArea.append(`<button class="enable">Ativar</button>`)

    $('button.enable').on('click', function (e) {
      console.log('enabling')
    })
  }

  if (options.delete) {
    simulationBtnArea.append(`<button class="delete">Apagar</button>`)

    $('button.delete').on('click', function (e) {
      
      deletePost(cb)
    })  
  }

  if(options.more){
    simulationBtnArea.append(`<button class="more-opt">Mais</button>`)

    $('button.more-opt').on('click', function (e) {
      if(homePosts == undefined){

        if(!canClick)return;
        canClick = false;
    
        api.get('/app/home')
        .then(res => {
          console.log(res.data);
          homePosts = res.data;
            canClick = true;
            addTo(options, cb)
        })
        .catch(err => {
          console.log(err, 'deu ruim')
          canClick = true;
        })
      }else{
        addTo(options, cb)
      }
      
      
    })
  }

}


function addTo(options, cb){
  console.log('antes de salvar',homePosts)
  
  postElement.append(`
  <div class="options-surrounding">
    <div class="options">
      <button id="highlight">${homePosts.highlights.includes(currentPost._id)? 'Remover de ':'Adicionar em '}destaques</button>
      <button id="banner">${homePosts.banner.includes(currentPost._id)? 'Remover de ':'Adicionar ao '}banner</button>
      <button id="morePosts">${homePosts.morePosts.includes(currentPost._id)? 'Remover de ':'Adicionar em '}Mais publicações</button>
    </div>
  </div>  
  `)

  optionsHandler()

  $('div.options > #highlight').on('click', function(e){
 
    if(!canClick)return;
    canClick = false

    api.put('/app/home/', { highlights: currentPost._id})
    .then(res => {
      console.log('antigo',homePosts)
      console.log('novo',res)
      homePosts = res.data


      insertButtons(options, cb)

      canClick = true
      $('div.options-surrounding').remove()
    })
    .catch(err => {
      console.log(err, 'deu ruim')
      canClick = true
      $('div.options-surrounding').remove()
    })
    
  })

  $('div.options > #banner').on('click', function(e){

    if(!canClick)return;
    canClick = false

    api.put('/app/home/', { banner: currentPost._id})
    .then(res => {
      console.log('deu bom')

      console.log('antigo',homePosts)
      console.log('novo',res)
      homePosts = res.data
      insertButtons(options, cb)


      canClick = true
      $('div.options-surrounding').remove()
    })
    .catch(err => {
      console.log(err, 'deu ruim')
      canClick = true
      $('div.options-surrounding').remove()
    })
  })

  $('div.options > #morePosts').on('click', function(e){
    if(!canClick)return;
    canClick = false

    api.put('/app/home/', { morePosts: currentPost._id})
    .then(res => {
      console.log('deu bom')
      console.log('antigo',homePosts)
      console.log('novo',res)
      homePosts = res.data

      insertButtons(options, cb)

      console.log('novo',res.data)

      canClick = true
      $('div.options-surrounding').remove()
    })
    .catch(err => {
      console.log(err, 'deu ruim')
      canClick = true
      $('div.options-surrounding').remove()
    })
  })
}

function optionsHandler(){
  $(document).on('mouseup', function(e){
    //if the user click outside, hide this div
    
    var container = $('div.options')
    if (!container.is(e.target) && !container.find(e.target).length == 1) {
        console.log('arr n ta desaprecendooo')
      $(document).off('mouseup');
      $('div.options-surrounding').remove()
    }
  })
}



function publish (options, cb){
  if(!canClick)return;
  canClick = false

  currentPost.visible = true;
      console.log(currentPost)
      api.put('/app/posts', { post: currentPost })
        .then(res => {
          
          console.log(res)

          options.disable = true;
          options.publish = false;
          insertButtons(options, cb)
          if (cb) cb()
          canClick = true
        })
        .catch(err => {
          console.log(err)
          canClick = true
        })
}

function deletePost(cb){

  popScreen('Deseja mesmo apagar essa publicação?')

  $('button.deny').on('click', function(){
    $('div.dialog-surrounding').remove()
  })

  $('button.confirm').on('click', function(){
    if(!canClick)return;
    canClick = false

    console.log('deleting')

    var imgToDelete = []

    currentPost.blocks.map(block => {
      if (block.type == 'img') {
        imgToDelete.push(block.url)
      }
    })
    // console.log(imgToDelete)
    // console.log(currentPost)

    if (imgToDelete.length > 0) {
      imgToDelete.map(imgUrl => {
        console.log(imgUrl)
        const img = imgUrl.slice(29)

        api.delete(`/app/posts/delete_image/${img}`)
          .then(res => {
            console.log(res.data.result)
          })
          .catch(err => {
            console.log(err)
          })
      })
    }

    api.delete(`/app/posts/${currentPost._id}`)
    .then(res => {
      console.log(res)
      canClick = true
      $('div.dialog-surrounding').remove()
    })
    .catch(err => {
      console.log(err)
      canClick = true
      $('div.dialog-surrounding').remove()
    })

    if (cb) cb()
    postElement.css('display', 'none')
  
  })

}