var startAdSkipper;

var adTimeOut;

function playAds(time = 5000){
    startAdSkipper = setInterval(() => {
        nextAd()
    }, time);
}

playAds()

$('div.ads-controls > button.next').on('click', function(e){
    nextAd()
    clearInterval(startAdSkipper)
    if(adTimeOut){
        clearTimeout(adTimeOut)

    }
    adTimeOut = setTimeout(playAds(), 5000)
})

$('div.ads-controls > button.previous').on('click', function(e){
    prevAd()
    clearInterval(startAdSkipper)
    if(adTimeOut){
        clearTimeout(adTimeOut)

    }
    adTimeOut = setTimeout(playAds(), 5000)
})


function nextAd(){
    
    var adItems = $('div.ads a.ad')

    var skippedOne = $('div.ads > a.current')[0]

    var skippedOneIndex = adItems.index($(skippedOne))

    
    var theNext;

    if(skippedOneIndex + 1 == adItems.length){
        theNext = adItems[0]
    }else{
        theNext = adItems[skippedOneIndex + 1]
    }
    
    $(skippedOne).removeClass('current')
    $(theNext).addClass('current')

}

function prevAd(){
    var adItems = $('div.ads a.ad')
    console.log('adItems:  ', adItems)

    //var postsItems = posts.children()

    var theCurrent = $('div.ads > a.current')[0]

    console.log('theCurrent: ', theCurrent)

    var currentIndex = adItems.index($(theCurrent))

    console.log('currentIndex: ', currentIndex)
    var thePrevious;

    if(currentIndex == 0){
        thePrevious = adItems[adItems.length - 1]
    }else{
        thePrevious = adItems[currentIndex - 1]
    }

    $(theCurrent).removeClass('current')
    $(thePrevious).addClass('current')

}