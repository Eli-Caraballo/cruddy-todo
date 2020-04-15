const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, num) => {
    fs.writeFile(path.join(exports.dataDir, `${num}.txt`), text, (err) => {
      if (err) {
        console.log ('err: ' + err);
      } else {

        callback(null, { id: num, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      console.log ('error in readAll: ' + err);
      callback(err);
    } else {
      callback(null, data.map((file) => {
        //call readOne on each of the files
        var id = file.substring(5, -1);
        var text = fs.readFileSync(path.join(exports.dataDir, file));
        return {id: id, text: text.toString()};
      }));
    }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
    if (err) {
      console.log ('readOne error: ' + err);
      callback(err, text);
    } else {
      callback(null, {id, text: text.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err, data) => {
    if(err){
      console.log ('update error: ' + err);
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if(err){
          console.log ('update error: ' + err);
          callback(err);
        } else {
          callback(null, {id: id, text: text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
    if(err){
      console.log('delete error: ' + id);
      callback(err);
    } else {
      callback(null, id);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
