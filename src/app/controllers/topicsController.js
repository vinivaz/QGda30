const routes = require('express').Router();

const topicModel = require('../models/topic')

const authConfig = require('../middlewares/auth');

routes.use(authConfig)

routes.get('/', async(req, res)=>{
    try{

        const topic = await topicModel.find()

        return res.json(topic)

    }catch(err){
        console.log(err)
        return res.json({err: 'falha'})
    }

})

routes.post('/', async(req, res)=>{
    try{
        const { topic } = req.body

        const topicList = await topicModel.create({name: topic})

        return res.json(topicList)

    }catch(err){
        console.log(err)
        return res.json({err: err})
    }

})

routes.put('/', async(req, res)=>{
    try{
        const { topic, newTopic } = req.body

        if(topic == 'NOTÍCIA'){
            res.json({err: 'O tópico "NOTÍCIA" é padrão e não pode ser modificado :('})
        }

        const topicList = await topicModel.findOneAndUpdate({name: topic},{name: newTopic},{new:true})

        return res.json(topicList)

    }catch(err){
        console.log(err)
        return res.json({err: err})
    }

})

routes.delete('/:topic', async(req, res)=>{
    try{
        const { topic } = req.params;

        if(topic == 'NOTÍCIA'){
            return res.json({err: 'O tópico "NOTÍCIA" é padrão e não pode ser apagado :('})
        }

        const topicList = await topicModel.findOneAndDelete({name: topic})

        return res.json(topicList)

    }catch(err){
        console.log(err)
        return res.json({err: err})
    }

})

module.exports = routes;