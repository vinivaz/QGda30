import api from "../../tools/api"
import {popScreen} from "./dialogScreen.js"

var mainElement = $('div#content');

var elements = `
<div class="ad-showcase" >
  
  <div class="ad-btns">
    <div class="return">
      <button>voltar</button>
    </div>
    <div class="options"></div>
    <!-- <div class="publish">
      <button>publish</button>
    </div> -->
  </div>
  <div class="open-ad">
    <h1 class="ad-title">Anúncio</h1>
    <div class="ad-creator">
      <span>Anúncio registrado por</span>
    </div>
    <div class="ad-info">
      <span>Nome de anúncio:</span>
      <p class="ad-name">Nome de anúncio</p>
    </div>
    <div class="ad-info">
      <span>Proprietário:</span>
      <p class="ad-owner">Dono do anúncio</p>
    </div>
    <div class="ad-info">
      <span>Link :</span>
      <p class="ad-link">Link</p>
    </div>
    <div class="ad-pictures">
      <div class="square-ad">
        
      </div>
      <div class="rectangle-ad">
      
      </div>
    </div>
  </div>
</div>
`

var currentAd;

export default function startAdSimulation(ad, options, cb) {

var teste = new Date()
 console.log(teste)

currentAd = ad

mainElement.append(elements)

var postElement = $('div.ad-showcase')
var returnBtn = $('div.ad-btns > div.return > button')

returnBtn.on('click', () => {
  postElement.css('display', 'none')
})

var creatorElement = $('div.ad-creator')
var nameElement = $('p.ad-name')
var ownerElement = $('p.ad-owner')
var linkElement = $('p.ad-link')

  postElement.css('display', 'flex');

  nameElement.text(ad.name)
  creatorElement.text(`registrado por: ${ad.creator.name}`)
  ownerElement.text(ad.owner)
  linkElement.text(ad.link)
  if(ad.squarePicture.url != ''){
    $('div.square-ad').append(`
      <span>Imagem 1x1</span>
      <div class="picture" id="squareImgPlace">
        <img src="${ad.squarePicture.url}">
      </div>
    `)
  }

  if(ad.rectanglePicture.url != ''){
    $('div.rectangle-ad').append(`
      <span>Imagem 1x1</span>
      <div class="picture" id="rectangleImgPlace">
        <img src="${ad.rectanglePicture.url}">
      </div>
    `)
  }
  //  <img src="${ad.rectanglePicture.url}">
  insertButtons(options)
}

function getDate(date){
  var currentdate = new Date(date);
  return `${currentdate.getDate()}/${(currentdate.getMonth() + 1)}/${currentdate.getFullYear()}`
}

function insertButtons(options, cb) {

  var simulationBtnArea = $('div.ad-btns > div.options')
  simulationBtnArea.empty()


  if (options.activate) {
    simulationBtnArea.append(`<button class="activate">ativar</button>`)

    $('button.activate').on('click', function (e) {

      activateAd(cb)
    })
  }

  if (options.deactivate) {
    simulationBtnArea.append(`<button class="disable">desativar</button>`)

    $('button.disable').on('click', function (e) {
      deactivateAd(cb)
    })
  }

  if (options.edit) {
    simulationBtnArea.append(`<a href="https://qgda30.herokuapp.com/app/studio?type=ad&id=${currentAd._id}" class="edit">editar</a>`)
  }
  
  // if (options.enable) {
  //   simulationBtnArea.append(`<button class="enable">enable</button>`)

  //   $('button.enable').on('click', function (e) {
  //     console.log('enabling')
  //   })
  // }
  if (options.delete) {
    simulationBtnArea.append(`<button class="delete">apagar</button>`)

    $('button.delete').on('click', function (e) {

      deleteAd(cb)
    })
  }
}

function activateAd(cb){
  currentAd.visible = true;
      console.log(currentAd)
      api.put('/app/ads', { ad: currentAd })
        .then(res => {
          console.log(res)

          options.deactivate = true;
          options.activate = false;
          insertButtons(options, cb)
          if (cb) cb()
        })
        .catch(err => {
          console.log(err)
        })
}

function deactivateAd(cb){
  currentAd.visible = false;
      console.log(currentAd)
      api.put('/app/ads', { ad: currentAd })
        .then(res => {
          console.log(res)
          options.deactivate = false;
          options.activate = true
          insertButtons(options, cb)
          if (cb) cb()
        })
        .catch(err => {
          console.log(err)
        })
}

function deleteAd(cb){
  popScreen('Deseja mesmo apagar esse anúncio?')

  $('button.deny').on('click', function(){
    $('div.dialog-surrounding').remove()
  })

  $('button.confirm').on('click', function(){
    $('div.dialog-surrounding').remove()

    var imgToDelete = []
      
    if(currentAd.squarePicture.url != ''){
      imgToDelete.push(currentAd.squarePicture.url)
    }

    if(currentAd.rectanglePicture.url != ''){
      imgToDelete.push(currentAd.rectanglePicture.url)
    }
  
    // console.log(imgToDelete)
    // console.log(currentAd)

    if (imgToDelete.length > 0) {
      imgToDelete.map(imgUrl => {
        console.log(imgUrl)
        const img = imgUrl.slice(25)

        api.delete(`/app/ads/delete_ad_image/${img}`)
          .then(res => {
            console.log(res.data.result)
          })
          .catch(err => {
            console.log(err)
          })
      })
    }

    api.delete(`/app/ads/${currentAd._id}`)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })


    if (cb) cb()
    postElement.css('display', 'none')
  })

}
