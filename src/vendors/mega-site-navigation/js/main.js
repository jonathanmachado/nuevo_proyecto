jQuery(document).ready(function($){
	//if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
	var MqL = 1170;

	//open search form
	$('.search-trigger').on('click', function(event){
		event.preventDefault();
		toggleSearch();
	});


	$('.overlay').on('click', function(){
		toggleSearch('close')
		$('.overlay').removeClass('is-visible');
	});



	function toggleSearch(type) {
		if(type=="close") {
			//close serach
			$('.search').removeClass('is-visible');
			$('.search-trigger').removeClass('search-is-visible');
			$('.overlay').removeClass('search-is-visible');
			$('.sticky').removeClass('search-visible');
		} else {
			//toggle search visibility
			$('.search').toggleClass('is-visible');
			$('.search-trigger').toggleClass('search-is-visible');
			$('.overlay').toggleClass('search-is-visible');
			$('.sticky').toggleClass('search-visible');
			if($(window).width() > MqL && $('.search').hasClass('is-visible')) $('.search').find('input[type="search"]').focus();
			($('.search').hasClass('is-visible')) ? $('.overlay').addClass('is-visible') : $('.overlay').removeClass('is-visible') ;
		}
	}


});
