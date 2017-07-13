'use strict';

function changeDisplay(value, language, status, display) {
	switch (display) {
		case 'theme':
			window.location = '../' + '../' + value + '/' + language + '/' + status;
			break;
		case 'language':
			window.location = '../' + value + '/' + status;
			break;
		case 'alphabet':
			changeThemeDirectories(value);
			break;
		case 'state':
			window.location = '../' + language + '/' + value;
			break;
		default:
			window.location = 'loggedtest';
	}
}

function matchUrl(url, language, company, status) {
	if (url !== '/' + company + '/' + language + '/') {
		var newLanguage = url.split('/')[2];
		var newStatus = url.split('/')[3];
		window.location = '../' + newLanguage + '/' + newStatus;
	}
}

function changeThemeDirectories(alphabet) {
	window.location = '/themes/_alphabet/'+alphabet+'/logged-out';
}

function downloadZip(src) {
	var ifrm = document.createElement('iframe');
	ifrm.setAttribute('src', src);
	document.body.appendChild(ifrm);
	$(ifrm).on('load', function() {
		$(this).remove();
	});
}
