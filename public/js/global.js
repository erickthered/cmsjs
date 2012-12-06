function addCommentDiv(comment, hidden) {
	commentElement = $('<div></div>');
	commentElement.addClass('comment');
	if (hidden) commentElement.addClass('hidden');

	commentAuthorElement = $('<div><p>By ' + comment.author + ', on ' + comment.postedOn + '<p></div>');
	commentAuthorElement.addClass('comment_author');

	//@todo. display this div only if logged in as an admin user
	// commentOptionsElement = $('<div><a href="#" onClick="removeComment(\''+ comment._id + '\');return false;">Delete</a></div>');
	// commentOptionsElement.addClass('comment_options');

	commentEmailElement = $('<div><strong>E-mail:</strong>' + comment.email + '</div>');
	commentEmailElement.addClass('comment_email');

	commentContentElement = $('<div>' + comment.content + '</div>');
	commentContentElement.addClass('comment_content');

	commentElement.append(commentAuthorElement);
	commentElement.append(commentOptionsElement);
	commentElement.append(commentEmailElement);
	commentElement.append(commentContentElement);

	$('#comments').prepend(commentElement);
}

function removeComment(commentid) {
	if (confirm('Are you sure you want to delete this comment?')) {
		$.get('/article/comment/delete/' + commentid,
			function(data) {
				populateComments();
			}
		);
	}
}

function populateComments(articleid) {
	if (!articleid) articleid = $('#article_id').val();
	$.get('/article/' + articleid + '/comments',
		function(data) {
			$('#comments').html('');
			if (data.result == 'success') {
				for (var i=0; i<data.data.length; i++) {
					addCommentDiv(data.data[i]);
				}
			}
		});
}