import mongoose, { Schema, model } from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';

var conn = mongoose.createConnection(
  process.env.DB_CONN_URL || 'mongodb://localhost:27017/enigma-cms', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => {});

autoIncrement.initialize(conn);

const DocumentTypeSchema = new Schema({
  docTypeId: { type: Number },
  docTypeName: { type: String },
  docTypeNamePlural: { type: String },
  attributes: { type: [Object] },
  slugFrom: { type: String },
  rendered: { type: String }
});

DocumentTypeSchema.plugin(autoIncrementPlugin,
  { model: 'DocumentType', field: 'docTypeId', startAt: 0, incrementBy: 1 });

export default model('DocumentType', DocumentTypeSchema);
