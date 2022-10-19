var startSkipper;

var timeOut;

function play(time = 5000){
    startSkipper = setInterval(() => {
        next()
    }, time);
}

var viewWidth = $(window).width();


$(window).on('resize',function(){
    viewWidth = $(window).width();
});

play()

$('div.posts-navigation > button.next').on('click', function(e){
    if(viewWidth <= 1050){
        if(startSkipper){
            clearInterval(startSkipper)
        }
        if(timeOut){
            clearTimeout(timeOut)
        }

        return
    }

    next()

    clearInterval(startSkipper)
    if(timeOut){
        clearTimeout(timeOut)

    }
    timeOut = setTimeout(play(), 5000)
})

$('div.posts-navigation > button.prev').on('click', function(e){
    prev()
    clearInterval(startSkipper)
    if(timeOut){
        clearTimeout(timeOut)

    }
    timeOut = setTimeout(play(), 5000)
})


function next(){
    if(viewWidth <= 1050)return;

    var posts = $('div.posts')

    var postsItems = posts.children()

    var skippedOne = postsItems[0]
    var theNext = postsItems[1]
    $(skippedOne).removeClass('open')
    $(theNext).addClass('open')

    postsItems[0].remove()
    

    posts.append(skippedOne)

    console.log(skippedOne.className)
}

function prev(){
    var posts = $('div.posts')
    var postsItems = posts.children()
    var theLast = $(postsItems[postsItems.length - 1])
    var theFirst = $(postsItems[0])

    theFirst.removeClass('open')
    theLast.addClass('open')

    theLast.remove()

    posts.prepend(theLast)
}