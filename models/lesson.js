'use strict';

const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	lessonID: String,
	lessonName: String,
	instructors: Object,
	dueDate: String,
	dueTimestamp: Number,
	lessonDate: String,
	lessonTimestamp: Number,
	assignedResources: Array,
	submittedResources: Array,
	archiveID: String,
	submitted: { type: Boolean, default: false },
	approved: { type: Boolean, default: false },
	changed: { type: Boolean, default: false },
});

module.exports = mongoose.model('lesson', lessonSchema, 'lessons');