import mongoose from 'mongoose';
import autoIncrement, { plugin as autoIncrementPlugin } from
  'mongoose-auto-increment';

var conn = mongoose.createConnection(require('../../../config/db.js').url, {
}, (err) => {
  if (!err) console.log('connection succesful');
  else console.error(err);
});

autoIncrement.initialize(conn);

var RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  roleId: {
    type: Number
  }
});

RoleSchema.plugin(autoIncrementPlugin,
  { model: 'Role', field: 'roleId', startAt: 0, incrementBy: 1 });

export default mongoose.model('Role', RoleSchema);
