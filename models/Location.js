import { CaseUpper } from "lucide-react";
import mongoose from "mongoose";
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

export default mongoose.model("Location", LocationSchema);