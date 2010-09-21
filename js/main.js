// http://code.google.com/intl/es-ES/apis/maps/documentation/javascript/services.html#Geocoding
// http://jqueryui.com/demos/autocomplete/

// For autoselect the first entry
(function( $ ) {
	$( ".ui-autocomplete-input" ).live( "autocompleteopen", function() {
		var autocomplete = $( this ).data( "autocomplete" ),
			menu = autocomplete.menu;

		if ( !autocomplete.options.selectFirst ) {
			return;
		}
		menu.activate( $.Event({ type: "mouseenter" }), menu.element.children().first() );
	});
}(jQuery));

var geocoder;

function initialize(){
	geocoder = new google.maps.Geocoder();
}

var IndoorPro = {};
IndoorPro.Geolocation = {
	initialize: function(){
		try{
			IndoorPro.Geolocation.geocoder = new google.maps.Geocoder();
		}catch(e){
			IndoorPro.Geolocation.geocoder = null;
		}

		$('.country-selector').autocomplete({
			selectFirst: true,
			search: IndoorPro.Geolocation.discard,
			source: IndoorPro.Geolocation.localities,
			select: IndoorPro.Geolocation.select
		});
		
		$('.clear').click(IndoorPro.Geolocation.reset);
	},
	
	geocoder: null,
		
	localities: function(request, response){
		var geocoder = IndoorPro.Geolocation.geocoder;
		if (!geocoder) return response(IndoorPro.Geolocation.dummyData());
		
		geocoder.geocode({ 'address': request.term }, 
			function(results, status){
				response($.map(results, function(item){
					if (item.types[0] == 'locality'){
						return {
							label: item.formatted_address,
							value: item.formatted_address,
							latitude: item.geometry.location.lat(),
							longitude: item.geometry.location.lng()
						}
					}
				}));
		  }
		);
	},
	
	select: function(event, ui){
		$('.country-info').attr('value', ui.item.value).removeAttr('disabled');
		$('.wrap').addClass('selected');
	},
	
	// reset the text and hidden input
	reset: function(){
		IndoorPro.Geolocation.discard();
		$('.country-selector').val('').focus();
	},
	
	// Discard the latest match
	discard: function(){
		$('.wrap').removeClass('selected');
		$('.country-info').val('').attr('disabled', 'disabled');
	},
	
	// testing
	dummyData: function(){
		return [
			{label: 'Valencia, España', value: 'Valencia, España'},
			{label: 'Valencia, Venzuela', value: 'Valencia, Venezuela'},
			{label: 'Valdepeñas, España', value: 'Valdepeñas, España'}
			];
	}
}

$(document).ready(function(){         
	IndoorPro.Geolocation.initialize();
});