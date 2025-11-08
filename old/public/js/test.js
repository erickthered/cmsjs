$(document).ready( function() {
	$.getJSON('/test', function(data) {
		titleElement = $('<div>' + data.title + '</div>');
		titleElement.addClass('article_title');

		authorElement = $('<div>' + data.author + '</div>');
		authorElement.addClass('article_author');

		contentElement = $('<div>' + data.content + '</div>');
		contentElement.addClass('article_content');

		$('#article').append(titleElement);
		$('#article').append(authorElement);
		$('#article').append(contentElement);

		$.each(data.comments, function(key, comment) {
			$commentElement = $('<div></div>');
			$commentElement.addClass('comment');

			$commentAuthorElement = $('<div>' + comment.author + '</div>');
			$commentAuthorElement.addClass('comment_author');

			$commentContentElement = $('<div>' + comment.comment + '</div>');
			$commentContentElement.addClass('comment_content');

			$commentElement.append($commentAuthorElement);
			$commentElement.append($commentContentElement);

			$('#comments').append($commentElement);
		});
		$('.comment :even').css('background-color', '#ddf');
	});
});