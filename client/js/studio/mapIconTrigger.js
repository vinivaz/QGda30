export class mapIconTrigger{
    constructor(){
        this.triggers = $('.block-opt > button')
        
    }

    IconOnClick(cb, post){
        this.triggers.each(function(index,value){
            $(value).click(function(e){
                cb(value.className, post)
                console.log(value)
            })
        })
    }

}