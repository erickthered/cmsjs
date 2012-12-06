var commentsLoaded = false;

$(document).ready(function() {
	var articleid = $('#article_id').val();
	if (!commentsLoaded) {
		populateComments(articleid);
		commentsLoaded = true;
	}
});