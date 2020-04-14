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
        // console.log ('not error?');
        callback(null, { id: num, text: text });
      }
    });
  });
};

exports.readAll = (callback) => {
  //get a list of files

  fs.readdir(exports.dataDir, (err, data) => {
    console.log ('files next:');
    console.log (data);
    if (err) {
      console.log ('error in readAll: ' + err);
    } else {
      callback(null, data.map((file) => {
        //call readOne on each of the files
        var id = file.substring(5, -1);
        var text = exports.readOne(id, (err, data) => data[text]);
        return {id: id, text: text};
        // var text;
        // fs.readdir(path.join(exports.dataDir, file), (err, data) => {
        //   text = data;
        // });
      }));
    }
  });
//Expected: [{ id: '00001', text: 'todo 1' }, { id: '00002', text: 'todo 2' }]
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
    if (err) {
      console.log ('readOne error: ' + err);
      callback(err, text);
    } else {
      console.log(text.toString());
      callback(null, {id, text: text.toString()});
    }
  });


  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
