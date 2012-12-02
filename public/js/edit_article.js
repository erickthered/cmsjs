var _previewAutoUpdate;

function updatePreview() {
	if ($('#article_content').val() != '') {
		$.get('/markdown_parse', {data:$('#article_content').val()}, function(data) {
			if (data) {
				$('#preview').html(data);
			}
		});
	}
	if (_previewAutoUpdate) {
		clearInterval(_previewAutoUpdate);
	}
}

$(document).ready(function() {
	updatePreview();
	$('#article_content').keyup(function() {
		if (_previewAutoUpdate) {
			clearInterval(_previewAutoUpdate);
		}
		_previewAutoUpdate = setInterval(updatePreview, 1000);
	});
	$('#article_content').change(function() {
		updatePreview();
		return false;
	});
});