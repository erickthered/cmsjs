function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function addCommentDiv(comment) {
	commentElement = $('<div></div>');
	commentElement.addClass('comment');

	commentAuthorElement = $('<div><p>By ' + comment.author + ', on ' + comment.postedOn + '<p></div>');
	commentAuthorElement.addClass('comment_author');

	commentEmailElement = $('<div><strong>E-mail:</strong>' + comment.email + '</div>');
	commentEmailElement.addClass('comment_email');

	commentContentElement = $('<div>' + comment.content + '</div>');
	commentContentElement.addClass('comment_content');

	commentElement.append(commentAuthorElement);
	commentElement.append(commentEmailElement);
	commentElement.append(commentContentElement);

	$('#comments').prepend(commentElement);
}

$(document).ready(function() {
	$('#comment_submit').click(function() {
		var isValid = $('#comment_author').val() != '';
		isValid = isValid && $('#comment_email').val() != '';
		isValid = isValid && $('#comment_content').val() != '';

		if (isValid) {
			if (!validateEmail($('#comment_email').val())) {
				alert('Please check the email address!');
				isValid = false;
			} else {
				$.post('/article/comment/save', {
						comment: {
							author : $('#comment_author').val(),
							email : $('#comment_email').val(),
							content : $('#comment_content').val(),
							article : $('#comment_article').val()
						}
					}, function(data) {
						if (data.result == 'success') {
							addCommentDiv(data.data[0]);
							$('#comment_author').val('');
							$('#comment_email').val('');
							$('#comment_content').val('');
							alert('You comment has been posted!');
						} else {
							alert("There's been an error posting your comment");
						}
					},
					'json'
				); 
				//$('#comment_form').submit();
			}
		} else {
			alert('All fields are required');
		}
	});
});