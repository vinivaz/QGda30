import api from '../../tools/api'
import { deleteImage } from './deleteImage'
import {popWarningScreen} from '../global/dialogScreen'

var canSave = true;

/*
  If the post already has an _id, means it came from mongoDB, which also means it's a post update
  so if has postId it will execute the update post function, if not it will execute the brand new post function
*/
export default async function savePost(post) {
  if (!canSave){
    var {screen, ok} = popWarningScreen('tu precisa esperar o post terminar de salvar')

    ok.on('click', function(){

        screen.remove()
    })

    return
  }
  canSave = false

  var postId = post._id

  if(postId == undefined){
    saveBrandNewPost(post)
    
  }else{
    console.log('não ta atualizandooo')
    updatePost(post)
  }
}

/*
  The following function will go through all the blocks and verify if the block object has any img file, if so, it has to send them
  to the API and once the img file is uploaded, the API will return the img url that is its going to replace the base64 url 
  that was in the block.url temporaryly.

  The whole post will only be sent to the server when the last promise is done
*/
function saveBrandNewPost(post){
  
  var i = 0;

  post.blocks.map(block => {

    if (block.file && block.file !== undefined) {

      var formData = new FormData();

      formData.append("file", block.file)

      api.post('/app/posts/save_image', formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } })
      .then(res => {
        
        block.url = res.data
        block.file = undefined
        
        
        if ((i+1) >= post.blocks.length) {//if it's the last block, when it's done the post will go to API, if not the index will increase by 1
          api.post('/app/posts', { post: post })
          .then(response => {
            var newPost = response.data
            if(newPost){
              post._id = newPost._id
              console.log(post)
              canSave = true
            }
          })
          .catch(err => {
            console.log(err)
            canSave = true
          })
        } else {
          i++
        }
      })

    }else{
      console.log(i)
      if ((i+1) >= post.blocks.length) {//if it's the last block, when it's done the post will go to API, if not the index will increase by 1
        api.post('/app/posts', { post: post })
        .then(response => {
          var newPost = response.data
          if(newPost){
            post._id = newPost._id
            console.log(post)
            canSave = true
          }
        })
        .catch(err => {
          console.log(err)
          canSave = true
        })
      } else {
        i++
      }
    }

  })
}

/*
  The following function will first look if there's any img url in the imgUrlToBeDeleted, and to all of them is going to
  tell the server to delete this files because they were deleted in the post.

  Then it wll go through all the blocks and verify if the block object has any new img file, if so, it has to send them
  to the API and once the img file is uploaded, the API will return the img url that is its going to replace the base64 url 
  that was in the block.url temporaryly.

  After the last promise is done, the post will be updated
*/
function updatePost(post){

  if(post.imgBlocksToBeDeleted.length > 0){
    post.imgBlocksToBeDeleted.map(imgBlock =>{
      console.log(imgBlock)
      deleteImage(imgBlock)
    })
  }
  post.imgBlocksToBeDeleted = []
  console.log('atualizandooo', post)
  
  var i = 0;

  post.blocks.map(block => {
    if (block.file && block.file !== undefined) {
      var formData = new FormData();
      formData.append("file", block.file)

      api.post('/app/posts/save_image', formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } })
      .then(res => {
        console.log(i)
        block.url = res.data
        block.file = undefined
        if ((i+1) >= post.blocks.length) {//if it's the last block, when it's done the post will go to API, if not the index will increase by 1
          api.put('/app/posts', { post: post })
          .then(response => {
            var newPost = response.data
            if(newPost){
              post = newPost
              console.log(post)
              canSave = true
            }
          })
          .catch(err => {
            console.log(err)
            canSave = true
          })
        } else {
          i++
        }
      })

    }else{
      console.log(i)
      if ((i+1) >= post.blocks.length) {//if it's the last block, when it's done the post will go to API, if not the index will increase by 1
        api.put('/app/posts', { post: post })
        .then(response => {
          var newPost = response.data
          if(newPost){
            post = newPost
            console.log(post)
            
          }
          canSave = true
        })
        .catch(err => {
          console.log(err)
          canSave = true
        })
      } else {
        i++
      }
    }

  })
}