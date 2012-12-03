function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
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
				$('#comment_form').submit();
			}
		} else {
			alert('All fields are required');
		}
	});
});