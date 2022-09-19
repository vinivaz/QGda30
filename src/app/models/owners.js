const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
//const mongoosePaginate = require('mongoose-paginate');

const ownerSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  profile_img: {
    type: String,
    
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  }
},{ timestamps: true});

//ownerSchema.plugin(mongoosePaginate); 

ownerSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

module.exports = new mongoose.model('owner', ownerSchema);
