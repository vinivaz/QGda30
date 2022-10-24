import '../../styles/global/dialog-screen.css'


var newScreen = (dialog) =>`
  <div class="dialog-surrounding">
    <div class="dialog-screen">
      <div class="inner-text"><p>${dialog}</p></div>
      <div class="dialog-screen-btn">
        <button class="confirm">Confirmar</button>
        <button class="deny">Cancelar</button>
      </div>
    </div>
  </div>
`

var warningScreen = (dialog) =>`
  <div class="dialog-surrounding">
    <div class="dialog-screen">
      <div class="inner-text"><p>${dialog}</p></div>
      <div class="dialog-screen-btn">
        <button class="confirm">Ok</button>
        
      </div>
    </div>
  </div>
`

export function popScreen(dialog, cb) {
  console.log($('div#content'))
  $('div#content').append(newScreen(dialog))
  $('div#webSiteContent').append(newScreen(dialog))

  $('button.deny').on('click', function(e){
    $('div.dialog-surrounding').remove()
  })

  $(document).on('mouseup', function(e){
    //if the user click outside, hide this div
    
    var container = $('div.dialog-screen')
    if (!container.is(e.target) && !container.find(e.target).length == 1) {
        console.log('arr n ta desaprecendooo')
      $(document).off('mouseup');
      $('div.dialog-surrounding').remove()
    }
  })

  return {
    element: $('div.dialog-surrounding'),
    confirm: $('button.confirm'),
    deny: $('button.deny'),
  };

}

export function popWarningScreen(dialog, element) {
  $('div#content').append(newScreen(dialog))

  if(element){
    element.append(warningScreen(dialog))
  }else{
    $('div#webSiteContent').append(warningScreen(dialog))
  }
  

  $(document).on('mouseup', function(e){
    //if the user click outside, hide this div
    
    var container = $('div.dialog-screen')
    if (!container.is(e.target) && !container.find(e.target).length == 1) {
        console.log('arr n ta desaprecendooo')
      $(document).off('mouseup');
      $('div.dialog-surrounding').remove()
    }
  })

  $('button.confirm').on('click', function(){
    $('div.dialog-surrounding').remove()
  })

  return {
    screen: $('div.dialog-surrounding'),
    ok: $('button.confirm'),
  };

}

export function popOptsScreen(element,opts) {
  var newOptScreen = `
  <div class="opts-screen-surronding">
    <div class="opts-screen">
      <div class="opts">
        ${opts}
        <button class="hide-opts-screen opt">Cancelar</button>
      </div>
    </div>
  </div>`

  element.append(newOptScreen)

  var willHideEl = $('div.opts-screen-surronding')

  var wontHideEl = $('div.opts-screen')

  $('button.hide-opts-screen').on('click', function(e){
    $(document).off('mouseup');
      willHideEl.remove()
  })

  $(document).on('mouseup', function(e){
    //if the user click outside, hide this div
    
    if (!wontHideEl.is(e.target) && !wontHideEl.find(e.target).length == 1) {
        console.log('arr n ta desaprecendooo')
      $(document).off('mouseup');
      willHideEl.remove()
    }
  })

  return willHideEl;
}

export function popUpElement(elements){



  var wholeDiv = $(`
    <div class="hiding-area">
      <div class="exit">&#10006;</div>
      <div class="safe-area">
        ${elements}
      </div>
    </div>
  `)

  $('#content').append(wholeDiv)
  $('div#webSiteContent').append(wholeDiv)

  var hidingArea = $('.hiding-area')
  var safeArea = $('.safe-area')

  $(document).on('mouseup', function(e){

    //if the user click outside, hide this div

        
    if (!safeArea.is(e.target) && !safeArea.find(e.target).length == 1) {

      $(document).off('mouseup');
      hideArea() 
    }

  })

  function hideArea(){
    hidingArea.remove()
  }
    
  return {
    removePopUp: hideArea
  };
}
