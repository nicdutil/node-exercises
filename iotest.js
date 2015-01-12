var fs = require('fs'),
	assert = require('assert'); // for sanity checks


// helper function that runs iterator in parallax
// calls callback function after error or after 
// all the iterators have runned to completion
function asyncEach(arr, iterator, callback) {
	callback = callback || function() {};

	assert.equal(arr instanceof Array, true, 'arr should be an array');

	var completed = 0;

	function done(err) {
		if (err) {
			callback(err);
			callback = function() {};
		} else if (++completed >= arr.length) {
			callback();
		}
	}

	arr.some(function(value, index) {
		iterator(value, done);
	});
};



function report(test, err) {
	if (err) {
		console.log('IOTest:' + test + ' operation finished with some errors.')
		console.log(err);
	} else {
		console.log('IOTest:' + test + ' operation finished without errors.');
	}
};


function IOTest(fileCount, fileSize) {
	this.fileCount = fileCount;
	this.fileSize = fileSize * 1024; // in KB
	this.filePrefix = 'IOSeqWrite-';
	this.fd = {};
	this.filenames = [];

	for (i = 0; i < this.fileCount; i++) {
		this.filenames[i] = this.filePrefix + i;
	};
};



IOTest.prototype.create = function() {
	var fileNames = [];

	console.log('IOTest:' + 'Starting create operation');
	function createFile(item, callback) {
		fs.open(item, 'wx+', function(err, fd) {
			if (err) {
				callback(err);
			} else {
				this.fd[item] = fd;
				callback();
			}
		}.bind(this));
	};

	// create the filenames before calling fs.open
	asyncEach(this.filenames, createFile.bind(this), function(err) { report('create', err); });
};

IOTest.prototype.clean = function() {
	console.log('IOTest:' + 'Starting clean operation');
	function deleteFile(item, callback) {
		fs.unlink(item, function(err) {
			if (err) {
				callback(err);
			} else {
				callback();
			}
		});
	}

	asyncEach(this.filenames, deleteFile, function(err) { report('clean', err); });
};

IOTest.prototype.run = function(args) {
	args.some(function(test, index) {
		switch (test) {
			case 'clean':
				this.clean();
				break;
			case 'create':
				this.create();
				break;
			case 'write':
				break;
			case 'read':
				break;
			default:
				console.log('Invalid type of test');
				return true;
		}
	}.bind(this));
};

(function main() {
	var testCmd = [];
	process.argv.forEach(function(val, index, array) {
		if (index > 1) {
			testCmd.push(val);
		}
	});
	test = new IOTest(1000, 4);

	test.run(testCmd);
})();


