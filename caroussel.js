$(document).ready(function(){
	createCaroussel($('div[data-caroussel=caroussel]'));
	setVisibleInCaroussel($('div[data-caroussel=caroussel]'), 0);
	setAutoChange($('div[data-caroussel=caroussel]'));
});

function createCaroussel(carousselElement){
	carousselElement.append('<div class="caroussel"></div>');
	carousselElement.append('<div class="caroussel-pin-wrapper"></div>');
	var pins = carousselElement.find('.caroussel-pin-wrapper');
	var data = carousselElement.find('[data-caroussel=data]');
	data.hide();

	// ADD EACH IMAGE FROM DATA
	data.children('span[data-url]').each(function(){
		$(this).closest('div[data-caroussel=caroussel]').find('.caroussel').append('<div class="caroussel-img-wrapper"><img src="'+$(this).attr('data-url')+'"/></div>');
		if ($(this).parent().attr('data-caroussel-pin') != 'false')
			$(this).closest('div[data-caroussel=caroussel]').find('.caroussel-pin-wrapper').append('<div class="caroussel-pin"></div>');
	});

	// COUNT THE NUMBER OF IMAGES AND MEMORIZE DELAY AND COUNT
	carousselElement.each(function(){
		$(this).attr('data-nbr-images', $(this).find('.caroussel-img-wrapper').length);
		var delay = parseInt($(this).find('[data-caroussel=data]').attr('data-caroussel-delay'));
		if (delay){
			$(this).attr('data-delay', delay);
	
			// ADD A PROGRESS INDICATOR ON THE IMAGE
			if ($(this).find('[data-caroussel=data]').attr('data-caroussel-progress-bar') == 'true')
				$(this).find('.caroussel').append('<div class="caroussel-progress-bar"></div>');
				$(window).resize(function(e){
					adjustProgressBar($('div[data-caroussel=caroussel]'));
				});
		}
	});

	// ADD EVENT HANDLER ON PINS
	pins.find('.caroussel-pin').click(function(e){
		setVisibleInCaroussel($(this).closest('div[data-caroussel=caroussel]'), $(this).index());
		setAutoChange($(this).closest('div[data-caroussel=caroussel]'));
	});

	// ADD CLICK EVENT ON PHOTOS
	carousselElement.find('.caroussel-img-wrapper img').click(function(e){
		// click on right of the photo
		if (e.pageX < ($(this).offset().left + ($(this).width() / 4))){
			var caroussel = $(this).closest('div[data-caroussel=caroussel]');
			decreaseVisibleInCaroussel(caroussel);
			setAutoChange(caroussel);
		}
		else if (e.pageX > ($(this).offset().left + (3 * ($(this).width() / 4)))){
			var caroussel = $(this).closest('div[data-caroussel=caroussel]');
			increaseVisibleInCaroussel(caroussel);
			setAutoChange(caroussel);
		}
	});
}

function setAutoChange(carousselElement){
	// SET AUTOMATIC FUNCTION
	carousselElement.each(function(){
		var caroussel = $(this);
		if (parseInt(caroussel.attr('data-delay'))){
			// IF A LOOP FUNCTION IS ALREADY ATTACHED, WE CLOSE IT
			if (parseInt(caroussel.attr('data-interval-function'))) clearInterval(parseInt(caroussel.attr('data-interval-function')));
			if (parseInt(caroussel.attr('data-interval-function-progress-bar'))) clearInterval(parseInt(caroussel.attr('data-interval-function-progress-bar')));
			// WE LAUNCH A LOOP FUNCTION TO CHANGE THE IMAGE
			caroussel.attr('data-interval-function', setInterval(function(){
				increaseVisibleInCaroussel(caroussel);
			}, parseInt(caroussel.attr('data-delay'))));
			// WE LAUNCH A LOOP FUNCTION TO CHANGE THE PROGRESS BAR
			if (caroussel.find('[data-caroussel=data]').attr('data-caroussel-progress-bar') == 'true'){
				var nbrOfRefreshRequired = parseInt(caroussel.attr('data-delay')) / 40;
				caroussel.attr('data-interval-function-progress-bar', setInterval(function(){
					var progressBar = caroussel.find('.caroussel-progress-bar');
					progressBar.css('width', Math.min(progressBar.width() + parseInt(progressBar.attr('data-width'))/nbrOfRefreshRequired, parseInt(progressBar.attr('data-width'))));
				}, 39));
			}
		}
	});
}

function increaseVisibleInCaroussel(carousselElement){
	setVisibleInCaroussel(carousselElement, (parseInt(carousselElement.attr('data-current-index'))+1) % carousselElement.attr('data-nbr-images'));
}

function decreaseVisibleInCaroussel(carousselElement){
	var index = parseInt(carousselElement.attr('data-current-index')) - 1;
	if (index < 0) index = parseInt(carousselElement.attr('data-nbr-images')) + index;
	setVisibleInCaroussel(carousselElement, index);
}

function setVisibleInCaroussel(carousselElement, index){
	// MEMORIZE THE INDEX
	carousselElement.attr('data-current-index', index);
	// SHOW THE IMAGE
	carousselElement.find('.caroussel').find('.caroussel-img-wrapper').hide();
	carousselElement.find('.caroussel').find('.caroussel-img-wrapper:eq('+index+')').show();
	// ACTIVE THE PIN
	carousselElement.find('.caroussel-pin-wrapper').find('.caroussel-pin').removeClass('active');
	carousselElement.find('.caroussel-pin-wrapper').find('.caroussel-pin:eq('+index+')').addClass('active');
	// INITIALIZE THE PROGRESS BAR
	if (carousselElement.find('[data-caroussel=data]').attr('data-caroussel-progress-bar') == 'true'){
		adjustProgressBar(carousselElement);
		carousselElement.find('.caroussel').each(function(){
			$(this).find('.caroussel-progress-bar').css('width', 0);
		});
	}
}

function adjustProgressBar(carousselElement){
	carousselElement.find('.caroussel').each(function(){
		var progressBar = $(this).find('.caroussel-progress-bar');
		var visibleImgWrapper = $(this).find('.caroussel-img-wrapper:visible');
		progressBar.css('top', visibleImgWrapper.offset().top + (visibleImgWrapper.height()*(9/10)));
		progressBar.css('left', visibleImgWrapper.offset().left);
		progressBar.css('height', visibleImgWrapper.height()/10);
		progressBar.attr('data-width', visibleImgWrapper.width());
	});
}