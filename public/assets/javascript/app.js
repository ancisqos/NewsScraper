$(document).ready(function(){

  // Nav Bar Mobile Slider
  $(".button-collapse").sideNav();

    // Get Form Data by Id
    var frmName = "form-add-" + articleId;
    var frm = $('#' + frmName);


    // AJAX Call to add Comment
    $.ajax({
      url: baseURL + '/add/comment/' + articleId,
      type: 'POST',
      data: frm.serialize(),
    })
    .done(function() {
      // Refresh the Window after the call is done
      location.reload();
    });
    
    // Prevent Default
    return false;

  });


  // Click Listener for FORM SUBMISSION to DELETE a comment
  $('.delete-comment-button').on('click', function(){

    // Get _id of comment to be deleted
    var commentId = $(this).data("id");

    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
    .done(function() {
        });
    
    // Prevent Default
    return false;

  });
  
});