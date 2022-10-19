import { popScreen } from './dialogScreen'

$('div.add-features > button').on('click', toggleControls)

function toggleControls() {


  if ($('div.map-placement').hasClass('hidden') && $('div.block-opt').hasClass('hidden')) {

    $('div.map-placement').removeClass('hidden');
    $('div.block-opt').removeClass('hidden');
    $('div.finish-section').removeClass('hidden');
    $('div.post-exemple').on('mousedown touchstart', function () {

      // $('div.map-placement').addClass('hidden');
      // $('div.block-opt').addClass('hidden');
      toggleControls()
      $('div.post-exemple').unbind()
    })
  } else {

    $('div.map-placement').addClass('hidden');
    $('div.block-opt').addClass('hidden');
    $('div.finish-section').addClass('hidden');
  }
}


