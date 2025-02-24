// models/clientModel.js
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pendiente', 'Pagado'],
    default: 'Pendiente'
  }
}, {
  timestamps: true
});

const Client = mongoose.model('Client', clientSchema);

export default Client;