//import { post } from '../../../src/routes';
import '../../styles/global/default.css';
import '../../styles/global/navigation-bar.css';
import '../../styles/global/post-simulation.css';
import '../../styles/global/ad-visualizer.css';

import '../../styles/storage/style.css';
import '../../styles/storage/post.css';
import '../../styles/storage/ad.css';
import '../../styles/storage/profile-section.css';



import "jquery"
import '../owl-carousel/owl.carousel.min.js'
import api from '../../tools/api';
import startSimulation from '../global/renderPost';
import startAdSimulation from '../global/renderAd';
import { sqrPicAd, rectPicAd } from './appendAds';
import './profileHandler';

var postStorage;
var draftStorage;
var adStorage;

var currentContent = $('div.current-content')

var ads,posts,drafts, homePageConfig;

var contentOptions = $('div.content-options > button')

contentOptions.on('click', function(e){
    console.log('arrrrr',e.currentTarget.id)

    contentOptions.removeClass('active')

    $(e.target).addClass('active')

    var postsContainer = $('div.posts-container')
    var draftsContainer = $('div.drafts-container')
    var adsContainer = $('div.ads-container')

    var type =  e.currentTarget.id

    if(type == "show-ads"){
        postsContainer.addClass('invisible')
        draftsContainer.addClass('invisible')
        adsContainer.removeClass('invisible')
    }

    if(type == "show-posts"){
        postsContainer.removeClass('invisible')
        draftsContainer.addClass('invisible')
        adsContainer.addClass('invisible')
    }

    if(type == "show-drafts"){
        postsContainer.addClass('invisible')
        draftsContainer.removeClass('invisible')
        adsContainer.addClass('invisible')
    }
})

function getPosts(){

    currentContent.empty()
    currentContent.append('<div class="posts"></div>')
    postStorage = $('div.posts')
    
    
    api.get('/app/posts/published')
    .then(res => {
        posts = res.data
        console.log(posts)

        listPosts()
    })
}

function getDrafts(){
    currentContent.empty()
    currentContent.append('<div class="drafts"></div>')
    draftStorage = $('div.drafts')

    api.get('/app/posts/drafts')
    .then(res => {
        drafts = res.data;
 
        listDrafts()
        
    })
}

async function getData(){

    $('div.content-options > button').removeClass('active')

    $('button.show-posts').addClass('active')

    currentContent.empty()

    currentContent.append(`
    <div class="ads-container invisible">
        <div class="container-header"><span>Anúncios</span></div>
        <div class="ads "></div>
    </div>`)

    adStorage = $('div.ads')

    currentContent.append(`
    <div class="posts-container">
        <div class="container-header"><span>Publicações</span></div>
        <div class="posts "></div>
    </div>`)
          
    // currentContent.append('<div class="posts"></div>')
    postStorage = $('div.posts')

    currentContent.append(`
    <div class="drafts-container invisible">
        <div class="container-header"><span>Rascunhos</span></div>
        <div class="drafts "></div>
    </div>`)

    // currentContent.append('<div class="drafts"></div>')
    draftStorage = $('div.drafts')


    // try{

    api.get('/app/ads/')
    .then(res => {
        ads = res.data
        console.log('Ads:',ads)

        //chooseImg(posts)
        listAds()
    })
    .catch(err => {
        console.log(err)
    })

    api.get('/app/posts/published')
    .then(res => {
        posts = res.data
        console.log('posts:',posts)
        console.log(posts)
        // chooseImg(posts)
        listPosts()
    })
    .catch(err => {
        console.log(err)
    })

    api.get('/app/posts/drafts')
    .then(res => {
        drafts = res.data;
        console.log('drafts:',drafts)
        // chooseImg(drafts)
        listDrafts()
        
        
    })
    .catch(err => {
        console.log(err)
    })

    api.get('/app/home')
    .then(res => {
        homePageConfig = res.data;
    })
    .catch(err => {
      console.log(err, 'deu ruim')
    })
    
}

// function chooseImg(anyTypePosts){
//     anyTypePosts.map( post => {post.img = setImagePost(post)})
// }

function setImagePost(post){

    for(var i = 0; i < post.blocks.length; i++){
        if(post.blocks[i].type == 'img'){
            return post.blocks[i].url
        }
    }
    
}

function listAds(){
    ads.map(ad =>{
        if(ad.squarePicture.url != ""){
            sqrPicAd(ad, adStorage)
        }else{
            rectPicAd(ad, adStorage)
        }
    })

    adOnClick()
}

function listPosts(){
    posts.map(post => {
        postStorage.append(`
            <div class="post item" id="${post._id}">
              <div class="post-content">
                <div class="img-place">
                    <img class="post-img" src="${post.img}">
                </div>
                <div class="post-data">
                    <span class="post-title">${post.title}</span>
                    <div class="post-details">
                        <span class="post-author">Vini</span>
                        <span class="post-date">23/7/2022</span>
                    </div>
                </div>
              </div>
              
            </div>
        `)
    })

    postOnClick()
    
    
//     $(document).ready(function(){
//         console.log($(".owl-carousel"))
        
//     });
}

function listDrafts(){
    drafts.map(draft => {
        console.log(draft.img)
        draftStorage.append(`
            <div class="post" id="${draft._id}">
              <div class="post-content">
                <div class="img-place ${draft.img == ""? "no-img": ""}">
                    <img class="post-img" src="${draft.img}">
                </div>
                <div class="post-data">
                    <span class="post-title">${draft.title}</span>
                    <div class="post-details">
                        <span class="post-author">Vini</span>
                        <span class="post-date">23/7/2022</span>
                    </div>
                </div>
              </div>
            </div>
        `)
    })

    draftsOnClick()

}


export function start(){
    //getPosts()
    getData() 

    $('div.add-features').on('click', function(e){

        $(document).on('mouseup', function(e){
            //if the user click outside, hide this div
            
            var container = $('div.studio-opts > div.opts')
            console.log(!container.is(e.target) && !container.find(e.target).length == 1)
            if (!container.is(e.target) && !container.find(e.target).length == 1) {
                console.log('arr n ta desaprecendooo')
              $(document).off('mouseup');
              $('div.studio-opts').css('display', 'none')
            }
          })

        $('div.studio-opts').css('display', 'flex')


    })
}

start()

function adOnClick(){
    $('div.ad-item').on('click', function(e){
        var adId = e.currentTarget.id
  
        console.log(e.currentTarget.id)
        
        var options;

        for(var i = 0; i < ads.length; i++){
            if(ads[i]._id == adId){
                console.log(ads[i])

                if(ads[i].visible == true){
                    options = {
                    
                        deactivate: true,
                        delete: true,
                        edit: true
                    }
                }else{
                    options = {
                    
                        activate: true,
                        delete: true,
                        edit: true
                    }
                }
                
                // startSimulation(posts[i], options, getData)
                startAdSimulation(ads[i], options, getData)
            }
        }
    }) 

}

function postOnClick(){
    $('div.posts > div.post').on('click', function(e){
        var postID = e.currentTarget.id
  
        console.log(e.currentTarget.id)

        for(var i = 0; i < posts.length; i++){
            if(posts[i]._id == postID){
                console.log(posts[i])
                var options = {
                    
                    
                    disable: true,
                    delete: true,
                    edit: true,
                    more: true
                }
                startSimulation(posts[i], options, getData, homePageConfig)
            }
        }
    }) 

}

function draftsOnClick(){
    $('div.drafts > div.post').on('click', function(e){

        console.log(e.currentTarget.id)

        var draftID =  e.currentTarget.id
        
        for(var i = 0; i < drafts.length; i++){
            if(drafts[i]._id == draftID){
                console.log(drafts[i])
                   var options = {
                        
                    publish: true,
                    //enable: true,
                    delete: true,
                    edit: true
                }
                startSimulation(drafts[i], options, getData)
                
            }
        }
    }) 

}