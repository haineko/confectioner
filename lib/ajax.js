/**
* HostCMS
*
* @author Hostmake LLC, http://www.hostcms.ru/
* @version 5.x
*/

if (typeof HostcmsEscape == 'undefined')
{
	// ��������� ����������� ������� escape()
	//var escapeOrig = window.escape;

	// �������������� ������� escape()
	//window.escape = function(str)
	function HostcmsEscape(str)
	{
		// �������������� ������� ��������
		var trans = [];

		for (var i = 0x410; i <= 0x44F; i++)
		{
			trans[i] = i - 0x350; // �-��-�
		}

		trans[0x401] = 0xA8; // �
		trans[0x451] = 0xB8; // �
		
		var ret = [];
		// ���������� ������ ����� ��������, ������� ��������� ���������
		for (var i = 0; i < str.length; i++)
		{
			var n = str.charCodeAt(i);

			if (typeof trans[n] != 'undefined')
			{
				n = trans[n];
			}
			if (n <= 0xFF)
			{
				ret.push(n);
			}
		}

		var res = escape(String.fromCharCode.apply(null, ret)).replace('+','%2B').replace(':','%3A').replace('/','%2F').replace('?','%3F').replace('=','%3D').replace('&','%26').replace('@','%40').replace('#','%23').replace('$','%24').replace(';','%3B');

		return res;
	}
}

// ������� - ������� �������.
document.onkeydown = DoKeyDown;

// ���������������� ���������� ������� ������� ������,
// ��� ��������� Ctrl + �������.
function DoKeyDown(event)
{
	if (!document.getElementById)
	{
		return;
	}

	if (window.event)
	{
		event = window.event;
	}

	if (event.ctrlKey)
	{
		var Element = null;

		switch (event.keyCode ? event.keyCode : event.which ? event.which : null)
		{
			case 0x25: // �����
			Element = document.getElementById ('id_prev');
			break;

			case 0x27: // ������
			Element = document.getElementById ('id_next');
			break;
		}

		if (Element && Element.href)
		{
			// �������� �� ������ ��������.
			document.location = Element.href;
		}
	}
}

function DisableTinyMCE()
{
	// ������ � ���������� ���������� ����, ���� ������ ������ ��� form_html
	if (typeof tinyMCE != 'undefined')
	{
		textarea_array = document.getElementsByTagName("textarea");

		for (var i=0; i < textarea_array.length; i++)
		{
			var elementId = textarea_array[i].id;

			if (tinyMCE.getInstanceById(elementId) != null)
			{
				textarea_array[i].disabled = true;
				tinyMCE.execCommand('mceRemoveControl', false, elementId);
			}
		}
	}
}

// ��������� ������� �� ����������� ������ �� �������
function runScripts(scripts)
{
	if (!scripts)
	{
		return false;
	}

	for (var i = 0; i < scripts.length; i++)
	{
		var thisScript = scripts[i];
		var text;

		if (thisScript.src)
		{
			var newScript = document.createElement("script");
			newScript.type = thisScript.type;
			newScript.language = thisScript.language;

			newScript.src = thisScript.src;
			document.getElementsByTagName('head')[0].appendChild(newScript);

			// �������� ������, � �������� �������� �������
			//var obj = document.getElementsByTagName('body')[0];
			//var obj = document.getElementById('id_form_' + AAdminFromsId);
			//obj.appendChild(newScript);
		}
		else if (text = (thisScript.text || thisScript.innerHTML))
		{
			var text = (""+text).replace(/^\s*<!\-\-/, '').replace(/\-\->\s*$/, '');

			var newScript = document.createElement("script");
			newScript.setAttribute("type", "text/javascript");
			newScript.text = text;

			var script_node = document.getElementsByTagName('head')[0].appendChild(newScript);

			// �� �������� � IE, � ��� �������� newScript.text = text;
			//script_node.appendChild(document.createTextNode(text));
		}
	}
}

// action - ����� �������� ��� ������
// method - GET, POST, null - �������������� �����������
// callback_function - ������� ��������� ������, ������� ����� ������� ����� ��������� ������ �� backenad-�
function sendRequest(action, method, callback_function)
{
	var req = new JsHttpRequest();

	// ���������� ����� ��������
	ShowLoadingScreen();

	// ���� ��� ��������� �������������, ����� �������� ������ ����������.
	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			// ������� ����������.
			HideLoadingScreen();

			if (typeof callback_function != 'undefined')
			{
				callback_function(req.responseJS);
			}

			return true;
		}
	}

	req.open(method, action, true);

	// �������� ������ � ����������.
	req.send(null);

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";
}

//�������� �����
//AAction - ������������� ����� �����, ������� ����� ��������
//AAdditionalParams - ������� ���������, ������������ � ������ �������. ������ ���������� � &
//AAdminFromsId - ������������� ����� ������ �����������������
//AOperation - ��� �������
//ALimit - ������� ��������, false - �� ���������� ��������
//AOnPage - ����� ��������� �� ��������
//AOrderFieldId - ID ����, �� �������� ���� ����������
//AOrderDirection - ����������� ����������, 1 - �� �����������, 2 - �� ��������
function DoLoadAjax(AAction, AAdditionalParams, AAdminFromsId, AOperation, ALimit, AOnPage, AOrderFieldId, AOrderDirection)
{
	// ��������� ����� � �����������
	DisableTinyMCE();

	if (AOperation == '')
	{
		return false;
	}

	// ���� ���� ���������� ���� ������� - ��������� ���� � ����������� ����������
	if (AOrderFieldId != 0)
	{
		sOrder = '&order_field_id=' + AOrderFieldId +
		'&order_field_direction=' + AOrderDirection;
	}
	else
	{
		sOrder = '';
	}

	// ����� �������� �� ��������.
	cbOnPage = document.getElementById('id_on_page');

	if (AOnPage)
	{
		sOnPage = '&admin_forms_on_page=' + AOnPage;
	}
	else
	{
		if (cbOnPage)
		{
			sOnPage = '&admin_forms_on_page=' + cbOnPage.options[cbOnPage.selectedIndex].value;
		}
		else
		{
			sOnPage = '';
		}
	}

	// ������ ������� � ���������� ���������� � �� ����������.
	sElements = '';
	sFilter = '';

	// ��� ���������� �������������� ���� �������
	reg_filter = /admin_form_filter_.+/;

	element_array = document.getElementsByTagName("input");
	if (element_array.length > 0)
	{
		for (var i = 0; i < element_array.length; i++)
		{

			element_name = element_array[i].getAttribute('name');

			if (element_name == undefined)
			{
				continue;
			}

			// ���������� ������� �� ������ ��� ��������������.
			if (element_name.search("check_") != -1 &&
			element_name.search("_fv_") == -1)
			//element_name.search("field_value") == -1)
			{
				if (element_array[i].checked)
				{
					sElements = sElements + '&' + element_name + '=1';

					// ���� �������� �������.
					value_element_array = document.getElementsByTagName("input");
					if (value_element_array.length > 0)
					{
						for (var j = 0; j < value_element_array.length; j++)
						{
							value_element_name = value_element_array[j].name;

							if (typeof value_element_name == 'undefined')
							{
								continue;
							}

							// ���������, �������� �� � ���� ��� �������� ��� ������.
							//if (value_element_name.search("field_value") != -1 &&
							if (value_element_name.search("_fv_") != -1 &&
							value_element_name.search(element_name) != -1)
							{
								if (value_element_array[j].getAttribute('type') == 'text')
								{
									sElements = sElements + '&' + value_element_name +
									'=' + value_element_array[j].value;
								}
								else if (value_element_array[j].getAttribute('type') == 'checkbox')
								{

									if (value_element_array[j].checked)
									{

										sElements = sElements + '&' + value_element_name + '=1';
									}
									else
									{

										sElements = sElements + '&' + value_element_name + '=0';
									}
								}
							}
						}
					}

					// ���� �������� ������� ��� select-��
					value_element_array = document.getElementsByTagName("select");
					if (value_element_array.length > 0)
					{
						for (var j = 0; j < value_element_array.length; j++)
						{
							value_element_name = value_element_array[j].name;

							if (typeof value_element_name == 'undefined')
							{
								continue;
							}

							// ���������, �������� �� � ���� ��� �������� ��� ������.
							//if (value_element_name.search("field_value") != -1 &&
							if (value_element_name.search("_fv_") != -1 &&
							value_element_name.search(element_name) != -1)
							{
								sElements = sElements + '&' + value_element_name +
								'=' + HostcmsEscape(value_element_array[j].options[value_element_array[j].selectedIndex].value);
							}
						}
					}
				}
			}

			// ����� ���� ��� ������� �������?
			if (reg_filter.test(element_name))
			{
				// ���������� � ������������ ������, ������ ���� �������� ������� �� 255 ��������
				if (element_array[i].value.length < 256)
				{
					sFilter = sFilter + '&' + element_name + '=' + HostcmsEscape(element_array[i].value);
				}
			}
		}
	}

	// Select-� �� �������
	element_array = document.getElementsByTagName("select");
	if (element_array.length > 0)
	{
		for (var i = 0; i < element_array.length; i++)
		{
			element_name = element_array[i].getAttribute('name');

			// ����� ���� ��� ������� �������?
			if (reg_filter.test(element_name))
			{
				// ���������� � ������������ ������
				sFilter = sFilter + '&' + element_name + '=' + HostcmsEscape(element_array[i].value);
			}
		}
	}

	// ������ ������� ������ ����� ���������� � ������.
	sParams = AAdditionalParams;

	// ������� ��������.
	//ALimit = '&limit=' + ALimit;

	//if (ALimit == 0)
	if (ALimit === false)
	{
		ALimit = '';
	}
	else
	{
		ALimit = '&limit=' + ALimit;
	}

	cmsrequest = AAction + '?admin_forms_id=' + AAdminFromsId +
	'&hostcmsAAction=' + HostcmsEscape(AAction) +
	'&hostcmsAAdditionalParams=' + HostcmsEscape(AAdditionalParams) +
	'&operation=' + AOperation + ALimit + sOnPage + sFilter +
	sElements + sOrder + sParams;

	if (cmsrequest.length < 2000)
	{
		method = 'get';
	}
	else
	{
		method = 'post';
	}

	// ���������� ������ backend-�
	sendRequest(cmsrequest, method, callbackfunction_DoLoadAjax);
}

// ������� ��������� ������ ��� DoLoadAjax
function callbackfunction_DoLoadAjax(responseJS)
{
	// ��������� ������
	sended_request = false;

	//if (typeof responseJS != 'undefined')
	if (responseJS != null)
	{
		if (typeof responseJS.error != 'undefined')
		{
			var div_id_message = document.getElementById('id_message');

			if (div_id_message)
			{
				div_id_message.innerHTML = responseJS.error;
			}
		}

		// ������.
		if (typeof responseJS.form_html != 'undefined')
		{
			// ��������� ������� ����
			// ������ Location ������ ��� DoLoadAjax, ���� ��������� ����� - �� ������
			if (cmsrequest != ''
			&& function_exists('getCmsUrl')
			&& getCmsUrl() != cmsrequest)
			{
				setLocation(cmsrequest);
			}

			if (function_exists('saveLocation'))
			{
				// ��������� ������� ���� ������
				saveLocation(getCmsUrl());
			}

			// ��������� ����� � �����������
			DisableTinyMCE();

			html = responseJS.form_html;

			document.getElementById('id_content').innerHTML = html;

			// ��������� ������� �� ����������� � ������� HTML-�
			runScripts(document.getElementById('id_content').getElementsByTagName('SCRIPT'));

			// ���������� cmsrequest
			cmsrequest = '';
		}

		// Title.
		if (typeof responseJS.title != 'undefined' && responseJS.title != '')
		{
			document.title = responseJS.title;
		}

		// ��������.
		if (typeof responseJS.redirect != 'undefined')
		{
			if (responseJS.redirect != '')
			{
				ShowLoadingScreen();
				location = responseJS.redirect;
			}
		}
	}
}

//�������� ����� ������� Get ��� Post
//AAction - ������������� ����� �����, ������� ����� ��������
//AAdditionalParams - ������� ���������, ������������ � ������ �������. ������ ���������� � &
//ButtonObject - ������ ������� ������
//AAdminFromsId - ������������� ����� ������ �����������������
function doSendForm(AAction, AAdditionalParams, ButtonObject, AAdminFromsId, AOperation, ALimit, AOnPage)
{
	// ������ ������������ ����� �� ���������
	var FormNode = ButtonObject.parentNode;

	// ���� ������������ ����� �� �������� ������
	while (FormNode.nodeName.toLowerCase() != 'form')
	{
		var FormNode = FormNode.parentNode;
	}

	// ������� ID ����� (�� ������ � ID ����� ������ �����������������)
	FormID = FormNode.id;

	// �������� �������� ������� ������ ��� input-�
	var HiddenInput = document.getElementById(ButtonObject.name);

	// �������� ���, ������� ���
	if (null == HiddenInput && undefined == HiddenInput || HiddenInput.type != 'hidden')
	{
		// �������� ������ input, �.�. ������� �� ���������� � �����
		var ElementInput = document.createElement("input");
		ElementInput.setAttribute("type", "hidden");
		ElementInput.setAttribute("id", ButtonObject.name);
		ElementInput.setAttribute("name", ButtonObject.name);

		// ������� ������� Input � �����
		var InputNode = FormNode.appendChild(ElementInput);
	}

	// �������� �� ���������� ���������� ������
	if (typeof tinyMCE != 'undefined')
	{
		tinyMCE.triggerSave();
	}

	var JsHttpRequestSendForm = new JsHttpRequest();

	// ��� ����������, ����� �������� ���������
	JsHttpRequestSendForm.onreadystatechange = function ()
	{
		if (JsHttpRequestSendForm.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			// ������� ����������.
			HideLoadingScreen();

			if (typeof JsHttpRequestSendForm.responseJS != 'undefined')
			{
				// ������� ��������� ������ � ����������.
				if (typeof JsHttpRequestSendForm.responseJS.error != 'undefined')
				{
					var div_id_message = document.getElementById('id_message');

					if (div_id_message)
					{
						// �������� ������� SPAN ��� IE, � ������� �������� ����� + ������.
						// ���� ����� <script> �� ����� ������, ��������� IE �� ������ SCRIPT
						var span = document.createElement("span");
						span.style.display = 'none';
						span.innerHTML = "Stupid IE. " + JsHttpRequestSendForm.responseJS.error;

						runScripts(span.getElementsByTagName('SCRIPT'));

						// ������� ����� ��������� ������ ����� ���������� �������
						div_id_message.innerHTML = JsHttpRequestSendForm.responseJS.error;
					}
				}

				// ������ ���������� ������ �����, ���� ��� ���� � �� ������.
				if (typeof JsHttpRequestSendForm.responseJS.form_html != 'undefined' && JsHttpRequestSendForm.responseJS.form_html != '')
				{
					// ��������� ����� � �����������
					DisableTinyMCE();

					// � ���������� ������� ��� �� ����� ���������� ��������� �������� �����,
					// ������� ���� ����� ��������� ������ - ��������� ����.
					HideWindow(prev_window);

					/*html = JsHttpRequestSendForm.responseJS.form_html;

					document.getElementById('id_content').innerHTML = html;

					// ��������� ������� �� ����������� � ������� HTML-�
					runScripts(document.getElementById('id_content').getElementsByTagName('SCRIPT'));*/

				}
			}
			return true;
		}
	}

	// ��������� action � �����
	//var FormAction = FormNode.getAttribute('action');
	// fix bug with IE 6 and getAttribute('') return [object]
	var FormAction = FormNode.attributes['action'].value;

	// ��������� ����� �����
	var FormMethod = FormNode.getAttribute('method');

	if (AOnPage)
	{
		sOnPage = '&admin_forms_on_page=' + AOnPage;
	}
	else
	{
		sOnPage = '';
	}

	// ������� ��������.
	if (ALimit == 0)
	{
		ALimit = '';
	}
	else
	{
		ALimit = '&limit=' + ALimit;
	}

	// �������� ���������� AAdditionalParams ������� ����, � �� ����� hostcmsAAdditionalParams
	FormAction += (FormAction.indexOf('?') >= 0 ? '&' : '?') + 'hostcmsAAction=' + HostcmsEscape(AAction) +
	'&hostcmsAAdditionalParams=' + HostcmsEscape(AAdditionalParams) + AAdditionalParams +
	'&operation=' + AOperation + ALimit + sOnPage;

	// Prepare request object (automatically choose GET or POST).
	JsHttpRequestSendForm.open(FormMethod, FormAction, true);

	JsHttpRequestSendForm.send( { query: FormNode } );

	// ������� ���� ��� ���������
	var div_id_message = document.getElementById('id_message');

	if (div_id_message)
	{
		div_id_message.innerHTML = '';
	}

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";

	// ���������� ����� ��������
	ShowLoadingScreen();

	return false;
}


//������� ��������� �������, ������� ��������� ���� checkbox'�� ����� �������.
//AAction - ������������� ����� �����, ������� ����� ��������
//AAdditionalParams - ������� ���������, ������������ � ������ �������. ������ ���������� � &
//AOperation - �������� �������
//AItemName - ������� ��� ��������, ��� ������� ������������ ��������
//AAdminFromsId - ������������� �����
//ALimit - ������� ��������
//AOnPage - ����� ��������� �� ��������
//AOrderFieldId - ID ����, �� �������� ���� ����������
//AOrderDirection - ����������� ����������, 1 - �� �����������, 2 - �� ��������
function TrigerSingleAction(AAction, AAdditionalParams, AOperation, AItemName, AAdminFromsId, ALimit, AOnPage, AOrderFieldId, AOrderDirection)
{
	var ElementID = 'id_' + AItemName;

	cbItem = document.getElementById(ElementID);

	if (cbItem)
	{
		// �������� ��� input-�
		element_array = document.getElementsByTagName("input");

		// ���� �������� ���� �� ����
		if (element_array.length > 0)
		{
			// ���������� �� ������
			for (var i = 0; i < element_array.length; i++)
			{
				if (element_array[i].getAttribute('name') == null)
				{
					continue;
				}

				if (element_array[i].getAttribute('name').search("check_") != -1
				&& element_array[i].getAttribute('name').search("_fv_") == -1)
				//&& element_array[i].getAttribute('name').search("field_value") == -1)
				{
					element_array[i].checked = false;
				}
			}
		}
		cbItem.checked = true;
	}
	else
	{
		// ������� ID ��������� � ID ��������
		var reg = /id_check_(\d+)_(\S+)/;
		var arr = reg.exec(ElementID);

		// arr[1] - ID ���������
		// arr[2] - ID ��������

		// ��� ������� � ID = 0 �������� ������� "�� ����"
		//if (arr[2] == 0)
		//{
		// �������� ������� ���
		var ElementDiv = document.createElement("div");
		ElementDiv.setAttribute("style", "display: none");

		// ������� ������� div � div-� � ������������ �������
		//var DivNode = document.getElementById('id_form_' + AAdminFromsId).appendChild(ElementDiv);
		var DivNode = document.getElementById('id_content').appendChild(ElementDiv);

		// �������� �������
		var ElementCheckbox = null;

		// ������� ������� ������� � ����� "$%&*@#" IE 6-7.
		try {
			ElementCheckbox = document.createElement('<input name="'+AItemName+'" type="checkbox" checked="">');
		} catch (e) {
		}

		if (!ElementCheckbox)
		{
			ElementCheckbox = document.createElement("input");
			ElementCheckbox.setAttribute("type", "checkbox");
			ElementCheckbox.setAttribute("name", AItemName);
			ElementCheckbox.setAttribute("checked", true);
			ElementCheckbox.setAttribute("value", "1");  //
		}

		// ������� ������� � �������� div-�
		var ElementNode = DivNode.appendChild(ElementCheckbox);
		//}
	}

	var admin_forms_all_check = document.getElementById('id_admin_forms_all_check');

	// ���� ������� ������ ���� ��������� ����������
	if (admin_forms_all_check != undefined)
	{
		admin_forms_all_check.checked = false;
	}

	// ���� ��� �������� ��� ������ 0, �� ������������� � false, ����� �� ���������� ���� limit � DoLoadAjax()
	if (ALimit == 0)
	{
		ALimit = false;
	}

	DoLoadAjax(AAction, AAdditionalParams, AAdminFromsId, AOperation, ALimit, AOnPage, AOrderFieldId, AOrderDirection);
}

//�������� ����� ������� Get ��� Post
//callback_function ������� ��������� ������
//AAdditionalParams - ������� ���������, ������������ � ������ �������. ������ ���������� � &
//ButtonObject - ������ ������� ������
function AjaxSendForm(callback_function, AAdditionalParams, ButtonObject)
{
	// ������ ������������ ����� �� ���������
	var FormNode = ButtonObject.parentNode;

	// ���� ������������ ����� �� �������� ������
	while (FormNode.nodeName.toLowerCase() != 'form')
	{
		var FormNode = FormNode.parentNode;
	}

	// ������� ID ����� (�� ������ � ID ����� ������ �����������������)
	FormID = FormNode.id;

	// �������� �������� ������� ������ ��� input-�
	var HiddenInput = document.getElementById(ButtonObject.name);

	// �������� ���, ������� ���
	if (null == HiddenInput && undefined == HiddenInput || HiddenInput.type != 'hidden')
	{
		// �������� ������ input, �.�. ������� �� ���������� � �����
		var ElementInput = document.createElement("input");
		ElementInput.setAttribute("type", "hidden");
		ElementInput.setAttribute("id", ButtonObject.name);
		ElementInput.setAttribute("name", ButtonObject.name);

		// ������� ������� Input � �����
		var InputNode = FormNode.appendChild(ElementInput);
	}

	// �������� �� ���������� ���������� ������
	if (typeof tinyMCE != 'undefined')
	{
		tinyMCE.triggerSave();
	}

	var JsHttpRequestSendForm = new JsHttpRequest();

	// ��� ����������, ����� �������� ���������
	JsHttpRequestSendForm.onreadystatechange = function ()
	{
		if (JsHttpRequestSendForm.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			// ������� ����������.
			HideLoadingScreen();

			if (typeof callback_function != 'undefined')
			{
				callback_function(JsHttpRequestSendForm.responseJS);
			}
			
			return true;
		}
	}

	// ��������� action � �����
	// fix bug with IE 6 and getAttribute('') return [object]
	var FormAction = FormNode.attributes['action'].value;

	// ��������� ����� �����
	var FormMethod = FormNode.getAttribute('method');

	// �������� ���������� AAdditionalParams ������� ����, � �� ����� hostcmsAAdditionalParams
	FormAction += (FormAction.indexOf('?') >= 0 ? '&' : '?') + AAdditionalParams;

	// Prepare request object (automatically choose GET or POST).
	JsHttpRequestSendForm.open(FormMethod, FormAction, true);

	JsHttpRequestSendForm.send( { query: FormNode } );

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";

	// ���������� ����� ��������
	ShowLoadingScreen();

	return false;
}

// ����������� ������ �������� AJAX.
function ShowLoadingScreen()
{
	var fade_div = document.getElementById('id_admin_forms_fade');

	if (fade_div == null)
	{
		// ������� div
		var fade_div = document.createElement("div");
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(fade_div);

		fade_div.id = "id_admin_forms_fade";

		fade_div.style.zIndex = 999;

		fade_div.className = "shadowed";

		fade_div.style.position = 'absolute';
		fade_div.style.left = '50%';
		fade_div.style.top = '50%';

		var fade_div_img = document.createElement("img");
		fade_div_img.id = 'id_fade_div_img';
		fade_div_img.src = '/hostcmsfiles/images/ajax_loader.gif';
		fade_div.appendChild(fade_div_img);

		var shadowed_tl = document .createElement("div");
		shadowed_tl.className = "tl";
		fade_div.appendChild(shadowed_tl);

		var shadowed_t = document.createElement("div");
		shadowed_t.className = "t";
		fade_div.appendChild(shadowed_t);

		var shadowed_tr = document.createElement("div");
		shadowed_tr.className = "tr";
		fade_div.appendChild(shadowed_tr);

		var shadowed_l = document.createElement("div");
		shadowed_l.className = "l";
		fade_div.appendChild(shadowed_l);

		var shadowed_r = document.createElement("div");
		shadowed_r.className = "r";
		fade_div.appendChild(shadowed_r);

		var shadowed_bl = document.createElement("div");
		shadowed_bl.className = "bl";
		fade_div.appendChild(shadowed_bl);

		var shadowed_b = document.createElement("div");
		shadowed_b.className = "b";
		fade_div.appendChild(shadowed_b);

		var shadowed_br = document.createElement("div");
		shadowed_br.className = "br";
		fade_div.appendChild(shadowed_br);

		// �������� ������ ����������� ����� � ������������� � ��� ������� � ������ �������
		groupChildElements = fade_div.children;

		if (groupChildElements != undefined)
		{
			for (i = 0; i < groupChildElements.length; i++)
			{
				if(groupChildElements[i].className == 'b' | groupChildElements[i].className == 't')
				{
					groupChildElements[i].style.width = fade_div.clientWidth + 'px';
				}

				if(groupChildElements[i].className == 'r' | groupChildElements[i].className == 'l')
				{
					groupChildElements[i].style.height = fade_div.clientHeight + 'px';
				}
			}
		}

		fade_div.style.display = 'none';
	}

	// ���������� div
	fade_div.style.display = 'block';

	var arrayPageSize = getPageSize();

	// 0 - pageWidth, 1 - pageHeight, 2 - windowWidth, 3 - windowHeight
	var arrayPageSize = getPageSize();

	// 0 - scrOfX, 1 - scrOfY
	var arrayScrollXY = getScrollXY();

	// ���������� �� ����������� �������� div-�
	var clientHeight = fade_div.clientHeight;
	fade_div.style.top = ((arrayPageSize[3] - clientHeight) / 2 + arrayScrollXY[1]) + 'px';

	var clientWidth = fade_div.clientWidth;
	fade_div.style.left = ((arrayPageSize[2] - clientWidth) / 2 + arrayScrollXY[0]) + 'px';
}

// ������� ������ �������� AJAX.
function HideLoadingScreen()
{
	// ������� ����������.
	fade_div = document.getElementById('id_admin_forms_fade');

	if (typeof fade_div != 'undefined')
	{
		fade_div.style.display = "none";
	}
}

function AddLoadFileField(container_id, inpit_prefix)
{
	cbItem = document.getElementById(container_id);

	if (cbItem)
	{
		// �������� ��� input-�
		element_array = cbItem.getElementsByTagName("input");

		count_input = element_array.length;

		// <br/>
		var ElementBr = document.createElement("br");
		cbItem.appendChild(ElementBr);

		//<input
		var ElementInput = document.createElement("input");
		ElementInput.setAttribute("size", "30");
		ElementInput.setAttribute("name", inpit_prefix + (count_input + 1));
		ElementInput.setAttribute("type", "file");
		ElementInput.setAttribute("title", "���������� ����");
		//ElementInput.setAttribute("style", "margin-bottom: 20px");
		cbItem.appendChild(ElementInput);
	}
}

// action - ����� �������� ��� ������
// method - GET, POST, null - �������������� �����������
// callback_function - ������� ��������� ������, ������� ����� ������� ����� ��������� ������ �� backenad-�
function sendBackgroundRequest(action, method, callback_function)
{
	var req = new JsHttpRequest();

	// ���� ��� ��������� �������������, ����� �������� ������ ����������.
	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			if (typeof callback_function != 'undefined')
			{
				callback_function(req.responseJS);
			}

			return true;
		}
	}

	req.open(method, action, true);

	// �������� ������ � ����������.
	req.send(null);

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";
	
	ShowLoadingScreen();
}