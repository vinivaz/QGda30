$('div.add-features').on('click', function(e){

    $('div.add-features > div.studio-opts').css('display', 'flex')
    
    $(document).on('mouseup', function(e){
        //if the user click outside, hide this div
       
        
        var container = $('div.studio-opts > div.opts')
        console.log( "clicado no: ",e.target)
        console.log(e)
        console.log(container.is(e.target))
        console.log(container.find(e.target).length)
        

        if (!container.is(e.target) && !container.find(e.target).length == 1) {
            
          $(document).off('mouseup');
          $('div.add-features > div.studio-opts').css('display', 'none')
        }
      })
})