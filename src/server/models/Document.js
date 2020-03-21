import mongoose, { Schema, model } from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';
import ReverseIndex from './ReverseIndex.js';
import DocumentDisplayTemplate from './DocumentDisplayTemplate.js';
import User from './User';
import DocumentType from './DocumentType';
import createReverseIndex from '../utils/create_reverse_index';
import renderMarkup from '../utils/render_markup';
import { documentMetadataSync } from '../utils/render_metadata';
import fs from 'fs';
import path from 'path';

var conn = mongoose.createConnection(
  require('../../../config/db.js').url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => { });

autoIncrement.initialize(conn);

const DocumentSchema = new Schema({
  docTypeId: { type: Number },
  docNodeId: { type: Number },
  creatorId: { type: Number },
  createdAt: { type: Date },
  editorId: { type: Number },
  editedAt: { type: Date },
  content: { type: Object },
  slug: { type: String },
  draft: { type: Boolean },
  rendered: { type: String }
});

DocumentSchema.plugin(autoIncrementPlugin,
  { model: 'Document', field: 'docNodeId', startAt: 0, incrementBy: 1 });

DocumentSchema.pre('save', async function saveHook(next) {
  const doc = this, { docNodeId, docTypeId,
      createdAt, editedAt, creatorId, content } = doc,
    thaMap = {};

  let { templateBody } = await DocumentDisplayTemplate.findOne({ docTypeId });

  let authorInfo = await User.findOne({ userId: creatorId });

  doc.rendered = await renderMarkup(templateBody, {
    createdAt, editedAt, creatorId, ...content, authorInfo
  });

  for (let attribute in content) {
    if (attribute !== '') {
      if (typeof content[attribute] === 'string') {
        let map = createReverseIndex(content[attribute]);

        for (let str in map) {
          if (!thaMap[str]) thaMap[str] = [];
          thaMap[str].push({ attribute, columns: map[str] });
        }
      }
    }
  }

  for (let string in thaMap) {
    await ReverseIndex.findOne({ string }).then(index => {
      if (index) {
        let i = index.where.findIndex(doc => doc.docNodeId === docNodeId);
        if (i <= -1) {
          index.where.set(index.where.length, {
            docNodeId,
            locations: thaMap[string]
          });
        }
        else {
          index.where.set(i, {
            docNodeId,
            locations: thaMap[string]
          });
        }
      }
      else index = new ReverseIndex({
        string, where: [
          {
            docNodeId,
            locations: thaMap[string]
          }
        ]
      });

      index.save();
    });
  }
  DocumentType.findOne({ docTypeId: doc.docTypeId }).then(({ docTypeNamePlural }) => {
    let data = { rendered: doc.rendered, metadata: documentMetadataSync(doc.content) };
    fs.writeFileSync(path.join(__dirname, `documents/${docTypeNamePlural}/${doc.slug}.enigma`), JSON.stringify(data));
  });
  if (next && typeof next === 'function') return next();
  return;
});

export default model('Document', DocumentSchema);
