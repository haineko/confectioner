(function() {
	var html = $('html');

	html.removeClass('no-js').addClass( 'js ' + $.browser.name);
	
	if ( $.browser.webkit ) {
		html.addClass('webkit')
	};
})();

jQuery(document).ready(function($) {

	if (window.location.search == '?new' || window.location.search.indexOf('&new') != -1)
	{
		$('a').each(function(){
			if ($(this).attr('href') && $(this).attr('href').indexOf('#') === -1 && $(this).attr('href').indexOf('javascript') === -1)
			{
				if ($(this).attr('href').indexOf('?') === -1)
				{
					var href = $(this).attr('href')+'?new';
				}
				else
				{
					var href = $(this).attr('href')+'&new';
				}
				$(this).attr('href', href)
			}
		});
	}

	$('.dropdown').children('a').on('click', function(event) {
		if ( $(window).innerWidth() > 1182 ) {
			var link = location.origin + $(this).attr('href');
			location.href = link;
		}
	});


	$("a[href$=jpg], a[href$=gif], a[href$=png], a[href$=jpeg], a[href$=JPG], a[href$=GIF], a[href$=PNG], a[href$=JPEG]").each(function() {
		if (!$(this).closest('.js-flickity').length)
		{
			$(this).click(function() {hs.expand(this); return false;})
		}
		else
		{
			$(this).click(function(e) {e.preventDefault();})
		}
	});
	/*
	$("a[href$=jpg]").click(function() {
		if (!$(this).closest('.js-flickity').length)
		{
			hs.expand(this);
		}
		return false;
	});
	$("a[href$=gif]").click( function(){ hs.expand(this); return false;});
	$("a[href$=png]").click( function(){ hs.expand(this); return false;});
	$("a[href$=jpeg]").click( function(){ hs.expand(this); return false;});
	$("a[href$=JPG]").click( function(){ hs.expand(this); return false;});
	$("a[href$=GIF]").click( function(){ hs.expand(this); return false;});
	$("a[href$=PNG]").click( function(){ hs.expand(this); return false;});
	$("a[href$=JPEG]").click( function(){ hs.expand(this); return false;});
	*/

	$('#count-item').keyup(function(e){
		e = e || window.event;
		if (e.keyCode === 13)
		{
			$('#order-item').click();
		}
	});

	$('input[name=delivery]').click(function(){
		$('select[name=payment]').empty();
		if ($(this).val() == 3 || $(this).val() == 10 || $(this).val() == 17)
		{
			$('select[name=payment]').append($('<option value="Наличные">Наличные</option>'));
		}
		$('select[name=payment]').append($('<option value="Пластиковая карта (PayPal)">Пластиковая карта (PayPal)</option>'));
		if ($(this).val() == 2 || $(this).val() == 8 || $(this).val() == 10 || $(this).val() == 17 || $(this).val() == 11)
		{
			$('select[name=payment]').append($('<option value="Банковский перевод">Банковский перевод</option>'));
		}

		if ($(this).val() == 3)
		{
			$('.address-index').hide();
			$('.address-index input').removeAttr('required');
		}
		else
		{
			$('.address-index').show();
			$('.address-index input').attr('required', '1');
		}
	});
	if ($('#delivery3').length)
	{
		$('#delivery3').click();
	}

	(function() {
		var headerSearch = $('.header-search'),
			searchClose = headerSearch.find('.search-close'),
			input = headerSearch.find('input');

		searchClose.on('click', function(e) {
			input.val('');
			$(this).css('display', 'none');
		});

		input.on('input', function(e) {
			if ( input.val() ) {
				searchClose.css('display', 'block');
			} else {
				searchClose.css('display', 'none');
			}
		});
	})()

	$('.qual-input').on('click', 'span', function(event) {
		var spanClass = event.currentTarget.className,
			qtyVal = parseInt( $(this).parent().find('.qty-val').val() );
		if ( spanClass == 'btn qty-down' && qtyVal > 1 ) {
			$(this).parent().find('.qty-val').val(qtyVal - 1)
		} else if (spanClass == 'btn qty-up') {
			$(this).parent().find('.qty-val').val(qtyVal + 1)
		} else {
			$(this).parent().find('.qty-val').val(1)
		}
	});
	
	$('#owl-popular').owlCarousel({
	    //items : 6,
	    pagination: false,
	    navigation: true,
	    navigationText: false,
	  	itemsDesktop : [1200,4],
	  	itemsDesktopSmall : [900,3],
	  	itemsTablet: [600,1]
	});

	$('#owl-sale').owlCarousel({
	    //items : 6,
	    pagination: false,
	    navigation: true,
	    navigationText: false,
	  	itemsDesktop : [1200,4],
	  	itemsDesktopSmall : [900,3],
	  	itemsTablet: [600,1]
	});

	$('#owl-novelty').owlCarousel({
	    //items : 6,
	    pagination: false,
	    navigation: true,
	    navigationText: false,
	  	itemsDesktop : [1200,4],
	  	itemsDesktopSmall : [900,3],
	  	itemsTablet: [600,1]
	});

	$('#submit_callback').click(function() {
		$.post('/callback/', {name: $('#name').val(), phone: $('#phone').val(), Submit: 1}, function(data){
			if ($.trim(data) != 'ok')
			{
				$('.callback_error').html('Ошибка! Попробуйте ещё раз.');
				$('.callback_success').html('');
			}
			else
			{
				$('.callback_success').html('Ваш заказ принят!');
				$('.callback_error').html('');
				$('#submit_callback').hide();
			}
		});
		return false;
	});

	$('#submit_order1click').click(function() {
		dataSubmit = {url: window.location.href, good: $('.product-specification').find('h1').text(), price: $('.page-price .price').text(), phone: $('#order1click_phone').val(), Submit: 1};
		$.post('/order1click/', dataSubmit, function(data){
			if ($.trim(data) != 'ok')
			{
				$('.order1click_error').html('Ошибка! Попробуйте ещё раз.');
				$('.order1click_success').html('');
			}
			else
			{
				$('.order1click_success').html('Ваш заказ принят!');
				$('.order1click_error').html('');
				$('#submit_order1click').hide();
			}
		});
		return false;
	});

	$('.custom-upload').on('change', 'input', function(e) {
		var file = e.target.files[0];
		drawInputImage($(this), file)
	});

	(function() {
		var $item = $('.goods-item'),
			$discriptions = $item.find('.goods-discriptions'),
			$child = $discriptions.children();

		$child.each(function(index, el) {
			if ( $(el).text().length < 6 ) {
				$(el).css('display', 'none');
			}
		});

	})();

	$('.view-table').each(function(index, el) {
		var imgItemTitle = $(this).find('img').attr('alt');
		$(this).wrap("<div class='block-view-table'></div>");

		if (imgItemTitle) {
			$(this).after('<p class="view-table-dscr">' + imgItemTitle + '</p>');
		}
	});

});

function drawInputImage(obj, file)
{
	var ctx = $(obj).next();
	if ($(ctx).is('canvas'))
	{
		ctx = ctx.get(0).getContext('2d');
		var img = new Image;
		if (file != undefined)
		{
			img.src = URL.createObjectURL(file);
			img.onload = function()
			{
				ratio = Math.max(img.width / 100, img.height / 75);
				width = Math.round(img.width / ratio);
				height = Math.round(img.height / ratio);
				ctx.drawImage(img, Math.round((100-width)/2), Math.round((75-height)/2), width, height);
			}
		}
		else
		{
			ctx.clearRect(0, 0, 100, 75);
		}
	}
}
function CheckCartForm1()
{
	var coupon = $('form[name=address] input[name=shop_coupon_text]').val();
	$('form[name=bystro] input[name=shop_coupon_text]').val(coupon);
	if (document.bystro.elements['site_users_surname'].value == "")
	{
		alert ("\nЗаполните поле \"Фамилия\"!\t\n")
		document.bystro.elements['site_users_surname'].focus();
		return false;      
	}
	if (document.bystro.elements['site_users_name'].value == "")
	{
		alert ("\nЗаполните поле \"Имя\"!\t\n")
		document.bystro.elements['site_users_name'].focus();
		return false;      
	}
	if (!$('#delivery3').is(':checked'))
	{
		if (document.bystro.elements['country'].value == "0")
		{
			alert ("\nЗаполните поле \"Страна\"!\t\n")
			document.bystro.elements['country'].focus();
			return false;      
		}
		if (document.bystro.elements['location'].value == "0")
		{
			alert ("\nЗаполните поле \"Область\"!\t\n")
			document.bystro.elements['location'].focus();
			return false;      
		}
		if (document.bystro.elements['sel_city'].value == "0")
		{
			alert ("\nЗаполните поле \"Город\"!\t\n")
			document.bystro.elements['sel_city'].focus();
			return false;      
		}
		if (document.bystro.elements['index'].value == "")
		{
			alert ("\nЗаполните поле \"Индекс\"!\t\n")
			document.bystro.elements['index'].focus();
			return false;      
		}
		if (document.bystro.elements['index'].value.search(/^[1-9][0-9]{5}$/i) === -1)
		{
			alert ("\nВведите корректный \"Индекс\"!\t\n")
			document.bystro.elements['index'].focus();
			return false;      
		}
		if (document.bystro.elements['site_users_address'].value == "")
		{
			alert ("\nЗаполните поле \"Адрес\"!\t\n")
			document.bystro.elements['site_users_address'].focus();
			return false;      
		}
	}
	if (document.bystro.elements['site_users_phone'].value == "")
	{
		alert ("\nЗаполните поле \"Телефон\"!\t\n")
		document.bystro.elements['site_users_phone'].focus();
		return false;      
	}
	if (document.bystro.elements['site_users_fax'].value == "")
	{
		alert ("\nЗаполните поле \"E-mail\"!\t\n")
		document.bystro.elements['site_users_fax'].focus();
		return false;      
	}
	if (document.bystro.elements['site_users_fax'].value.search(/.@./i) === -1)
	{
		alert ("\nВведите корректный \"E-mail\"!\t\n")
		document.bystro.elements['site_users_fax'].focus();
		return false;      
	}
	return true;
}

function CheckCartForm2()
{
	if (document.registration.elements['site_users_login'].value == "")
	{
		alert ("\nЗаполните поле \"Логин\"!\t\n")
		document.registration.elements['site_users_login'].focus();
		return false;      
	}
	if (document.registration.elements['site_users_password'].value == "")
	{
		alert ("\nЗаполните поле \"Пароль\"!\t\n")
		document.registration.elements['site_users_password'].focus();
		return false;      
	}
	if (document.registration.elements['site_users_password_retry'].value == "")
	{
		alert ("\nЗаполните поле \"Повтор пароля\"!\t\n")
		document.registration.elements['site_users_password_retry'].focus();
		return false;      
	}
	if (document.registration.elements['site_users_email'].value == "")
	{
		alert ("\nЗаполните поле \"E-mail\"!\t\n")
		document.registration.elements['site_users_email'].focus();
		return false;      
	}
	if (document.registration.elements['site_users_surname'].value == "")
	{
		alert ("\nЗаполните поле \"Фамилия\"!\t\n")
		document.registration.elements['site_users_surname'].focus();
		return false;      
	}
	if (document.registration.elements['site_users_name'].value == "")
	{
		alert ("\nЗаполните поле \"Имя\"!\t\n")
		document.registration.elements['site_users_name'].focus();
		return false;      
	}
	return true;
}

function CheckFormComments()
{
	if ($('#AddRecord input[name=autor]').length && $('#AddRecord input[name=autor]').val() == "")
	{
		alert ("\nЗаполните поле \"Ваше имя\"!\t\n")
		$('#AddRecord input[name=autor]').focus();
		return false;      
	}
	if ($('#AddRecord input[name=email]').length && $('#AddRecord input[name=email]').val() == "")
	{
		alert ("\nЗаполните поле \"E-mail\"!\t\n")
		$('#AddRecord input[name=email]').focus();
		return false;      
	}
	if ($('#AddRecord input[name=email]').length && $('#AddRecord input[name=email]').val().search(/.@./i) === -1)
	{
		alert ("\nВведите корректный \"E-mail\"!\t\n")
		$('#AddRecord input[name=email]').focus();
		return false;      
	}
	if ($('#AddRecord textarea[name=text_item]').val() == "")
	{
		alert ("\nЗаполните поле \"Текст отзыва\"!\t\n")
		$('#AddRecord textarea[name=text_item]').focus();
		return false;      
	}
	if ($('#AddRecord input[name=captcha_keystring]').length && $('#AddRecord input[name=captcha_keystring]').val() == "")
	{
		alert ("\nЗаполните поле \"Контрольные цифры\"!\t\n")
		$('#AddRecord input[name=captcha_keystring]').focus();
		return false;      
	}
}


function ShowGoods(type)
{
	setcookieShowGoods(type);
	location.reload();
}

function setcookieShowGoods(value)
{
	setcookie('ShowGoods', value, (new Date).getTime() + (30 * 24 * 60 * 60 * 1000), '/shop/');
}

function setcookie(name, value, expires, path, domain, secure)
{
	document.cookie = name + "=" + escape(value) +
		((expires) ? "; expires=" + (new Date(expires)) : "") +
		((path) ? "; path=" + path : "") +
		((domain) ? "; domain=" + domain : "") +
		((secure) ? "; secure" : "");
}

function getcookie(name)
{
	var cookie = " " + document.cookie;
	var search = " " + name + "=";
	var setStr = null;
	var offset = 0;
	var end = 0;
	
	if (cookie.length > 0)
	{
		offset = cookie.indexOf(search);
		
		if (offset != -1)
		{
			offset += search.length;
			end = cookie.indexOf(";", offset)
			
			if (end == -1)
			{
				end = cookie.length;
			}
			
			setStr = unescape(cookie.substring(offset, end));
		}
	}
	
	return(setStr);
}
