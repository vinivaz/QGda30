export function clickOutSide(hidingElement, wontHide, type){

    $(document).on('mouseup', function(e){
        //if the user click outside, hide this div


        var container = $(wontHide)
        if (!container.is(e.target) && !container.find(e.target).length == 1) {
            console.log('arr n ta desaprecendooo')

          $(document).off('mouseup');

          if(type == 'remove'){
            $(wholeElement).remove()
          }else{
            $(wholeElement).css('display, none')
          }
          
        }
      })
    
      return {
        element: $(wholeElement),
 
      };
}