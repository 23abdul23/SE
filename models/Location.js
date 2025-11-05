const { CaseUpper } = require('lucide-react');
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { 
    type: String, required: true, unique: true, CaseUpper : true 
  },
  code: { 
    type: String, required: true, unique: true, CaseUpper : true 
  },
  hash: { 
    type: String, required: true, unique: true 
  },
  description: { 
    type: String 
  }
});

module.exports = mongoose.model('Location', LocationSchema);