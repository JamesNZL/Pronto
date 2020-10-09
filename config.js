'use strict';

const config = {
	prefix: '!',
	permsInt: 1879141584,
	dateOutput: 'HHMM "h" ddd, dd mmm yy',
	version: '2.0.4',
};

const ids = {
	serverID: '748336465465049230',
	devID: '192181901065322496',
	debugID: '758217147187986432',
	logID: '755289400954454047',
	attendanceID: '748360212754464779',
	recruitingID: '748516417137278985',
	newMembersID: '749150106669940748',
	archivedID: '760421058687139860',
	tacticalID: '748342934880911371',
	classroomID: '748677930778886144',
	visitorID: '748411879923253259',
	administratorID: '748346409853517896',
	formations: ['761143813632294963', '748341753249136672', '748341787336376370', '748342048788316181'],
	nonCadet: ['748411879923253259', '748343310124580894'],
	tacPlus: ['748340800093552731', '748337961321496637', '748338027402756142', '748337933194625104', '748346409853517896'],
	sgtPlus: ['748340611521839115', '748340221719871558', '748340045689389176', '750959240578859018', '748339616112836619', '748338095446949908', '748337933194625104', '748346409853517896'],
	cqmsPlus: ['748340045689389176', '748339616112836619', '748338095446949908', '748337933194625104', '748346409853517896'],
	adjPlus: ['748338095446949908', '748337933194625104', '748346409853517896'],
};

const emojis = {
	successEmoji: 'success',
	errorEmoji: 'error',
};

const colours = {
	default: 0x1b1b1b,
	pronto: 0xffd456,
	leave: 0xd31145,
	success: 0x45bb8a,
	warn: 0xffcc4d,
	error: 0xef4949,
};

module.exports = {
	config: config,
	ids: ids,
	emojis: emojis,
	colours: colours,
};