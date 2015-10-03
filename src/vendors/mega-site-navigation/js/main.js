var MqL = 1170;

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
		if($('.top-bar').hasClass('expanded')) $('.top-bar').removeClass('expanded');
		if($(window).width() > MqL && $('.search').hasClass('is-visible')) $('.search').find('input[type="search"]').focus();
		($('.search').hasClass('is-visible')) ? $('.overlay').addClass('is-visible') : $('.overlay').removeClass('is-visible') ;
	}
}

jQuery(document).ready(function($){

	//open search form
	$('.search-trigger').on('click', function(event){
		event.preventDefault();
		toggleSearch();
	});


	$('.overlay').on('click', function(){
		toggleSearch('close')
		$('.overlay').removeClass('is-visible');
	});


});
