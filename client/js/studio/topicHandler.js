import api from '../../tools/api'
import {popScreen, popWarningScreen} from '../global/dialogScreen'

var topics;


//Elements
var topicSelectorDiv = $('div.select-topic')

// var addTopicInput = $('input.add-topic-input')
// var addTopicBtn = $('button.add-topic-btn')

var deleteTopicDiv = $('div.delete-topic')
//var deleteTopicSelector = $('#deleteTopicSelector')
// var deleteTopicBtn = $('button.delete-topic-btn')

export function getTopics(post){
    api.get('/app/topics')
    .then(res => {
        console.log('topics: ', res.data)
        topics = res.data

        selectTopicElement(post)
        deleteTopicElement(post)
        addTopicHandler(post)

        $('div.current-topic')
        .empty()
        .append(`<span>${post.topic}</span>`)
    })
}



// export function topicHandler (post){
//     getTopics(post)
// }

function selectTopicElement(post){
    topicSelectorDiv.empty()

    topicSelectorDiv.append('<select id="topicSelector"></select>')

    var topicSelector = $('#topicSelector')

    topics.map(topic => {
        topicSelector.append(`<option value="${topic.name}" ${post.topic == topic.name? 'selected': ''}>${topic.name}</option>`)
    })

    topicSelector.on('change', function() {
        console.log($(this).find(":selected").val())
        post.topic =  $(this).find(":selected").val();

        // $('div.current-topic')
        // .empty()
        // .append(`<span>${post.topic}</span>`)
    });

}

function addTopicHandler(post){

    $('button.add-topic-btn').on('click', function(){
        var newTopic = $('input.add-topic-input').val()

        if(newTopic == '')return;

        api.post('/app/topics', {topic: newTopic.trim().toUpperCase()})
        .then(res => {
            console.log('topics: ', res.data)
            getTopics(post)
            $('input.add-topic-input').val('')
        })

    })
}

function deleteTopicElement(post){
    deleteTopicDiv.empty()

    deleteTopicDiv.append('<select id="deleteTopicSelector"></select>')

    var deleteTopicSelector = $('#deleteTopicSelector')

    topics.map(topic => {
        deleteTopicSelector.append(`<option value="${topic.name}">${topic.name}</option>`)
    })

    deleteTopicDiv.append('<button class="delete-topic-btn">apagar</button>')

    $('button.delete-topic-btn').on('click', function() {


        var topicToDelete = deleteTopicSelector.find(":selected").val()

        deleteTopic(topicToDelete, post)

    });

}

function deleteTopic(topicToDelete, post){

    var {element, confirm, deny} = popScreen(`Deseja apagar o tópico "${topicToDelete}"? As postagens com esse tópico seram atribuídas ao tópico padrão.`)


    confirm.on('click', function(){
        element.remove()
        api.delete(`/app/topics/${topicToDelete}`)
        .then(res => {
            console.log('deletedtopic: ', res.data)
            post.topic = 'NOTÍCIA'
            if(res.data.err && res.data.err == 'O tópico "NOTÍCIA" é padrão e não pode ser apagado :('){
                var {screen, ok} = popWarningScreen(res.data.err)

                ok.on('click', function(){

                    screen.remove()
                })
            }
            getTopics(post)
            
        })
  
    })

    deny.on('click', function(){

        element.remove()
    })
}

$('button#show-delete-topic').on('click', function(e){

    $('div.delete-topic-section > div.delete-topic-surrounding').css('display', 'flex')
    
    $(document).on('mouseup', function(e){
        //if the user click outside, hide this div
       
        
        var container = $('div.delete-topic-surrounding > div.delete-topic')
        console.log( "clicado no: ",e.target)
        console.log(e)
        console.log(container.is(e.target))
        console.log(container.find(e.target).length)
        

        if (!container.is(e.target) && !container.find(e.target).length == 1) {
            
          $(document).off('mouseup');
          $('div.delete-topic-section > div.delete-topic-surrounding').css('display', 'none')
        }
      })
})

$('button#show-add-topic').on('click', function(e){

    $('div.add-topic-section > div.add-topic-surrounding').css('display', 'flex')
    
    $(document).on('mouseup', function(e){
        //if the user click outside, hide this div
       
        
        var container = $('div.add-topic-surrounding > div.add-topic')
        console.log( "clicado no: ",e.target)
        console.log(e)
        console.log(container.is(e.target))
        console.log(container.find(e.target).length)
        

        if (!container.is(e.target) && !container.find(e.target).length == 1) {
            
          $(document).off('mouseup');
          $('div.add-topic-section > div.add-topic-surrounding').css('display', 'none')
        }
      })
})