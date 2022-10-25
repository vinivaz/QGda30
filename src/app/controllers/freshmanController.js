const routes = require('express').Router();

const freshmanModel = require('../models/freshmanList')

const authConfig = require('../middlewares/auth');

routes.use(authConfig)

routes.get('/', async(req, res)=>{
    try{

        const freshManList = await freshmanModel.find()

        const now = new Date();

        freshManList.map( freshman => {
            if(now > freshman.emailExpires){
                freshman.expired = true
            }
        })

        //await freshManList.save()

        return res.json(freshManList)

    }catch(err){
        console.log(err)
        return res.json({errorDialog: 'Não foi possivel achar a lista de email permitidos, sorry'})
    }

})

routes.post('/', async(req, res)=>{
    try{
        const { email } = req.body

        const now = new Date();
        now.setHours(now.getHours() + 24);

        const newFreshman = await freshmanModel.findOneAndUpdate(
                {
                    email,
                    emailExpires: now,
                    expired: false,

                },
                {
                    new: true,
                    upsert:true
                }
            )

        return res.json(newFreshman)

    }catch(err){
        console.log(err)
        return res.json({errorDialog: 'Não foi possivel registrar um novo integrante, tenta denovo dps :('})
    }

})

routes.delete('/:email', async(req, res)=>{
    try{
        const { email } = req.params;

        const freshmanList = await freshmanModel.findOneAndDelete({email: email})

        return res.json({result: 'Deu certo'})

    }catch(err){
        console.log(err)
        return res.json({errorDialog: "Iiiii.. houve uma falha ao tentar apagar, tenta denovo dps"})
    }

})

// routes.put('/', async(req, res)=>{
//     try{
//         const { topic, newTopic } = req.body

//         if(topic == 'NOTÍCIA'){
//             res.json({err: 'O tópico "NOTÍCIA" é padrão e não pode ser modificado :('})
//         }

//         const topicList = await freshmanModel.findOneAndUpdate({name: topic},{name: newTopic},{new:true})

//         return res.json(topicList)

//     }catch(err){
//         console.log(err)
//         return res.json({err: err})
//     }

// })



module.exports = routes;