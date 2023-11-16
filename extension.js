// require('dotenv').config();
// console.log(process.env)
const vscode = require('vscode');
const mongoose = require('mongoose');
const path = require('path')

const uri = require('./app')
const onlineSchema = mongoose.Schema({
  id: Number,
  status: String,
  stat: Boolean,
  file: String
},{collection: 'StatusCheck'});
const onlineModel = mongoose.model('onlineSchema', onlineSchema);



async function activate(context) {
  await dbconnect();
  await clearDb();
  console.log('Extension activated.');
  
  // Your logic for setting the initial online status goes here
  setInitialOnlineStatus()

 
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(async (document) => {
      const fileName = path.basename(document.fileName);
      await onlineModel.findOneAndUpdate({id: 1}, {$set: {file: fileName}})
      console.log('Document opened:', fileName);
    })
  );
}

async function deactivate() {
  dbconnect();
  try {
    await onlineModel.findOneAndUpdate({ id: 1, status: 'Writing Code :)' }, { $set: { status: 'Not Writing Code :(' , stat: false} });
    console.log('Extension deactivated.'); // Log deactivation
  } catch (error) {
    console.error(error);
  }
}
// 
const clearDb = async () => {
  try {
    await onlineModel.deleteMany({});
    console.log('Database cleared.'); // Log clearing database
  } catch (err) {
    console.error('Error clearing database:', err);
  }
};
//
const dbconnect = async () => {
  try {
    await mongoose.connect(uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    console.log('Mongodb connected.'); // Log successful MongoDB connection
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

async function setInitialOnlineStatus() {
	try {
	  await onlineModel.create({ id: 1, status: 'Writing Code :)', stat: true });
	  console.log('Boom Online'); // Log initial status set
	} catch (error) {
	  console.error('Error setting initial online status:', error.message);
	}
  }
  

module.exports = {
  activate,
  deactivate
};
