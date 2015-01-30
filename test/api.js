var should = require('should');
var request = require('request');

var base = 'http://localhost:3000/api/1.0';

describe('POST /users', function() {
	it('should create a new user without error', function(done) {
		request.post(base+'/users/new', {form: {username: 'beyonce'}},
			function(error, response, body) {
				if(error) { return done(error); }
				JSON.parse(body).status.should.equal('success');
				done();
			});
	});
	it('should be able to create more than one unique user', function(done) {
		request.post(base+'/users/new', {form: {username: 'kanye'}},
			function(error, response, body) {
				if(error) { return done(error); }
				JSON.parse(body).status.should.equal('success');
				done();
			});
	});
	it('should not create a user with a username that exists', function(done) {
		request.post(base+'/users/new', {form: {username: 'beyonce'}},
			function(error, response, body) {
				if(error) { return done(error); }
				JSON.parse(body).status.should.equal('tryAgain');
				done();
			});
	});
});

describe('POST /:user/event', function() {
	it('should create a properly formatted event without error', function(done) {
		request.post(base+'/beyonce/event', {form: {
			name: 'Surfboarding',
			location: 'Instagram',
			date: '01-08-2014',
			start: '09:00',
			end: '13:00'
		}},
			function(error, response, body) {
				if(error) { return done(error); }
				JSON.parse(body).status.should.equal('success');
				done();
			});
	});
	it('should not create an event with incorrect formatting', function(done) {
		request.post(base+'/beyonce/event', {form: {
			name: 'Snowboarding',
			location: 'Twitter',
			date: '1-08-2014',
			start: '9:00',
			end: '1:00'
		}},
			function(error, response, body) {
				if(error) { return done(error); }
				JSON.parse(body).status.should.equal('badDateFormat');
				done();
			});
	});
});

describe('PUT /:user/edit', function() {
	it('should give a user a new username', function(done) {
		request.put(base+'/kanye/edit', {form: {newname: 'jay-z'}},
			function(error, response, body) {
				if(error) { return done(error); }
				JSON.parse(body).status.should.equal('success');
				done();
			});
	});
	it('should not change a usernmae to an existing username', function(done) {
		request.put(base+'/beyonce/edit', {form: {newname: 'jay-z'}},
			function(error, response, body) {
				if(error) { return done(error); }
				JSON.parse(body).status.should.equal('tryAgain');
				done();
			});
	});
});

describe('DELETE /:user/remove', function() {
	it('delete any user', function(done) {
		request.del(base+'/jay-z/remove', function(error, response, body) {
			if(error) { return done(error); }
			JSON.parse(body).status.should.equal('success');
			done();
		});
	});
});