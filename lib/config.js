hs.lang.loadingText = '��������...';
hs.lang.loadingTitle = '������� ��� ������';
hs.lang.focusTitle = '������ ��� ���������';
hs.lang.fullExpandTitle = '���������� � ����������� ������ (f)';
hs.lang.creditsText = '';
hs.lang.creditsTitle = '';
hs.lang.restoreTitle = '�������, ����� ������� �������� ��� ���������� ������. ����������� ������� ������, ����� ����� ������� � ��������� ��� ���������� ��������.';
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