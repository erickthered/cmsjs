function addCommentDiv(comment, hidden, isLoggedIn) {
	commentElement = $('<div></div>');
	commentElement.addClass('hero');
	if (hidden) commentElement.addClass('hidden');

	commentRowElement = $('<div></div>');
	commentRowElement.addClass('row-fluid');

	commentGravatarElement = $('<div></div>');
	commentGravatarElement.addClass('span2');
	commentGravatarElement.html('<img src="http://www.gravatar.com/avatar/' + comment.gravatar + '"/>');
	commentRowElement.append(commentGravatarElement);

	commentContentElement = $('<div></div>');
	commentContentElement.addClass('span10');
	commentContentElement.html('<small>' + comment.author + '</small><br/><small>' + comment.postedOn + '</small><p>' + comment.content + '</p>');
	commentRowElement.append(commentContentElement);

	// commentEmailElement = $('<div><strong>E-mail:</strong>' + comment.email + '</div>');
	// commentEmailElement.addClass('comment_email');

	commentElement.append(commentRowElement);
	// commentElement.append(commentAuthorElement);
	if (isLoggedIn) {
		commentOptionsElement = $('<div><a href="#" onClick="removeComment(\''+ comment._id + '\');return false;">Delete</a></div>');
		commentOptionsElement.addClass('comment_options');
		commentElement.append(commentOptionsElement);
	}
	//commentElement.append(commentEmailElement);
	//commentElement.append(commentContentElement);

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
					addCommentDiv(data.data[i], false, data.isLoggedIn);
				}
			}
		});
}