var prev_comment = 0;

// Ответ на комментарий
function cr(comment_id)
{
	if (prev_comment && prev_comment != comment_id)
	{
		document.getElementById(prev_comment).style.display = 'none';
	}

	var div = document.getElementById(comment_id);
	
	if (div.style.display != 'block')
	{
		div.style.display = 'block';
	}
	else
	{
		div.style.display = 'none';
	}

	prev_comment = comment_id;
}

var temp_ChildId = '';
var temp_CurrenElementId = '';
var menu_timeout_id = 0;
var filter_timeout_id = 0;

// обработчик наведения мыши на меню
function TopMenuOver(CurrenElementId, ChildId)
{
	clearTimeout(menu_timeout_id);

	if (temp_CurrenElementId != ''
	&& temp_CurrenElementId != CurrenElementId)
	{
		var oTemp_ChildId = document.getElementById(temp_ChildId);

		if (oTemp_ChildId)
		{
			oTemp_ChildId.style.display = "none";
		}
	}

	temp_ChildId = ChildId;
	temp_CurrenElementId = CurrenElementId;

	if (CurrenElementId == undefined)
	{
		return false;
	}

	if (ChildId != '')
	{
		var oChildId = document.getElementById(ChildId);

		if (oChildId)
		{
			oChildId.style.display = "block";
			//oChildId.style.opacity = 0.4;
			//	oChildId.style.filter = 'alpha(opacity=100, style=1, finishopacity=60)';
			//oChildId.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=0, style=0)";
		}
	}
}

// обработчик уведения мыши с меню
function TopMenuOut(CurrenElementId, ChildId)
{
	if (CurrenElementId == undefined)
	{
		return false;
	}

	if (ChildId != '')
	{
		var oChildId = document.getElementById(ChildId);
		if (oChildId)
		{
			menu_timeout_id = setTimeout(function (){oChildId.style.display = "none"}, 300);
		}
	}
}

// Функция обратного вызова для AddIntoCart
function callbackfunction_AddIntoCart(responseJS)
{
	// Результат принят
	sended_request = false;
	
	if (typeof responseJS != 'undefined')
	{
		// Данные.
		if (typeof responseJS.cart != 'undefined')
		{
			html = responseJS.cart;

			var little_cart = document.getElementById('little_cart');
			
			if (little_cart)
			{
				little_cart.innerHTML = html;
				document.getElementById('dialog_box').style.visibility = "visible";
				document.getElementById('dialog_box_background').style.visibility = "visible";
			}
			else
			{
				alert('Ошибка! Краткая корзина не найдена');
			}
		}
	}
}

function AddIntoCart(shop_path, item_id, item_count)
{
	//location.href = shop_path + 'cart/?ajax_add_item_id=' + item_id + '&count=' + item_count;
	cmsrequest = shop_path + 'cart/?ajax_add_item_id=' + item_id + '&count=' + item_count;
	
	// Отправляем запрос backend-у
	sendRequest(cmsrequest, 'get', callbackfunction_AddIntoCart);
	
	return false;
}

// Установка или снятие всех флажков для checkbox'ов элементов.
function SelectAllItems(ASelect, prefix)
{
	element_array = document.getElementsByTagName("input");
	if (element_array.length > 0)
	{
		for (var i = 0; i < element_array.length; i++)
		{
			if (element_array[i].name.search(prefix) != -1)
			{
				// Устанавливаем checked
				element_array[i].checked = ASelect;
			}
		}

	}
}

if (document.images)
{	
    var img = new Object();

    img["tl_angle_pull_down"] = new Image();	
    img["tl_angle_pull_down"].src = '/images/tl_angle_pull_down.png';

    img["tr_angle_pull_down"] = new Image();	
    img["tr_angle_pull_down"].src = '/images/tr_angle_pull_down.png';

    img["bl_angle_pull_down"] = new Image();	
    img["bl_angle_pull_down"].src = '/images/bl_angle_pull_down.png';

    img["br_angle_pull_down"] = new Image();	
    img["br_angle_pull_down"].src = '/images/br_angle_pull_down.png';
}