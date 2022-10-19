
// import './main.css'
import '../../styles/global/navigation-bar.css'
import '../../styles/studio/style.css'
import '../../styles/studio/post-style.css'
import '../../styles/studio/place-link.css'
import '../../styles/studio/img-block.css'
import '../../styles/studio/text-block.css'
import '../../styles/studio/video-block.css'
import '../../styles/global/post-simulation.css'
import '../../styles/studio/topic-section.css'

// import "jquery"
// import 'jquery-ui/ui/widget'
// import 'jquery-ui/ui/widgets/mouse'
// import '../../tools/jquery.ui.touch.punch'
// import 'jquery-ui/ui/widgets/sortable'
// import '@accursoft/jquery-caret'

import './toggleControls'

import {loadPost, createNewPost} from './postEditor'
import { loadAd, createNewAd } from './adEditor'
import api from '../../tools/api'

var user = {};

// news = readyData;

$(document).ready(function() {
  console.log('aaaaaaaaaaaarrrrrrrrrrrr')
    api.get('/app/profile/find')
  .then(res => {
    
    user = res.data
    

    checkTypeInUrl()
    // checkForPostId()
  })
  .catch(err => {
    console.log(err)
  })
})


// 62cf39b8a51af7c2078d5503
// 62d3773cf18362464ae2aa04 x


function checkTypeInUrl(){
  const params = new URLSearchParams(window.location.search)

  if(!params.has('type')){
    $('div.ad-editor').remove()
    $('.post-editor').remove()
    return;
  }

  var type = params.get('type');

  if(type == 'post'){
    $('div.ad-editor').remove()
    if(params.has('id')){
      
        loadPost(params.get('id'), user)
    }else{
      
        createNewPost(user)
    }
    //checkForPostId()
  }else{
    $('.post-editor').remove()
    if(params.has('id')){
      loadAd(params.get('id'))
        console.log('loading Ad')
    }else{
        console.log('creating new Ad')
        createNewAd(user)
    }
    //createNewAd(user)
  }
  

}




