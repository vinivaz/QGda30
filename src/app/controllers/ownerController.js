const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth.json');

const ownerModel = require('../models/owners').model('owner');
//const Users = models.model('user');

function generateToken (params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,//86400
  });

}

module.exports = {
  

  async list(req, res) {

    // const { page = 1 } = req.query;
    // const options = {
    //   page: page,
    //   limit: 15
    // }

    const user = await ownerModel.find();

    return res.json(user);
  },

  async register(req, res) {
    const { name, email, password } = req.body;

    try{

      if(await ownerModel.findOne({email})){
        return res.json({error: 'Email already exists'})
      }

      if(await ownerModel.findOne({name})){
        return res.json({error: 'Name already exists'})
      }

      if(!password) return res.json({ error: 'Insert password' });

      //const hash = await bcrypt.hash(password, 10);

      const owner = await ownerModel.create({
        name,
        password,
        email,
        profile_img: "",
      });

      owner.password = undefined;
  
      return res.json({
        owner,
        token: generateToken({ id: owner.id})
      });

    }catch(err){
      console.log(err)
      return res.json({error: 'Couldn\'t Register, try again'})
    }
  },

  async auth(req, res) {
    const { email, password } = req.body;

    try{
      
      const owner = await ownerModel.findOne({email}).select('+password');

      if(!owner) {
        return res.json({error: 'E-mail não encontrado'})
      };

      if(!owner.password || owner.password == '' || owner.password == null){
        return res.json({errorDialog: 'Sua conta não usa esse metodo de autenticação, tente outra forma de login.' });
      }

      if(!await bcrypt.compare(password, owner.password)) {
        return res.json({ error: 'Senha inválida' });
      };

      owner.password = undefined;

      return res.json({
        owner,
        token: generateToken({ id: owner.id})
      });
    }catch(err){

      return res.json({ error: 'Houve falha ao tentar entrar' });
    }

  },

  async googleAuth(req, res){
    const { email } = req.body;

    try{

      const owner = await ownerModel.findOne({email}).select('+password');

      if(!owner) {
        return res.json({errorDialog: 'E-mail não encontrado'})
      };

      owner.password = undefined;

      return res.json({
        owner,
        token: generateToken({ id: owner.id})
      });
    }catch(err){
      return res.json({errorDialog : 'Houve falha ao tentar entrar' });
    }
  },

  async forgotPassword(req, res) {
    const { email } = req.body;
    
    try {
      
      const owner = await ownerModel.findOne({ email });

      if(!owner){
        return res.json({ error: "User not found" });
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await ownerModel.findByIdAndUpdate(owner.id,{
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      });

      //console.log("token ", token)

      await mailer.sendMail(
        {
          to: email,
          from: 'alguem',
          template: 'auth/forgot_password',
          context: { token }
        },(err) => {
          if (err){
            console.log(err)
            return res
            .send({ error: 'Cannot send forgot password email' });
          }else{         
            return res.send();
          }
        }
      );
       
    }catch(err){
      console.log(err);
      return res.json({ error: 'Error on forgot password' });
    }
    
  },

  async changePassword(req, res) {
    const { email, password, token } = req.body;

    try{
      const owner = await ownerModel.findOne({ email }).select('+ passwordResetToken passwordResetExpires')
      
      if(!owner){
        return res.json({ error: 'User not found'});
      }

      if(password === ""){
        return res.json({ error: 'New password required'});
      }

      if(token !== owner.passwordResetToken) {
        return res.json({ error: 'Invalid token' });
      }

      const now = new Date();

      console.log(now)
      if(now > owner.passwordResetExpires){
        return res.json({ error: 'Token has expired'});
      }

      owner.password = password;

      await owner.save();

      return res.json({result: "Password changed successfully"});

    }catch(err){
      console.log(err)
      return res.json({ error: 'Error changing your password, try again later'});
    }
  },

  async delete(req, res) {
    const { email, password } = req.body;

    try{
      
      const owner = await ownerModel.findOne({email}).select('+password');
      
      
      if(!owner) {
        return res.json({error: 'User not Found'})
      };

      if(!await bcrypt.compare(password, owner.password)) {
        return res.json({ error: 'Invalid password' });
      };

      await owner.delete()

      return res.json();

    }catch(err){
      console.log(err)
      return res.json({ error: 'Error on deleting account' });
    }

  }

}

/*
    async patch(req, res) {
    const user = req.body.newUser;
    const [ name, email ] = user;

    try{
      await Users.findOne({email})
      if(){
        return res.json({error: 'Email already exists'})

      }else {

        if(await Users.findOne({name})){

          return res.json({error: 'Name already exists'})
          
        }else{
          
          if(user.password !== "") {
            const hash = await bcrypt.hash(password, 10);
          }
        }
      }
      const user = await Users.create({
        name,
        password: hash,
        email
      });

      user.password = undefined;
  
      return res.json({
        user,
        token: generateToken({ id: user.id})
      });

    }catch(err){
      return res.json({error: 'Couldn\'t Register, try again'})
    }
  },
  */