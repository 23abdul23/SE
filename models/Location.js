import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  name: { 
    type: String, required: true, unique: true, caseUpper : true 
  },
  code: { 
    type: String, required: true, unique: true, caseUpper : true 
  },
  hash: { 
    type: String, required: true, unique: true 
  },
  description: { 
    type: String 
  }
});

export default mongoose.model('Location', LocationSchema);