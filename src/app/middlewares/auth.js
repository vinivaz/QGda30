const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const currentHost = process.env.CURRENT_MODE;

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const isView = req.isView;
  console.log(req.headers)
  if(!authHeader) {
      if(isView)return res.redirect(`http://${currentHost}:3333/app/login`);
      
      return res.json({ error: "No token providen" })
  }

  const parts = authHeader.split(' ');
  

  if(!(parts.length === 2)) {
    if(isView)return res.redirect('http://localhost:3333/app/login');
    
    return res.json({ error: 'Token error' });
  }

  const [ scheme, token ] = parts;
  

  if(!/^Bearer$/i.test(scheme)){
    if(isView)return res.redirect('http://localhost:3333/app/login');
    
    return res.json({ error: "Token malformated" });
  }

  jwt.verify(token, authConfig.secret, (err, decode) => {
    if(err){
      if(isView)return res.redirect('http://localhost:3333/app/login');
      
      return res.json({ error: "Invalid token" });
    }
    req.userId = decode.id;

    next()
  })
};