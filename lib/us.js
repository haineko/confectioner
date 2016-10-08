var us_msg = {missing: "Не задано обязательное поле: \"%s\"", invalid: "Недопустимое значение поля: \"%s\"", email_or_phone: "Не задан ни email, ни телефон", no_list_ids: "Не выбрано ни одного списка рассылки"};
function us_onLoadImpl() {
	us_autodetectCharset();
}
var us_onLoadOld = null;
var us_onLoadCalled = false;

function us_onLoad() {
	us_onLoadImpl();
	us_onLoadCalled = true;
	if (us_onLoadOld) {
		us_onLoadOld();
	}
}

us_onLoadOld = window.onload;
window.onload = us_onLoad;

function us_autodetectCharset() {
	var d = document;
	var f = d.getElementById('us_form');
	var ee = f.getElementsByTagName('input');
	for (var i = 0;  i < ee.length;  i++) {
		var e = ee[i];
		if (e.getAttribute('name') == 'charset') {
			if (e.value == '') {
				// http://stackoverflow.com/questions/318831
				e.value = d.characterSet ? d.characterSet : d.charset;
			}
			return;
		}
	}
}

function us_onSubmit() {
	if (!us_onLoadCalled) {
		alert('us_onLoad() has not been called')
		return false;
	}

	function trim(s) {
		return s == null ? '' : s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	}

	var d = document;
	var f = d.getElementById('us_form');
	if (!f) {
		alert('Internal error: form not found.');
		return false;
	}
	
	var ee, i, e, n, v, r, k, b1, b2;
	var hasEmail = false;
	var hasPhone = false;

	ee = f.getElementsByTagName('input');
	for (i = 0;  i < ee.length;  i++) {
		e = ee[i];
		n = e.getAttribute('name');
		if (!n || e.getAttribute('type') != 'text') {
			continue;
		}

		v = trim(e.value);
		if (v == '') {
			k = e.getAttribute('_required');
			if (k == '1') {
				alert(us_msg['missing'].replace('%s', e.getAttribute('_label')));
				e.focus();
				return false;
			}
			continue;
		}

		if (n == 'email') {
			hasEmail = true;
		} else if (n == 'phone') {
			hasPhone = true;
		}
		
		k = e.getAttribute('_validator');
		r = null;
		switch (k) {
			case null:
			case '':
				break;
			case 'email':
				// TODO Provide regexps from PHP code (add getEmailValidationRegexp_forJavascript() to functions.php).
				r = /^[a-zA-Z0-9_+=-]+[a-zA-Z0-9\._+=-]*@[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9]([a-zA-Z0-9-]+))*\.([a-zA-Z]{2,6})$/;
				break;
			case 'phone':
				r = /^[\d +()\-]{7,32}$/;
				break;
			case 'float':
				r = /^[+\-]?\d+(\.\d+)?$/;
				break;
			default:
				alert('Internal error: unknown validator "' + k + '"');
				e.focus();
				return false;
		}
		if (r && !r.test(v)) {
			alert(us_msg['invalid'].replace('%s', e.getAttribute('_label')));
			e.focus();
			return false;
		}
	}

	if (!hasEmail && !hasPhone) {
		alert(us_msg['email_or_phone']);
		return false;
	}

	ee = f.getElementsByTagName('input');
	b1 = false;
	b2 = false;
	for (i = 0;  i < ee.length;  i++) {
		e = ee[i];
		if (e.getAttribute('name') != 'list_ids[]') {
			continue;
		}
		b1 = true;
		if (e.checked) {
			b2 = true;
			break;
		}
	}
	if (b1 && !b2) {
		alert(us_msg['no_list_ids']);
		return false;
	}

	return true;
}
