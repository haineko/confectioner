hs.lang.loadingText = 'Загрузка...';
hs.lang.loadingTitle = 'Нажмите для отмены';
hs.lang.focusTitle = 'Нжмите для активации';
hs.lang.fullExpandTitle = 'Развернуть в натуральный размер (f)';
hs.lang.creditsText = '';
hs.lang.creditsTitle = '';
hs.lang.restoreTitle = 'Нажмите, чтобы закрыть картинку или перетащите мышкой. Используйте стрелки вправо, влево чтобы перейти к следующей или предыдущей картинке.';
hs.graphicsDir = 'img/highslide/';
	hs.align = 'center';
	hs.transitions = ['expand', 'crossfade'];
	hs.wrapperClassName = 'dark floating-caption';
	hs.fadeInOut = true;
	hs.dimmingOpacity = .75;
	if (hs.addSlideshow) hs.addSlideshow({
		interval: 5000,
		repeat: false,
		useControls: true,
		fixedControls: 'fit',
		overlayOptions: {
			opacity: .6,
			position: 'bottom center',
			hideOnMouseOut: true
		}
	});