import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString(),
  },
  done: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);