import '../../styles/global/dialog-screen.css'


var newScreen = (dialog) =>`
  <div class="dialog-surrounding">
    <div class="dialog-screen">
      <div class="inner-text"><p>${dialog}</p></div>
      <div class="dialog-screen-btn">
        <button class="confirm">confirm</button>
        <button class="deny">cancel</button>
      </div>
    </div>
  </div>
`

export function popScreen(dialog, cb) {
  console.log(dialog)
  $('div#webSiteContent').append(newScreen(dialog))

  var confirmBtn = $('.dialog-surrounding > .dialog-screen > .dialog-screen-btn > .confirm')
  var cancelBtn = $('.dialog-surrounding > .dialog-screen > .dialog-screen-btn > .deny')

  cancelBtn.on('click', function(e){
    hideDialogScreen()
    cancelBtn.off()
  })

  confirmBtn.on('click', function(e){
    cb()

    hideDialogScreen()
    confirmBtn.off()
  })


}

function hideDialogScreen(){

  
  $('.dialog-surrounding').remove()
}