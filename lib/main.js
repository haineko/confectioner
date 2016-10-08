// ��������������� ������� ��������� �������� ������,
// ������������ � ������� ShowLoadingScreen.
function getPageSize()
{
	var xScroll, yScroll;

	if (window.innerHeight && window.scrollMaxY)
	{
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	}
	else if (document.body.scrollHeight > document.body.offsetHeight)
	{ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	}
	else
	{ // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}

	var windowWidth, windowHeight;

	if (self.innerHeight)
	{
		// all except Explorer
		if(document.documentElement.clientWidth)
		{
			windowWidth = document.documentElement.clientWidth;
		}
		else
		{
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
	{ // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	}
	else if (document.body)
	{ // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}

	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight)
	{
		pageHeight = windowHeight;
	}
	else
	{
		pageHeight = yScroll;
	}

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth)
	{
		pageWidth = xScroll;
	}
	else
	{
		pageWidth = windowWidth;
	}

	arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
	return arrayPageSize;
}

// ��������� ���������� � ������� ������
function getScrollXY()
{
	var scrOfX = 0, scrOfY = 0;

	if (typeof(window.pageYOffset ) == 'number' )
	{
		//Netscape
		scrOfY = window.pageYOffset;
		scrOfX = window.pageXOffset;
	}
	else if (document.body && (document.body.scrollLeft || document.body.scrollTop))
	{
		//DOM
		scrOfY = document.body.scrollTop;
		scrOfX = document.body.scrollLeft;
	}
	else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop))
	{
		//IE6
		scrOfY = document.documentElement.scrollTop;
		scrOfX = document.documentElement.scrollLeft;
	}

	return [ scrOfX, scrOfY ];
}

function CreateWindow(windowId, windowTitle, windowWidth, windowHeight)
{
	var windowDiv = document.getElementById(windowId);

	if (windowDiv == undefined)
	{
		// ������� div ��� ����
		var fade_div = document.createElement("div");
		fade_div.setAttribute("id", windowId);
		var body = document.getElementsByTagName("body")[0];
		windowDiv = body.appendChild(fade_div);
	}

	// ����
	windowDiv.className = "shadowed";

	if (windowWidth == '')
	{
		windowWidth = '300px';
	}

	windowDiv.style.width = windowWidth;

	if (windowHeight != '')
	{
		windowDiv.style.height = windowHeight;
	}

	var shadowed_tl = document.createElement("div");
	shadowed_tl.className = "tl";
	windowDiv.appendChild(shadowed_tl);

	var shadowed_t = document.createElement("div");
	shadowed_t.className = "t";
	windowDiv.appendChild(shadowed_t);

	var shadowed_tr = document.createElement("div");
	shadowed_tr.className = "tr";
	windowDiv.appendChild(shadowed_tr);

	var shadowed_l = document.createElement("div");
	shadowed_l.className = "l";
	windowDiv.appendChild(shadowed_l);

	var shadowed_r = document.createElement("div");
	shadowed_r.className = "r";
	windowDiv.appendChild(shadowed_r);

	var shadowed_bl = document.createElement("div");
	shadowed_bl.className = "bl";
	windowDiv.appendChild(shadowed_bl);

	var shadowed_b = document.createElement("div");
	shadowed_b.className = "b";
	windowDiv.appendChild(shadowed_b);

	var shadowed_br = document.createElement("div");
	shadowed_br.className = "br";
	windowDiv.appendChild(shadowed_br);

	// ������� ���������(��� ����������� ������� ��������� �������� ' ' - ������)
	if(windowTitle != '')
	{
		var topbar = document.createElement("div");
		topbar.className = "topbar";
		windowDiv.insertBefore(topbar, windowDiv.childNodes[0]);
	}

	windowDiv.style.display = "none";

	// �������
	var wclose_img = document.createElement("img");
	wclose_img.src = '/hostcmsfiles/images/wclose.gif';

	wclose_img.onclick = function() {HideWindow(windowId); };

	if(windowTitle != '')
	{
		topbar.appendChild(wclose_img);

		// ��������� ����
		var textNode = document.createTextNode(windowTitle);
		topbar.appendChild(textNode);
	}
}

// ����������/�������� ����
function SlideWindow(windowId)
{
	var windowDiv = document.getElementById(windowId);

	if (windowDiv == undefined)
	{
		return false;
	}

	if (windowDiv.style.display == "block")
	{
		HideWindow(windowId);
	}
	else
	{
		ShowWindow(windowId);
	}
}

var prev_window = 0;

function ShowWindow(windowId)
{
	var windowDiv = document.getElementById(windowId);

	if (windowDiv == undefined)
	{
		return false;
	}

	// ���������  && windowId.indexOf('edit_window_') == 0 ��� ����, ����� ��� ����������� ������������ ������ � ����������� ����������� �� ����������� ����������� ���� ��
	if (prev_window && prev_window != windowId && (windowId.indexOf('edit_window_') == 0 || prev_window.indexOf('edit_window_') !== 0))
	{
		HideWindow(prev_window);
	}

	prev_window = windowId;

	// 0 - pageWidth, 1 - pageHeight, 2 - windowWidth, 3 - windowHeight
	var arrayPageSize = getPageSize();

	// 0 - scrOfX, 1 - scrOfY
	var arrayScrollXY = getScrollXY();

	// ���������� �� ����������� �������� div-�
	windowDiv.style.display = 'block';

	var clientHeight = windowDiv.clientHeight;
	var clientWidth = windowDiv.clientWidth;

	// ���� ������ div-� ������ ������ ����
	if (clientHeight > arrayPageSize[3])
	{
		// ������� ������ ������ 90% ������ ����
		clientHeight = Math.round(arrayPageSize[3] * 0.9);
	}

	// ���� ������ div-� ������ ������ ����
	if (clientWidth > arrayPageSize[2])
	{
		// ������� ������ ������ 90% ������ ����
		clientWidth = Math.round(arrayPageSize[2] * 0.9);
	}

	windowDiv.style.top = ((arrayPageSize[3] - clientHeight) / 2 + arrayScrollXY[1]) + 'px';

	windowDiv.style.left = ((arrayPageSize[2] - clientWidth) / 2 + arrayScrollXY[0]) + 'px';
}

// ������� �������� �������� �������� � ID, ������ node_id
function deleteChildNodes(node_id)
{
	var node = document.getElementById(node_id);

	if (node !== undefined)
	{
		if (node.hasChildNodes())
		{
			while (node.firstChild)
			{
				node.removeChild(node.firstChild);
			}
		}
	}
}

function HideWindow(windowId)
{
	var windowDiv = document.getElementById(windowId);

	if (windowDiv == undefined)
	{
		return false;
	}

	// ���� �������������� ��������� �� ��� �������� - ������� ���������
	if (windowId.indexOf('edit_window_') == 0)
	{
		// ��������� ����� � �����������
		DisableTinyMCE();

		// ������� �������� ����
		deleteChildNodes(windowId);

		// ������� ����
		windowDiv.parentNode.removeChild(windowDiv);
	}
	else
	{
		windowDiv.style.display = 'none';
	}
}

// �������
function doSetLocation(shop_country_id, path)
{
	var req = new JsHttpRequest();

	// ���������� ����� ��������
	ShowLoadingScreen();

	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			// ������� ����������.
			HideLoadingScreen();

			if (req.responseJS != undefined)
			{
				// ������.
				if (req.responseJS.result != undefined)
				{
					oSelect = document.getElementById(location_select_id);

					// ������� select
					oSelect.options.length = 0;

					// ��������� �������� " ... "
					oSelect.options[oSelect.options.length] = new Option(" ... ", 0);

					for (var key in req.responseJS.result)
					{
						oSelect.options[oSelect.options.length] = new Option(req.responseJS.result[key], key);
					}

					// ������������� ������
					//doSetCity(oSelect.options[oSelect.selectedIndex].value);
					oCity = document.getElementById(city_select_id);
					oCity.options.length = 0;
					oCity.options[oCity.options.length] = new Option(" ... ", 0);

					oCityarea = document.getElementById(cityarea_select_id);
					oCityarea.options.length = 0;
					oCityarea.options[oCityarea.options.length] = new Option(" ... ", 0);
				}
			}
			return true;
		}
	}

	req.open('get', path + "?action=get_location&shop_country_id="+shop_country_id, true);

	// �������� ������ � ����������.
	req.send(null);

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";
}

function doSetCity(shop_location_id, path)
{
	var req = new JsHttpRequest();

	// ���������� ����� ��������
	ShowLoadingScreen();

	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			// ������� ����������.
			HideLoadingScreen();

			if (req.responseJS != undefined)
			{
				// ������.
				if (req.responseJS.result != undefined)
				{
					oSelect = document.getElementById(city_select_id);

					// ������� select
					oSelect.options.length = 0;

					// ��������� �������� " ... "
					oSelect.options[oSelect.options.length] = new Option(" ... ", 0);

					for (var key in req.responseJS.result)
					{
						oSelect.options[oSelect.options.length] = new Option(req.responseJS.result[key], key);
					}

					// ������������� ������
					//doSetCityArea(oSelect.options[oSelect.selectedIndex].value);

					oCityarea = document.getElementById(cityarea_select_id);
					oCityarea.options.length = 0;
					oCityarea.options[oCityarea.options.length] = new Option(" ... ", 0);
				}
			}
			return true;
		}
	}

	req.open('get', path + "?action=get_city&shop_location_id="+shop_location_id, true);

	// �������� ������ � ����������.
	req.send(null);

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";
}

function doSetCityArea(shop_city_id, path)
{
	var req = new JsHttpRequest();

	// ���������� ����� ��������
	ShowLoadingScreen();

	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			// ������� ����������.
			HideLoadingScreen();

			if (req.responseJS != undefined)
			{
				// ������.
				if (req.responseJS.result != undefined)
				{
					oSelect = document.getElementById(cityarea_select_id);

					// ������� select
					oSelect.options.length = 0;

					// ��������� �������� " ... "
					oSelect.options[oSelect.options.length] = new Option(" ... ", 0);

					for (var key in req.responseJS.result)
					{
						oSelect.options[oSelect.options.length] = new Option(req.responseJS.result[key], key);
					}
				}
			}
			return true;
		}
	}

	req.open('get', path + "?action=get_cityarea&shop_city_id="+shop_city_id, true);

	// �������� ������ � ����������.
	req.send(null);

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";
}

// ��������� �����
// �������� �������� ������� ���������� �����
function GetStyle(drag_object, axis)
{
	var str_value = "";

	if(document.defaultView && document.defaultView.getComputedStyle)
	{
		var css = document.defaultView.getComputedStyle(drag_object, null);
		str_value = css ? css.getPropertyValue(axis) : null;
	}
	else if(drag_object.currentStyle)
	{
		str_value = drag_object.currentStyle[axis];

		if (str_value == 'auto')
		{
			if (axis == 'top')
			{
				str_value = drag_object.offsetTop;
			}
			else
			{
				str_value = drag_object.offsetLeft;
			}
		}
	}

	return str_value;
}

function Draggable(drag_object)
{
	var xDelta = 0,
	yDelta = 0,
	xStart = 0,
	yStart = 0;

	// ���������� �������
	function EndDrag()
	{
		document.onmouseup = null;
		document.onmousemove = null;
	}

	// ������� ����� ������� ��� ��������������
	function Drag(drag_event)
	{
		drag_event = drag_event || window.event;

		xDelta = xStart - parseInt(drag_event.clientX);
		yDelta = yStart - parseInt(drag_event.clientY);

		xStart = parseInt(drag_event.clientX);
		yStart = parseInt(drag_event.clientY);

		drag_object.style.top = (parseInt(drag_object.style.top) - yDelta) + 'px';
		drag_object.style.left = (parseInt(drag_object.style.left) - xDelta) + 'px';
	}

	// ������ ��������������
	function StartDrag(drag_event)
	{
		drag_event = drag_event || window.event;

		xStart = parseInt(drag_event.clientX);
		yStart = parseInt(drag_event.clientY);

		drag_object.style.top = parseInt(GetStyle(drag_object, 'top')) + 'px';
		drag_object.style.left = parseInt(GetStyle(drag_object, 'left')) + 'px';

		document.onmouseup = EndDrag;
		document.onmousemove = Drag;

		return false;
	}

	// ��������� ������ � ��������
	drag_object.onmousedown = StartDrag;
}

// ����� ���� ��������������
function ShowEditWindow(caption, path, name)
{
	var oWindowId = 'edit_window_'+name;

	var oWindow = document.getElementById(oWindowId);

	if (oWindow == undefined)
	{
		// ������� ����
		CreateWindow(oWindowId, caption, '90%', '90%');

		var oWindow = document.getElementById(oWindowId);

		// <div id="subdiv">
		var ElementDiv = document.createElement("div");
		ElementDiv.setAttribute("id", "subdiv");
		var SubDiv = oWindow.appendChild(ElementDiv);

		var DivMessage = document.createElement("div");
		DivMessage.setAttribute("id", "id_message");
		var oDivMessage = SubDiv.appendChild(DivMessage);

		var DivContent = document.createElement("div");
		DivContent.setAttribute("id", "id_content");
		var oDivContent = SubDiv.appendChild(DivContent);

		// ������ backend-�
		var req = new JsHttpRequest();

		// ���������� ����� ��������
		ShowLoadingScreen();

		req.onreadystatechange = function()
		{
			if (req.readyState == 4)
			{
				// ���������� ������� ������
				document.body.style.cursor = '';

				// ������� ����������.
				HideLoadingScreen();

				if (req.responseJS != undefined)
				{
					// ���������.
					// ������� ��������� ������ � ����������.
					if (typeof req.responseJS.error != 'undefined')
					{
						if (oDivMessage)
						{
							// �������� ������� SPAN ��� IE, � ������� �������� ����� + ������.
							// ���� ����� <script> �� ����� ������, ��������� IE �� ������ SCRIPT
							var span = document.createElement("span");
							span.style.display = 'none';
							span.innerHTML = "Stupid IE. " + req.responseJS.error;

							runScripts(span.getElementsByTagName('SCRIPT'));

							// ������� ����� ��������� ������ ����� ���������� �������
							oDivMessage.innerHTML = req.responseJS.error;
						}
					}

					// ������ ���������� ������ �����, ���� ��� ���� � �� ������.
					if (typeof req.responseJS.form_html != 'undefined' && req.responseJS.form_html != '')
					{
						cmsrequest = path;
						
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
						
						// DisableTinyMCE();

						// ������� ����� ��������� �� ���������� �������
						oDivContent.innerHTML = req.responseJS.form_html;
						
						// �������� ������� SPAN ��� IE, � ������� �������� ����� + ������.
						// ���� ����� <script> �� ����� ������, ��������� IE �� ������ SCRIPT
						var span = document.createElement("span");
						span.style.display = 'none';
						span.innerHTML = "Stupid IE. " + req.responseJS.form_html;

						runScripts(span.getElementsByTagName('SCRIPT'));
					}
				}
				return true;
			}
		}

		req.open('get', path, true);

		// �������� ������ � ����������.
		req.send(null);

		// ������ ������ �� ������.
		document.body.style.cursor = "wait";
	}
	else
	{
		// ��������� ����� � �����������
		DisableTinyMCE();
		oDivMessage = document.getElementById("id_message");
		oDivMessage.innerHTML = '';
	}

	SlideWindow(oWindowId);
}

function row_over(object)
{
	if (object.className == 'row_table') object.className = 'row_table_over';
}

function row_out(object)
{
	if (object.className == 'row_table_over') object.className = 'row_table';
}

function row_over_odd(object)
{
	if (object.className == 'row_table_odd') object.className = 'row_table_over_odd';
}

function row_out_odd(object)
{
	if (object.className == 'row_table_over_odd') object.className = 'row_table_odd';
}


function menu_row_over(object)
{
	if (object.className == 'menu_out') object.className = 'menu_over';
}

function menu_row_out(object)
{
	if (object.className == 'menu_over') object.className = 'menu_out';
}

function SlideLayer(Num)
{
	var el = document.getElementById(Num);

	if (el.style.display=="block")
	{
		el.style.display="none";
	}
	else
	{
		el.style.display="block";
	}
}

// =============================================
// ������� ������ � ����
// =============================================
changeFontSizeTimer = new Array();

function HostCMSMenuOver(CurrenElementId, LevelMenu, ChildId)
{
	CurrenElement = document.getElementById(CurrenElementId);
	if (CurrenElementId == undefined)
	{
		return false;
	}

	decor(CurrenElementId, LevelMenu);
	if (ChildId != '')
	{
		ChildId = document.getElementById(ChildId);
		showHideMenu(ChildId);
	}
}

function HostCMSMenuOut(CurrenElementId, LevelMenu, ChildId)
{
	CurrenElement = document.getElementById(CurrenElementId);

	if (CurrenElementId == undefined)
	{
		return false;
	}

	unDecor(CurrenElementId, LevelMenu);
	if (ChildId != '')
	{
		ChildId = document.getElementById(ChildId);
		showHideMenu(ChildId);
	}
}

// ������� �������-�������� ����
function showHideMenu(ChildId)
{
	if (ChildId == undefined)
	{
		return false;
	}

	if (ChildId.style.display == "block")
	{
		ChildId.style.display = "none";
	}
	else
	{
		ChildId.style.display = "block";

		// �������� ������ ����������� ����� � ������������� � ��� ������� � ������ �������
		groupChildElements = ChildId.children;

		if (groupChildElements != undefined)
		{
			for (i = 0; i < groupChildElements.length; i++)
			{
				if(groupChildElements[i].className == 'b' | groupChildElements[i].className == 't')
				{
					groupChildElements[i].style.width = ChildId.clientWidth + 'px';
				}

				if(groupChildElements[i].className == 'r' | groupChildElements[i].className == 'l')
				{
					groupChildElements[i].style.height = ChildId.clientHeight + 'px';
				}
			}
		}
	}
}

// ������� ����������
function changeFontSize(CurrenElementId, change, limit)
{
	var CurrenElement = document.getElementById(CurrenElementId);

	if (CurrenElement)
	{
		var CurrFontSize = CurrenElement.style.fontSize ? parseInt(CurrenElement.style.fontSize) : 10;
		if (CurrFontSize != limit)
		{
			CurrenElement.style.fontSize = (CurrFontSize + change) + 'pt';
			changeFontSizeTimer[CurrenElementId] = setTimeout('changeFontSize("'+CurrenElementId+'", '+change+', '+limit+')', 1);
		}
	}
}

// ������� ����������� ���������� ��������� ����
function decor(CurrenElementId, LevelMenu)
{
	var CurrenElemen = document.getElementById(CurrenElementId);

	if (LevelMenu == 1) // ��� ������� ������ �����������
	{
		CurrenElement.style.background = "url('/admin/images/line3.gif') repeat-x 0 100%";
		var child = CurrenElement.children;

		if (changeFontSizeTimer[CurrenElementId] != '')
		{
			clearTimeout(changeFontSizeTimer[CurrenElementId]);
		}
		changeFontSize(CurrenElement.id, 1, 13);

		// ������������ li ��� ���������
		//CurrenElementId.style.top = (navigator.userAgent.indexOf('Firefox') != -1)? '-2px':'-6px';
	}
	else // ��� ������� ������ �����������
	{

	}
}

// ������� ����������� ���������� ��������� ����
function unDecor(CurrenElementId, LevelMenu)
{
	var CurrenElemen = document.getElementById(CurrenElementId);
	if (LevelMenu==1)
	{
		clearTimeout(changeFontSizeTimer[CurrenElementId]);
		CurrenElement.style.background = "url('/admin/images/line1.gif') repeat-x 0 100%";
		changeFontSize(CurrenElement.id, -1, 10);
	}
	else
	{
		//CurrenElementId.style.background = (navigator.userAgent.indexOf('MSIE') == -1)? 'url(/admin/images/fon_li.png) repeat-y 0 0':'url(/admin/images/fon_li.gif) repeat-y 0 0';
	}
}

function SetGradeMessage(message_id, grade_val)
{
	// ������ backend-�
	var req = new JsHttpRequest();

	// ���������� ����� ��������
	ShowLoadingScreen();

	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// ���������� ������� ������
			document.body.style.cursor = '';

			// ������� ����������.
			HideLoadingScreen();

			return true;
		}
	}

	req.open('get', "./?action=set_message_grade&helpdesk_message_id="+message_id+"&grade="+grade_val, true);

	// �������� ������ � ����������.
	req.send(null);

	// ������ ������ �� ������.
	document.body.style.cursor = "wait";
}

/**
 * ���������� �������� CAPTCHA
 * captchaKey - ������������� CAPTCHA
 * captchaHeight - ������ �������� � CAPTCHA
 */
function ReNewCaptcha(captchaKey, captchaHeight)
{	
	if (document.images['captcha'] != undefined)
	{
		var antiCache = Math.floor(Math.random()*100000);
		document.images['captcha'].src = "/captcha.php?get_captcha=" + captchaKey + "&height=" + captchaHeight + "&anc=" + antiCache;
	}
}

/**
 * ���������� �������� CAPTCHA ��� �������� �� �� ID
 * captchaKey - ������������� CAPTCHA
 * captchaHeight - ������ �������� � CAPTCHA
 */
function ReNewCaptchaById(imageId, captchaKey, captchaHeight)
{	
	// �������� �������� ������� ������ ��� input-�
	var captchaObject = document.getElementById(imageId);

	// �������� ���, ������� ���
	if (null != captchaObject && undefined !== captchaObject)
	{
		var antiCache = Math.floor(Math.random()*100000);
		captchaObject.src = "/captcha.php?get_captcha=" + captchaKey + "&height=" + captchaHeight + "&anc=" + antiCache;
	}
}

// ����������/�������� ����
function ShowHide(divId)
{
	var windowDiv = document.getElementById(divId);

	if (windowDiv == undefined)
	{
		return false;
	}

	if (windowDiv.style.display == "block")
	{
		windowDiv.style.display = 'none';
	}
	else
	{
		windowDiv.style.display = 'block';
	}
}

//������� ��������� ������ ��� �������� ����� ���������� �� ����� ����������
function callbackfunction_showFormAddItem(responseJS)
{
	if (typeof responseJS != 'undefined')
	{
		HideLoadingScreen();
	
		// ������.
		if (typeof responseJS.result != 'undefined')
		{
			html = responseJS.result;

			document.getElementById('AddItemForm').innerHTML = html;

			// ��������� ������� �� ����������� � ������� HTML-�
			runScripts(document.getElementById('AddItemForm').getElementsByTagName('SCRIPT'));
			
			// ������� ���� ���������
			var div_id_message = document.getElementById('AddItemMessage');

			if (div_id_message)
			{
				div_id_message.innerHTML = '';
			}
			
			//cr('AddItemForm');
		}
	}
}

//������� ��������� ������ ��� �������� ���������� �� ����� ����������
function callbackfunction_SendFormItem(responseJS)
{
	if (typeof responseJS != 'undefined')
	{
		if (responseJS.message != 'undefined')
		{
			var div_id_message = document.getElementById('AddItemMessage');

			if (div_id_message)
			{
				div_id_message.innerHTML = responseJS.message;
				
				// ��������� ������� �� ����������� � ������� HTML-�
				runScripts(div_id_message.getElementsByTagName('SCRIPT'));
				
				// ��������� � ���������
				window.location.href = (window.location.href.indexOf('#') >= 0 ? window.location.href : window.location.href + '#FocusAddItemMessage');
			}
		}
	}
}

function ShowImgWindow(title, src, width, height)
{
	obj = window.open("", "", "scrollbars=0,dialog=0,minimizable=1,modal=1,width="+width+",height="+height+",resizable=0");
	obj.document.write("<html>");
	obj.document.write("<head>");
	obj.document.write("<title>"+title+"</title>");
	obj.document.write("</head>");
	obj.document.write("<body topmargin=0 leftmargin=0 marginwidth=0 marginheight=0>");
	obj.document.write("<img src=\""+src+"\" width=\""+width+"\" height=\""+height+"\" />");
	obj.document.write("</body>");
	obj.document.write("</html>");
	obj.document.close();
}

function getElementsByName_iefix(tag, name) 
{
	var elem = document.getElementsByTagName(tag);
	var arr = new Array();

	var iarr = 0;
	
	for(i = 0; i < elem.length; i++)
	{
		att = elem[i].getAttribute("name");

		if(att == name)
		{
			arr[iarr] = elem[i];
			iarr++;
		}
	}
	return arr;
}

// ��������� ������ �����
function changeHeightFloatBlockBorder (oBorder, iHeightAttribute, iStyleTop)
{
	var iElementHeight = 0;
	
	for (i = 0; i < oBorder.length; i++)
	{
		iElementHeight = oBorder[i].parentNode.offsetHeight + iHeightAttribute;

		if (iElementHeight > 0)
		{
			oBorder[i].style.height = iElementHeight + 'px';
			oBorder[i].style.top = iStyleTop + 'px';
		}
	}
}