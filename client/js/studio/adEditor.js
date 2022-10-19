import '../../styles/studio/ad-editor.css'

import api from '../../tools/api'
import { deleteAdImage } from './deleteImage'

var openAd = {
  name: 'My life in rewind',
  owner: 'Continua sem dono',
  link: 'sem link',
  squarePicture: {
    url: '',
    file: undefined,
  },
  rectanglePicture: {
    url: '',
    file: undefined,
  },
  creator: undefined,
  adImgsToBeDeleted: []
}

function adEditorEvtListener(){
  $('div.ad-editor').on('click', function(e){
    var elementId = $(e.target.id)

    if(elementId == "name"){

    }
  }) 
  
  $('#adName').on('change', function(e){
    openAd.name = $(e.target).val()
  })

  $('#adOwner').on('change', function(e){
    openAd.owner = $(e.target).val()
  })

  $('#adLink').on('change', function(e){
    openAd.link = $(e.target).val()
  })

  $('#squareImg').on('change', changeSquareImg)

  $('#rectangleImg').on('change', changeRectangleImg)

  $('#squareImgPlace').on('click', function(e){
    $('#squareImg').trigger('click')
  })

  $('#rectangleImgPlace').on('click', function(e){
    $('#rectangleImg').trigger('click')
  })

  $('#saveAd').on('click', function(e){
    
    //fillAdEditor()
    saveAd()
  })
}

var mainContent = $('div#webSiteContent')

export function loadAd(adId){
//62fc6cb21e13485c6f6539d3
  api.get(`/app/ads/${adId}`)
  .then(res => {
    
    openAd = res.data
    openAd.adImgsToBeDeleted = []
    fillAdEditor()
    adEditorEvtListener()
  })
  .catch(err=> {
    console.log(err)
  })
}

export function createNewAd(creator){
  openAd.creator = creator
  openAd.adImgsToBeDeleted = []
  fillAdEditor()
  adEditorEvtListener()
}

function fillAdEditor(){
  $('#adName').val(openAd.name)
  $('#adOwner').val(openAd.owner)
  $('#adLink').val(openAd.link)
  $('div.creator > span').text(`Anúncio registrado por ${openAd.creator.name}`)

  if(openAd.squarePicture.url != ''){
    $('#squareImgPlace').append(`<img src="${openAd.squarePicture.url}">`)
  }

  if(openAd.rectanglePicture.url != ''){
    $('#rectangleImgPlace').append(`<img src="${openAd.rectanglePicture.url}">`)
  }
}

function changeSquareImg(e){
  if(e.target.files && e.target.files.length > 0){
    const reader = new FileReader();
    reader.onload = ()=>{
      if((!openAd.squarePicture.file || openAd.squarePicture.file == undefined) && openAd.squarePicture.url != ''){
        openAd.adImgsToBeDeleted.push(openAd.squarePicture.url)
      }
      openAd.squarePicture = {
        url: reader.result,
        file: e.target.files[0]
      }
      $('#squareImgPlace')
      .empty()
      .append(`<img src="${reader.result}">`)
    }
    reader.readAsDataURL(e.target.files[0])
  }
}

function changeRectangleImg(e){
  if(e.target.files && e.target.files.length > 0){
    const reader = new FileReader();
    reader.onload = ()=>{
      if((!openAd.rectanglePicture.file || openAd.rectanglePicture.file == undefined) && openAd.rectanglePicture.url != ''){
        openAd.adImgsToBeDeleted.push(openAd.rectanglePicture.url)
      }
      openAd.rectanglePicture = {
        url: reader.result,
        file: e.target.files[0]
      }
      $('#rectangleImgPlace')
      .empty()
      .append(`<img src="${reader.result}">`)
    }
    reader.readAsDataURL(e.target.files[0])
  }
}

var canSave = true;
function saveAd(){ 
  
  if(!canSave){
    alert('esperaaa')
  }
  canSave = false

  var squareImg = openAd.squarePicture
  var rectangleImg = openAd.rectanglePicture

  var hasSqrImgToUpload = (openAd.squarePicture.file && openAd.squarePicture.file != undefined)
  var hasRectImgToUpload = (openAd.rectanglePicture.file && openAd.rectanglePicture.file != undefined)

  if(openAd.adImgsToBeDeleted.length > 0){
    openAd.adImgsToBeDeleted.map(adImg =>{
      
      deleteAdImage(adImg)
    })
  }

  if(hasSqrImgToUpload){
    console.log('tem imagems quadrada pra fazer upload')
    uploadSquareImg()
  }else if(hasRectImgToUpload){
    uploadRectangleImg()
    console.log('tem imagems retangular pra fazer upload')
  }else{
    finishSaving()
  }
    

  function uploadSquareImg(){
    var formData = new FormData();
    formData.append("file", squareImg.file)

    api.post('/app/ads/save_ad_image', formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } })
      .then(res => {
        console.log('primeira imagem ja foi')
        squareImg.url = res.data;
        squareImg.file = undefined;
        console.log(openAd)
        if(hasRectImgToUpload){
          console.log('tem imagems retangular pra fazer upload')
          uploadRectangleImg()
        }else{
          finishSaving()
        }
      })
      .catch(err => {
        console.log(err)
        canSave = true
      })
  }

  function uploadRectangleImg(){
    var formData = new FormData();
    formData.append("file", rectangleImg.file)

    api.post('/app/ads/save_ad_image', formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } })
      .then(res => {
        console.log('segunda também')
        rectangleImg.url = res.data;
        rectangleImg.file = undefined;

        finishSaving()
      })
      .catch(err => {
        console.log(err)
        canSave = true
      })
  }

  function finishSaving(){

    if(openAd._id){
      console.log('atualizando Ad')

      api.put('/app/ads/', {ad: openAd})
      .then(res => {
        openAd = res.data
        openAd.adImgsToBeDeleted = []
        console.log(res.data)
        console.log(openAd)
        canSave = true
      })
      .catch(err => {
        console.log(err)
        canSave = true
      })

      return
    }

    console.log('não ta atualizando Ad')
    api.post('/app/ads/', {ad: openAd})
    .then(res => {
      openAd = res.data
      openAd.adImgsToBeDeleted = []
      console.log(res.data)
      console.log(openAd)
      canSave = true
    })
    .catch(err => {
      console.log(err)
      canSave = true
    })
  }
}
