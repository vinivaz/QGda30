//import { post } from '../../../src/routes';
import '../../styles/global/default.css';
import '../../styles/global/navigation-bar.css';
import '../../styles/storage/style.css';
import '../../styles/studio/post-simulation.css'

import api from '../../tools/api'
import startSimulation from '../global/renderPost'

var postStorage = $('div.posts')
var draftStorage = $('div.drafts')

var posts,drafts;

async function getData(){
    // try{
    api.get('/app/posts/published')
    .then(res => {
        posts = res.data
        console.log(posts)
        chooseImg(posts)
        
    })

    api.get('/app/posts/drafts')
    .then(res => {
        drafts = res.data;
        chooseImg(drafts)
        listDrafts()
        
    })
}

function chooseImg(posts){
    posts.map( post => {post.img = setImagePost(post)})
}

function setImagePost(post){

    for(var i = 0; i < post.blocks.length; i++){
        if(post.blocks[i].type == 'img'){
            return post.blocks[i].url
        }
    }
    
}

function listPosts(){
    
}

function listDrafts(){
    drafts.map(draft => {
        draftStorage.append(`
            <div class="post" id="${draft._id}">
              <div class="post-content">
                <div class="img-place">
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

        $(`div#${draft._id}`).on('click', function(e){
            var draftID = this.id

            for(var i = 0; i < drafts; i++){
                if(drafts[i]._id == draftID){
                    startSimulation(drafts[i])
                }
            }
        })
    })
}


function start(){
    getData() 
}

start()