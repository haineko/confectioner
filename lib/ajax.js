/**
* HostCMS
*
* @author Hostmake LLC, http://www.hostcms.ru/
* @version 5.x
*/

if (typeof HostcmsEscape == 'undefined')
{
	// Сохраняем стандартную функцию escape()
	//var escapeOrig = window.escape;

	// Переопределяем функцию escape()
	//window.escape = function(str)
	function HostcmsEscape(str)
	{
		// Инициализируем таблицу перевода
		var trans = [];

		for (var i = 0x410; i <= 0x44F; i++)
		{
			trans[i] = i - 0x350; // А-Яа-я
		}

		trans[0x401] = 0xA8; // Ё
		trans[0x451] = 0xB8; // ё
		
		var ret = [];
		// Составляем массив кодов символов, попутно переводим кириллицу
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

// Событие - нажатие клавиши.
document.onkeydown = DoKeyDown;

// Пользовательский обработчик события нажатия клавиш,
// для обработки Ctrl + стрелка.
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
			case 0x25: // Назад
			Element = document.getElementById ('id_prev');
			break;

			case 0x27: // Вперед
			Element = document.getElementById ('id_next');
			break;
		}

		if (Element && Element.href)
		{
			// Редирект на нужную страницу.
			document.location = Element.href;
		}
	}
}

function DisableTinyMCE()
{
	// Работу с визуальным редактором ведём, если пришли данные для form_html
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

// выполняет скрипты из полученного ответа от сервера
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

			// Получаем объект, к которому применим ребенка
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

			// Не работает в IE, в нем работает newScript.text = text;
			//script_node.appendChild(document.createTextNode(text));
		}
	}
}

// action - адрес страницы для запрос
// method - GET, POST, null - автоматическое определение
// callback_function - функция обратного вызова, которая будет вызвана после получения ответа от backenad-а
function sendRequest(action, method, callback_function)
{
	var req = new JsHttpRequest();

	// Отображаем экран загрузки
	ShowLoadingScreen();

	// Этот код вызовется автоматически, когда загрузка данных завершится.
	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// Возвращаем обычный курсор
			document.body.style.cursor = '';

			// Убираем затемнение.
			HideLoadingScreen();

			if (typeof callback_function != 'undefined')
			{
				callback_function(req.responseJS);
			}

			return true;
		}
	}

	req.open(method, action, true);

	// Отсылаем данные в обработчик.
	req.send(null);

	// Курсор ставим на часики.
	document.body.style.cursor = "wait";
}

//Загрузка формы
//AAction - относительный адрес файла, который будет запрошен
//AAdditionalParams - внешние переметры, передаваемые в строку запроса. Должны начинаться с &
//AAdminFromsId - идентификатор формы центра администрирования
//AOperation - имя события
//ALimit - текущая страница, false - не отправлять страницу
//AOnPage - число элементов на страницу
//AOrderFieldId - ID поля, по которому идет сортировка
//AOrderDirection - направление сортировки, 1 - по возрастанию, 2 - по убыванию
function DoLoadAjax(AAction, AAdditionalParams, AAdminFromsId, AOperation, ALimit, AOnPage, AOrderFieldId, AOrderDirection)
{
	// Отключаем связь с редакторами
	DisableTinyMCE();

	if (AOperation == '')
	{
		return false;
	}

	// Если поле сортировки было указано - передадим поле и направление сортировки
	if (AOrderFieldId != 0)
	{
		sOrder = '&order_field_id=' + AOrderFieldId +
		'&order_field_direction=' + AOrderDirection;
	}
	else
	{
		sOrder = '';
	}

	// Чисто элеменов на страницу.
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

	// Строка запроса с выбранными элементами и их значениями.
	sElements = '';
	sFilter = '';

	// Для определния принадлежности поля фильтру
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

			// Определяем выбрана ли запись для редактирования.
			if (element_name.search("check_") != -1 &&
			element_name.search("_fv_") == -1)
			//element_name.search("field_value") == -1)
			{
				if (element_array[i].checked)
				{
					sElements = sElements + '&' + element_name + '=1';

					// Ищем значения записей.
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

							// Проверяем, содержит ли в себе имя чекбокса для записи.
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

					// Ищем значения записей для select-ов
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

							// Проверяем, содержит ли в себе имя чекбокса для записи.
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

			// Может быть это элемент фильтра?
			if (reg_filter.test(element_name))
			{
				// Дописываем к передаваемым данным, только если значение фильтра до 255 символов
				if (element_array[i].value.length < 256)
				{
					sFilter = sFilter + '&' + element_name + '=' + HostcmsEscape(element_array[i].value);
				}
			}
		}
	}

	// Select-ы из фильтра
	element_array = document.getElementsByTagName("select");
	if (element_array.length > 0)
	{
		for (var i = 0; i < element_array.length; i++)
		{
			element_name = element_array[i].getAttribute('name');

			// Может быть это элемент фильтра?
			if (reg_filter.test(element_name))
			{
				// Дописываем к передаваемым данным
				sFilter = sFilter + '&' + element_name + '=' + HostcmsEscape(element_array[i].value);
			}
		}
	}

	// Данные которые всегда нужно передавать в запрос.
	sParams = AAdditionalParams;

	// Текущая страница.
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

	// Отправляем запрос backend-у
	sendRequest(cmsrequest, method, callbackfunction_DoLoadAjax);
}

// Функция обратного вызова для DoLoadAjax
function callbackfunction_DoLoadAjax(responseJS)
{
	// Результат принят
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

		// Данные.
		if (typeof responseJS.form_html != 'undefined')
		{
			// Указываем текущий путь
			// Меняем Location только при DoLoadAjax, если вернулись назад - не меняем
			if (cmsrequest != ''
			&& function_exists('getCmsUrl')
			&& getCmsUrl() != cmsrequest)
			{
				setLocation(cmsrequest);
			}

			if (function_exists('saveLocation'))
			{
				// Сохраняем текущий путь всегда
				saveLocation(getCmsUrl());
			}

			// Отключаем связь с редакторами
			DisableTinyMCE();

			html = responseJS.form_html;

			document.getElementById('id_content').innerHTML = html;

			// Выполняем скрипты из полученного с сервера HTML-а
			runScripts(document.getElementById('id_content').getElementsByTagName('SCRIPT'));

			// Сбрасываем cmsrequest
			cmsrequest = '';
		}

		// Title.
		if (typeof responseJS.title != 'undefined' && responseJS.title != '')
		{
			document.title = responseJS.title;
		}

		// Редирект.
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

//Отправка формы методом Get или Post
//AAction - относительный адрес файла, который будет запрошен
//AAdditionalParams - внешние переметры, передаваемые в строку запроса. Должны начинаться с &
//ButtonObject - Объект нажатой кнопки
//AAdminFromsId - идентификатор формы центра администрирования
function doSendForm(AAction, AAdditionalParams, ButtonObject, AAdminFromsId, AOperation, ALimit, AOnPage)
{
	// Объект родительской формы по умолчанию
	var FormNode = ButtonObject.parentNode;

	// Пока родительская форма не является формой
	while (FormNode.nodeName.toLowerCase() != 'form')
	{
		var FormNode = FormNode.parentNode;
	}

	// Получим ID формы (не путать с ID формы центра администрирования)
	FormID = FormNode.id;

	// Пытаемся получить скрытый объект для input-а
	var HiddenInput = document.getElementById(ButtonObject.name);

	// Элемента нет, добавим его
	if (null == HiddenInput && undefined == HiddenInput || HiddenInput.type != 'hidden')
	{
		// Создадим скрытй input, т.к. нажатый не передается в форму
		var ElementInput = document.createElement("input");
		ElementInput.setAttribute("type", "hidden");
		ElementInput.setAttribute("id", ButtonObject.name);
		ElementInput.setAttribute("name", ButtonObject.name);

		// Добавим скрытый Input к форме
		var InputNode = FormNode.appendChild(ElementInput);
	}

	// Сохраним из визуальных редакторов данные
	if (typeof tinyMCE != 'undefined')
	{
		tinyMCE.triggerSave();
	}

	var JsHttpRequestSendForm = new JsHttpRequest();

	// Код вызывается, когда загрузка завершена
	JsHttpRequestSendForm.onreadystatechange = function ()
	{
		if (JsHttpRequestSendForm.readyState == 4)
		{
			// Возвращаем обычный курсор
			document.body.style.cursor = '';

			// Убираем затемнение.
			HideLoadingScreen();

			if (typeof JsHttpRequestSendForm.responseJS != 'undefined')
			{
				// Выводим результат ошибки в переменную.
				if (typeof JsHttpRequestSendForm.responseJS.error != 'undefined')
				{
					var div_id_message = document.getElementById('id_message');

					if (div_id_message)
					{
						// Создадим скрытый SPAN для IE, в который поместим текст + скрипт.
						// Если перед <script> не будет текста, нехороший IE не увидит SCRIPT
						var span = document.createElement("span");
						span.style.display = 'none';
						span.innerHTML = "Stupid IE. " + JsHttpRequestSendForm.responseJS.error;

						runScripts(span.getElementsByTagName('SCRIPT'));

						// Занесем текст сообщения только после выполнения скрипта
						div_id_message.innerHTML = JsHttpRequestSendForm.responseJS.error;
					}
				}

				// Данные записываем только тогда, если они есть и не пустые.
				if (typeof JsHttpRequestSendForm.responseJS.form_html != 'undefined' && JsHttpRequestSendForm.responseJS.form_html != '')
				{
					// Отключаем связь с редакторами
					DisableTinyMCE();

					// В клиентском разделе нам не нужно показывать результат отправки формы,
					// поэтому если такой результат пришел - закрываем окно.
					HideWindow(prev_window);

					/*html = JsHttpRequestSendForm.responseJS.form_html;

					document.getElementById('id_content').innerHTML = html;

					// Выполняем скрипты из полученного с сервера HTML-а
					runScripts(document.getElementById('id_content').getElementsByTagName('SCRIPT'));*/

				}
			}
			return true;
		}
	}

	// Определим action у формы
	//var FormAction = FormNode.getAttribute('action');
	// fix bug with IE 6 and getAttribute('') return [object]
	var FormAction = FormNode.attributes['action'].value;

	// Определим метод формы
	var FormMethod = FormNode.getAttribute('method');

	if (AOnPage)
	{
		sOnPage = '&admin_forms_on_page=' + AOnPage;
	}
	else
	{
		sOnPage = '';
	}

	// Текущая страница.
	if (ALimit == 0)
	{
		ALimit = '';
	}
	else
	{
		ALimit = '&limit=' + ALimit;
	}

	// передача параметров AAdditionalParams сделана явно, а не через hostcmsAAdditionalParams
	FormAction += (FormAction.indexOf('?') >= 0 ? '&' : '?') + 'hostcmsAAction=' + HostcmsEscape(AAction) +
	'&hostcmsAAdditionalParams=' + HostcmsEscape(AAdditionalParams) + AAdditionalParams +
	'&operation=' + AOperation + ALimit + sOnPage;

	// Prepare request object (automatically choose GET or POST).
	JsHttpRequestSendForm.open(FormMethod, FormAction, true);

	JsHttpRequestSendForm.send( { query: FormNode } );

	// Очистим поле для сообщений
	var div_id_message = document.getElementById('id_message');

	if (div_id_message)
	{
		div_id_message.innerHTML = '';
	}

	// Курсор ставим на часики.
	document.body.style.cursor = "wait";

	// Отображаем экран загрузки
	ShowLoadingScreen();

	return false;
}


//Функция выполняет событие, убирает выделение всех checkbox'ов кроме нужного.
//AAction - относительный адрес файла, который будет запрошен
//AAdditionalParams - внешние переметры, передаваемые в строку запроса. Должны начинаться с &
//AOperation - название события
//AItemName - кодовое имя элемента, над которым производится действие
//AAdminFromsId - идентификатор формы
//ALimit - текущая страница
//AOnPage - число элементов на страницу
//AOrderFieldId - ID поля, по которому идет сортировка
//AOrderDirection - направление сортировки, 1 - по возрастанию, 2 - по убыванию
function TrigerSingleAction(AAction, AAdditionalParams, AOperation, AItemName, AAdminFromsId, ALimit, AOnPage, AOrderFieldId, AOrderDirection)
{
	var ElementID = 'id_' + AItemName;

	cbItem = document.getElementById(ElementID);

	if (cbItem)
	{
		// Получаем все input-ы
		element_array = document.getElementsByTagName("input");

		// Если получили хотя бы один
		if (element_array.length > 0)
		{
			// Проходимся по списку
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
		// Получим ID источника и ID элемента
		var reg = /id_check_(\d+)_(\S+)/;
		var arr = reg.exec(ElementID);

		// arr[1] - ID источника
		// arr[2] - ID элемента

		// Для элемена с ID = 0 создадим чекбокс "на лету"
		//if (arr[2] == 0)
		//{
		// Создадим скрытый див
		var ElementDiv = document.createElement("div");
		ElementDiv.setAttribute("style", "display: none");

		// Добавим скрытый div к div-у с загружаемыми данными
		//var DivNode = document.getElementById('id_form_' + AAdminFromsId).appendChild(ElementDiv);
		var DivNode = document.getElementById('id_content').appendChild(ElementDiv);

		// Создадим чекбокс
		var ElementCheckbox = null;

		// Попытка создать элемент в стиле "$%&*@#" IE 6-7.
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

		// Добавим чекбокс к скрытому div-у
		var ElementNode = DivNode.appendChild(ElementCheckbox);
		//}
	}

	var admin_forms_all_check = document.getElementById('id_admin_forms_all_check');

	// Если элемент выбора всех чекбоксов существует
	if (admin_forms_all_check != undefined)
	{
		admin_forms_all_check.checked = false;
	}

	// Если для действия был указан 0, то устанавливаем в false, чтобы не передавать явно limit в DoLoadAjax()
	if (ALimit == 0)
	{
		ALimit = false;
	}

	DoLoadAjax(AAction, AAdditionalParams, AAdminFromsId, AOperation, ALimit, AOnPage, AOrderFieldId, AOrderDirection);
}

//Отправка формы методом Get или Post
//callback_function функция обратного вызова
//AAdditionalParams - внешние переметры, передаваемые в строку запроса. Должны начинаться с &
//ButtonObject - Объект нажатой кнопки
function AjaxSendForm(callback_function, AAdditionalParams, ButtonObject)
{
	// Объект родительской формы по умолчанию
	var FormNode = ButtonObject.parentNode;

	// Пока родительская форма не является формой
	while (FormNode.nodeName.toLowerCase() != 'form')
	{
		var FormNode = FormNode.parentNode;
	}

	// Получим ID формы (не путать с ID формы центра администрирования)
	FormID = FormNode.id;

	// Пытаемся получить скрытый объект для input-а
	var HiddenInput = document.getElementById(ButtonObject.name);

	// Элемента нет, добавим его
	if (null == HiddenInput && undefined == HiddenInput || HiddenInput.type != 'hidden')
	{
		// Создадим скрытй input, т.к. нажатый не передается в форму
		var ElementInput = document.createElement("input");
		ElementInput.setAttribute("type", "hidden");
		ElementInput.setAttribute("id", ButtonObject.name);
		ElementInput.setAttribute("name", ButtonObject.name);

		// Добавим скрытый Input к форме
		var InputNode = FormNode.appendChild(ElementInput);
	}

	// Сохраним из визуальных редакторов данные
	if (typeof tinyMCE != 'undefined')
	{
		tinyMCE.triggerSave();
	}

	var JsHttpRequestSendForm = new JsHttpRequest();

	// Код вызывается, когда загрузка завершена
	JsHttpRequestSendForm.onreadystatechange = function ()
	{
		if (JsHttpRequestSendForm.readyState == 4)
		{
			// Возвращаем обычный курсор
			document.body.style.cursor = '';

			// Убираем затемнение.
			HideLoadingScreen();

			if (typeof callback_function != 'undefined')
			{
				callback_function(JsHttpRequestSendForm.responseJS);
			}
			
			return true;
		}
	}

	// Определим action у формы
	// fix bug with IE 6 and getAttribute('') return [object]
	var FormAction = FormNode.attributes['action'].value;

	// Определим метод формы
	var FormMethod = FormNode.getAttribute('method');

	// передача параметров AAdditionalParams сделана явно, а не через hostcmsAAdditionalParams
	FormAction += (FormAction.indexOf('?') >= 0 ? '&' : '?') + AAdditionalParams;

	// Prepare request object (automatically choose GET or POST).
	JsHttpRequestSendForm.open(FormMethod, FormAction, true);

	JsHttpRequestSendForm.send( { query: FormNode } );

	// Курсор ставим на часики.
	document.body.style.cursor = "wait";

	// Отображаем экран загрузки
	ShowLoadingScreen();

	return false;
}

// Отображение экрана загрузки AJAX.
function ShowLoadingScreen()
{
	var fade_div = document.getElementById('id_admin_forms_fade');

	if (fade_div == null)
	{
		// Создаем div
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

		// получаем ширину выпадающего блока и устанавливаем её для верхней и нижней границы
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

	// Отображаем div
	fade_div.style.display = 'block';

	var arrayPageSize = getPageSize();

	// 0 - pageWidth, 1 - pageHeight, 2 - windowWidth, 3 - windowHeight
	var arrayPageSize = getPageSize();

	// 0 - scrOfX, 1 - scrOfY
	var arrayScrollXY = getScrollXY();

	// Отображаем до определения размеров div-а
	var clientHeight = fade_div.clientHeight;
	fade_div.style.top = ((arrayPageSize[3] - clientHeight) / 2 + arrayScrollXY[1]) + 'px';

	var clientWidth = fade_div.clientWidth;
	fade_div.style.left = ((arrayPageSize[2] - clientWidth) / 2 + arrayScrollXY[0]) + 'px';
}

// Скрытие экрана загрузки AJAX.
function HideLoadingScreen()
{
	// Убераем затемнение.
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
		// Получаем все input-ы
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
		ElementInput.setAttribute("title", "Прикрепить файл");
		//ElementInput.setAttribute("style", "margin-bottom: 20px");
		cbItem.appendChild(ElementInput);
	}
}

// action - адрес страницы для запрос
// method - GET, POST, null - автоматическое определение
// callback_function - функция обратного вызова, которая будет вызвана после получения ответа от backenad-а
function sendBackgroundRequest(action, method, callback_function)
{
	var req = new JsHttpRequest();

	// Этот код вызовется автоматически, когда загрузка данных завершится.
	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			// Возвращаем обычный курсор
			document.body.style.cursor = '';

			if (typeof callback_function != 'undefined')
			{
				callback_function(req.responseJS);
			}

			return true;
		}
	}

	req.open(method, action, true);

	// Отсылаем данные в обработчик.
	req.send(null);

	// Курсор ставим на часики.
	document.body.style.cursor = "wait";
	
	ShowLoadingScreen();
}