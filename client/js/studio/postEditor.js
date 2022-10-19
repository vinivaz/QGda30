
// import './main.css'
import '../../styles/global/navigation-bar.css'
import '../../styles/studio/style.css'
import '../../styles/studio/post-style.css'
import '../../styles/studio/place-link.css'
import '../../styles/studio/img-block.css'
import '../../styles/studio/text-block.css'
import '../../styles/studio/video-block.css'
import '../../styles/global/post-simulation.css'


import "jquery"
import 'jquery-ui/ui/widget'
import 'jquery-ui/ui/widgets/mouse'
import '../../tools/jquery.ui.touch.punch'
import 'jquery-ui/ui/widgets/sortable'
import '@accursoft/jquery-caret'

import { mapIconTrigger } from './mapIconTrigger'
//import './toggleControls'
import {getTopics} from './topicHandler'
import {MapSortable,startMap} from './postMap'

import {addTxtLinkScreen, addImgLinkScreen} from './addLinkScreen'
import { addBlock } from './post'
//import {startMap} from './postMap'
import startSimulation from '../global/renderPost'
import savePost from './savePost'

import {
  newImgBlock,
  newTweetBlock,
  newTxtBlock,
  newVideoBlock
} from './blockGenerator'
import api from '../../tools/api'

var readyData = {
  title: 'Lady Gaga - The Fame Monster',
  author: 'Vini',
  date: '27/05/2022',
  blocks: [
    {
      id: 1279924053301,
      type: "img",
      url: 'https://pbs.twimg.com/media/FT3AACEVEAA8Rcq?format=jpg&name=large',
      // credits: {
      //   content: 'lady gaga',
      //   link: 'abubleh'
      // },
      // description: 'Lady Gaga'
      // url: 'https://i.pinimg.com/564x/eb/00/c1/eb00c1980089fd880366bf47018eddef.jpg'
    },
    {
      id: 55719264018,
      type: 'text',
      content: 'Im sitting in my brothers roomHavent slept in a week or two, or two I think I might have fallen in love What am I to do?'
    },
    {
      type: 'tt-embed',
      content: '1530590558959198208',
      id: 46126235279
    },
    {
      id: 145884951979,
      type: 'text',
      content: 'Two years ago we set out to create new, bold makeup that is supercharged with the worlds most innovative skincare ingredients.  Im proud that @hauslabs is launching a new makeup line that we believe represents the  future of clean artistry.  I hope we change your perception of what clean makeup can be, and that you will love our products as much as I do.'
    },
    {
      id: 34607344840,
      type: 'yt-embed',
      content: 'ohs0a-QnFF4'
    },
    {
      id: 696958368640,
      type: 'text',
      content: 'Two years ago we set out to create new, bold makeup that is supercharged with the worlds most innovative skincare ingredients.  Im proud that @hauslabs is launching a new makeup line that we believe represents the  future of clean artistry.  I hope we change your perception of what clean makeup can be, and that you will love our products as much as I do.'
    },
  ]
}

var news = {
  title: 'Título da publicação',
  author: {},
  date: '',
  blocks: [],
  imgBlocksToBeDeleted: []
};


let canvas = $('#webSiteContent')

let titleField = $('.postTitle')
let authorField = $('.postAuthor')
let dateField = $('.postDate')
let categoryField = $('.category')

$(document).on('click', function (e) {

  var cssClass = e.target.className;

  if (e.target.className == 'simulate') {
   startSimulation(news, {})
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

  if (e.target.className == 'add-txt-link-btn') {
    addTxtLinkScreen(e, news)
  }

  if (e.target.className == 'add-img-link-btn') {
    addImgLinkScreen(e, news)
  }

  if (e.target.className == 'save') {
    savePost(news)
  }

  if(cssClass == 'category'){
    $(e.target).bind('click', function () {
      $(this).attr('contentEditable', true);
    })
    .blur(function () {
      $(this).attr('contentEditable', false)

      if(this.innerHTML.trim() == ''){
        news.category = 'NOTÍCIA'
        this.innerHTML = 'NOTÍCIA'
        return;
      }
      news.category = this.innerHTML.trim().toUpperCase()
      this.innerHTML.trim().toUpperCase()
      $(this).unbind()
    });
  }


  if (e.target.className == 'description notranslate') {
    console.log('tá ativando quando clica')
    $(e.target).bind('click', function () {
      $(this).attr('contentEditable', true);
    })
    .blur(function () {
      console.log('blur ativou')
      $(this).attr('contentEditable', false)
      
      var blockID = this.id.slice(0, this.id.length - 13)
      console.log(this.id)
      console.log(blockID)

      for (var i = news.blocks.length; i--;) {
        if (news.blocks[i].id == blockID) {
          if(this.innerHTML.trim() == 'picture description'){
            news.blocks[i].description = ''
            return;
          }
          news.blocks[i].description = this.innerHTML

          console.log('news.blocks[i].description',news.blocks[i].description)

          if(this.innerHTML == ''){
            this.innerHTML = 'picture description'
            
          }
        }
      }

      $(this).unbind()
    });

  }

  $('div.editable').bind('click', function () {
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

titleField.bind('click', function () {
  $(this).attr('contentEditable', true);

}).blur(
  function () {
    $(this).attr('contentEditable', false)

    var textInside = $(this).text().replace(/<[^>]*>/g, '').trim();

    console.log($(this).text().replace(/<[^>]*>/g, ''))
    console.log(textInside)
    console.log(encodeURI(textInside))
    
    if (textInside == ''|| textInside == ' ') {
      this.innerHTML = 'Título da publicação'
      news.title = 'Título da publicação'

      return;
    }

    news.title = textInside
    $(this).html(textInside)
    

  }
);

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

function getDate(date){
  var currentdate;

  if(date){
    currentdate = new Date(date);
  }else{
    currentdate = new Date()
  }
  return `${currentdate.getDate()}/${(currentdate.getMonth() + 1)}/${currentdate.getFullYear()}`

}


export function renderEditor(data) {

  


  $('.postTitle, .postAuthor, .postDate, .category, #post-content').empty()
  // // titleField.text(decodeURI(data.title) || '');
  // titleField.html(data.title || '');
  // dateField.text(decodeURI(data.title) || getDate())
  // authorField.html(decodeURI(data.title) || '')
  // // authorField.text(data.author.name || '')

  titleField.html(data.title || '');
  categoryField.html(data.category|| 'Notícia')
  dateField.text(getDate(data.createdAt) || getDate())
  authorField.text(data.author.name || '')

  var blocks = data.blocks;

  $.each(blocks, function (key) {

    switch (blocks[key].type) {
      case 'img':
        newImgBlock(blocks[key], '', news)

        break;
      case 'text':
        newTxtBlock(blocks[key], '', news)

        break;
      case 'ig-embed':
        console.log('ig-embed');
        break;
      case 'tt-embed':
        newTweetBlock(blocks[key],'', news)

        break;
      case 'yt-embed':
        newVideoBlock(blocks[key], '', news)

        break;
      default:
        return;
    }
  })
}

function start() {



  renderEditor(news)

  getTopics(news)
  
  const getMapClick = new mapIconTrigger()

  //activates the add blocks buttons
  getMapClick.IconOnClick(addBlock, news)

  //eventListeners(news)

  startMap(news)

  MapSortable(news, renderEditor)
}

// 62cf39b8a51af7c2078d5503
// 62d3773cf18362464ae2aa04 x

export function loadPost(postId, user){
    api.get(`/app/posts/${postId}`).then(res => {
        
  
        if(res.data === ''){
          alert("EI! achei não")
          return
        }
        
          news = res.data;
          news.imgBlocksToBeDeleted = []
          start()
        
      })
}

export function createNewPost(user){
    news.author.name = user.name
    
    start()
}

export function postEditor(postId,user){
  if(postId){
    api.get(`/app/posts/${postId}`).then(res => {
      console.log(res.data)

      if(res.data === ''){
        alert("EI! achei não")
        return
      }
      
        news = res.data;
        news.imgBlocksToBeDeleted = []
        start()
      
    }) 
    
    return;
  }


  news.author.name = user.name
  console.log(user)
  start()
}

// export function checkForPostId(){
//   const params = new URLSearchParams(window.location.search)

//   if(params.has('id')){
//     var postId = params.get('id')

//     api.get(`/app/posts/${postId}`).then(res => {
//       console.log(res.data)

//       if(res.data === ''){
//         alert("EI! achei não")
//         return
//       }
      
//         news = res.data;
//         news.imgBlocksToBeDeleted = []
//         start()
      
//     })
//   }else{

//     news.author.name = user.name
//     console.log(user)
//     start()
//   }
// }

// function checkTypeInUrl(){
//   const params = new URLSearchParams(window.location.search)

//   if(!params.has('type'))return;

//   var type = params.get('type');

//   if(type == 'post'){
//     checkForPostId()
//   }else{
//     renderAdEditor()
//   }
  

// }




