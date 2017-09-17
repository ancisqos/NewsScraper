// controller for notes

const Note = require("../models/Note");
const makeDate = require("../scripts/date");

module.exports = {
  get: function(data, cb) {
    // Find all notes with headline id from article passed
    Note.find({
      _headlineId: data._id
    }, cb);
  },
  // Save note
  // Export function as "save" (data = note info, cb = callback)
  save: function(data, cb) {

    // Make a newNote with the note model, saving the apropos info
    const newNote = {
      _headlineId: data._id,
      date: makeDate(),
      noteText: data.noteText
    };

    // Save the newNote we made to mongoDB with mongoose's save function
    Note.create(newNote, function(err, doc) {
      // Log any errors
      if (err) {
        console.log(err);
      }
      // Or just log the doc we saved
      else {
        console.log(doc);
        // Place the log back in this callback function
        // so it can be used with other functions asynchronously
        cb(doc);
      }
    });
  },
  delete: function(data, cb) {
    // Remove a Note using mongoose and our note Model,
    // searching by the article's id
    Note.remove({
      _id: data._id
    }, cb);
  }
};