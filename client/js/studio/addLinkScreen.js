export function addImgLinkScreen(e, news) {

  var container = $('div.place-img-link-container')

  $(document).on('mouseup', function(e){
    //if the user click outside, hide this div
    if (!container.is(e.target) && !container.find(e.target).length == 1) {
      $(document).off('mouseup');
      $('button#place-img-link-cancel').trigger('click')
    }
  })

  var currentScreen = $('div#placeImgLink')
 
  var btnID = e.target.id;

  var blockID = btnID.slice(0, btnID.length - 13);

  var linkWord = undefined;
  var address = undefined;

  var dialog = $('div.place-link-features > div.dialog');
  var wordInput = $('input[name=imgWord]');
  var linkInput = $('input[name=imgLink]')
  var okBtn = $('button#place-img-link-ok')
  var cancelBtn = $('button#place-img-link-cancel')

  var editingBlock;

  currentScreen.css('display', 'flex')

  for (var i = news.blocks.length; i--;) {
    if (news.blocks[i].id == blockID) {
      editingBlock = news.blocks[i]

    }
  }

  wordInput.change(function (e) {
    linkWord = this.value;

    if (address === undefined || linkWord === undefined) {
      dialog.text('Fill all fields').css('display', 'block');
      return;
    }
    
    dialog.text(
      ''
    ).css('display', 'none');

    okBtn.removeClass('disabled');

  });

  linkInput.change(function (e) {
    address = this.value;

    if (address === undefined || linkWord === undefined) {
      dialog.text('Fill all fields').css('display', 'block');
      return;
    }

    dialog.text(
      ''
    ).css('display', 'none')

    okBtn.removeClass('disabled');

  });

  okBtn.click(function () {
    if (!linkWord) {
      dialog.text("It's necessary a word to work as a link").css('display', 'block')
      // if(!$('button.ok').hasClass('disabled')){
      //   $('button.ok').addClass('disabled');
      // }
      return;
    }

    if (!address) {
      dialog.text('and Its also necessary link to go to').css('display', 'block')
      // if(!$('button.ok').hasClass('disabled')){
      //   $('button.ok').addClass('disabled');
      // }
      return;
    }

    editingBlock.credits = {
      content: linkWord,
      link: address
    }

    var blockCredits = $(`div#${blockID} > div.img-details > div.credits`)

    if (blockCredits) {
      blockCredits.remove()
      $(`div#${blockID} > div.img-details`).append(`
        <div class="credits">
          <a href="${editingBlock.credits.link}" target="blank">${editingBlock.credits.content}</a>
        </div>
      `)
    } else {
      $(`div#${blockID} > div.img-details`).append(`
        <div class="credits">
          <a href="${editingBlock.credits.link}" target="blank">${editingBlock.credits.content}</a>
        </div>
      `)
    }



    wordInput.val(undefined);
    wordInput.unbind();
    linkInput.val(undefined);
    linkInput.unbind();
    okBtn.addClass('disabled');
    linkWord = undefined;
    address = undefined;
    dialog.html('')
    currentScreen.css('display', 'none')
    // txtBox.text(editingBlock.content)
    // text.plain = text.plain.replaceString(7, "<a href='#'>teste</a>");
    // $('#text').html(text.plain);
    okBtn.unbind();
  });

  $('button#place-img-link-cancel').bind('click', function () {

    wordInput.val(undefined);
    wordInput.unbind();
    linkInput.val(undefined);
    linkInput.unbind();
    okBtn.addClass('disabled');
    linkWord = undefined;
    address = undefined;
    dialog.css('display', 'none')
    $('div.place-link').css('display', 'none')
    okBtn.unbind();
    $('button#place-img-link-cancel').unbind()
  });
}

export function addTxtLinkScreen(e, news) {

  $('div#placeTxtLink').css('display', 'flex')
  console.log(news)
  var btnID = e.target.id;

  var blockID = btnID.slice(0, btnID.length - 13);

  var linkWord = undefined;
  var address = undefined;
  var caret = undefined;

  var dialog = $('div.place-link-features > div.dialog');
  var wordInput = $('input[name=word]');
  var linkInput = $('input[name=link]')
  var txtBox = $('#adLink');
  var okBtn = $('button#place-link-ok')

  var editingBlock;

  var container = $('div.place-link-content')

  $(document).on('mouseup', function(e){
    //if the user click outside, hide this div
    if (!container.is(e.target) && !container.find(e.target).length == 1) {
      $(document).off('mouseup');
      $('button#place-link-cancel').trigger('click')
    }
  })

  for (var i = news.blocks.length; i--;) {
    if (news.blocks[i].id == blockID) {
      editingBlock = news.blocks[i]

    }
  }

  txtBox.val(editingBlock.content);

  // $('button#place-link-cancel').bind('click', function(){
  //   $('div.place-link').css('display', 'none')

  //   $('button#place-link-cancel').unbind()
  // })

  wordInput.change(function (e) {
    linkWord = this.value;

    if (address === undefined || linkWord === undefined) {
      dialog.text('Fill all fields').css('display', 'block');
      return;
    }
    console.log('Address value é igual a  ', address);
    dialog.text(
      'Click the location where you want add the link'
    ).css('display', 'block');
    getCaret();
  });

  linkInput.change(function (e) {
    address = this.value;

    if (address === undefined || linkWord === undefined) {
      dialog.text('Fill all fields').css('display', 'block');
      return;
    }

    dialog.text(
      'Click the location where you want add the link'
    ).css('display', 'block')
    getCaret();
  });

  function getCaret() {
    
    txtBox
      .removeAttr('readonly')
      .addClass('clickable')
      .focus()
      .bind('click', function () {
        caret = txtBox.caret();

        okBtn.removeClass('disabled');
        
      });
  }

  okBtn.click(function () {
    if (!linkWord) {
      dialog.text("It's necessary a word to work as a link").css('display', 'block')
      // if(!$('button.ok').hasClass('disabled')){
      //   $('button.ok').addClass('disabled');
      // }
      return;
    }

    if (!address) {
      dialog.text('and Its also necessary link to go to').css('display', 'block')
      // if(!$('button.ok').hasClass('disabled')){
      //   $('button.ok').addClass('disabled');
      // }
      return;
    }

    if (caret === undefined || caret === null) {
      dialog.text(
        'You also have to choose a location so insert the link'
      ).css('display', 'block')
      return;
    }

    var modifyingTXT = txtBox.val();

    var newTxt = modifyingTXT.replaceString(
      caret,
      "<a href='" + address + "' target='blank'>" + linkWord + '</a>'
    );

    editingBlock.content = newTxt
    $('div#' + blockID + '-p').html(newTxt);

    wordInput.val(undefined);
    wordInput.unbind();
    linkInput.val(undefined);
    linkInput.unbind();
    txtBox.val(undefined);
    txtBox.removeClass('clickable');
    txtBox.prop('readonly');
    txtBox.unbind();
    okBtn.addClass('disabled');
    linkWord = undefined;
    address = undefined;
    caret = undefined;
    dialog.html('')
    $('div.place-link').css('display', 'none')
    // txtBox.text(editingBlock.content)
    // text.plain = text.plain.replaceString(7, "<a href='#'>teste</a>");
    // $('#text').html(text.plain);
    okBtn.unbind();
  });

  $('button#place-link-cancel').bind('click', function () {

    wordInput.val(undefined);
    wordInput.unbind();
    linkInput.val(undefined);
    linkInput.unbind();
    txtBox.val(undefined);
    txtBox.removeClass('clickable');
    txtBox.prop('readonly');
    txtBox.unbind();
    okBtn.addClass('disabled');
    linkWord = undefined;
    address = undefined;
    caret = undefined;
    dialog.css('display', 'none')
    $('div#placeTxtLink').css('display', 'none')
    okBtn.unbind();
    $('button#place-link-cancel').unbind()
  });
}