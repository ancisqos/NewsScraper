$(document).ready(function() {
  var articleContainer = $(".article-container");
  // Adding event listeners for dynamically generated buttons for deleting articles,
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  // initPage starts everything
  initPage();

  function initPage() {
    // Empties article container, runs AJAX request for saved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      // If we have headlines, render to page
      if (data && data.length) {
        renderArticles(data);
      }
      else {
        // Otherwise render message that we have no articles
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    // function handles appending HTML containing article data to page
    var articlePanels = [];
    // pass each article JSON object to the createPanel function
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    // append them to the articlePanels container
    articleContainer.append(articlePanels);
  }

  function createPanel(article) {
    // function takes in single JSON object for article/headline
    // constructs a jQuery element containing all of formatted HTML for article panel
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-info notes'>Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    // attach article's id tojQuery element
    panel.data("_id", article._id);
    // return constructed panel jQuery element
    return panel;
  }

  function renderEmpty() {
    // function renders HTML to page explaining we don't have any articles to view
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {
    // function handles rendering note list items to notes modal
    // Setting up an array of notes to render after finished
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      // If we have no notes, display a message explainng this
      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
      notesToRender.push(currentNote);
    }
    else {
      // If we do have notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs li element to contain our noteText and delete button
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>",
            "</li>"
          ].join("")
        );
        // Store the note id on delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    // function handles deleting articles/headlines
    // grab id of the article to delete from the panel element the delete button sits inside
    var articleToDelete = $(this).parents(".panel").data();

    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run initPage again which will rerender our list of saved articles
      if (data.ok) {
        initPage();
      }
    });
  }

  function handleArticleNotes() {
    // function handles opending notes modal and displaying notes
    // grab id of the article to get notes from the panel element the delete button sits in
    var currentArticle = $(this).parents(".panel").data();
    // Grab notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // Constructing initial HTML to add to notes modal
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      // Adding formatted HTML to note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      // Adding information about article and article notes to save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    // function handles what happens when a user tries to save a new note for an article
    // Setting a variable to hold some formatted data about our note
    // grabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
   
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    // function handles deletion of notes
    // grab the id of the note we want to delete
    var noteToDelete = $(this).data("_id");
    // Perform DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }
});
