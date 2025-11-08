// NodeUnit test file

// @todo, test main page contents
exports.testMainPage = function(test) {
    test.ok(true, "Main page loads OK.");
    test.done();
};

// @todo, test article view page
exports.testArticleView = function(test) {
    test.ok(true, "Article shows up correctly");
    test.done();
};

exports.group = {
	setUp : function(callback) {
		this.foo = 'bar';
		callback();
	},

	tearDown : function(callback) {
		// clean up
		callback();
	},

	// @todo, test admin section requires auth
	testAdmin : function(test) {
		test.ok(true, 'Admin section requires passwd');
		test.done();
	},

	// @todo, test create article route
	testArticleCreate : function(test) {
		test.ok(true, 'Create Article');
		test.done();
	},

	// @todo, test edit article route
	testArticleEdit : function(test) {
		test.ok(true, 'Edit Article');
		test.done();
	},

	// @todo, test delete article route
	estArticleDelete : function(test) {
		test.ok(true, 'Delete Article');
		test.done();
	},

	// @todo, test create comment route
	testCommentCreate : function(test) {
		test.ok(true, 'Create Comment');
		test.done();
	},

	// @todo, test delete comment route
	testCommentDelete : function(test) {
		test.ok(true, 'Delete Comment');
		test.done();
	}
}
