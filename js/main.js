// http://code.google.com/intl/es-ES/apis/maps/documentation/javascript/services.html#Geocoding
// http://jqueryui.com/demos/autocomplete/

var Maps = {};
Maps.Geolocation = {
	initialize: function(){
		try{
			Maps.Geolocation.geocoder = new google.maps.Geocoder();
		}catch(e){
			Maps.Geolocation.geocoder = null;
		}

		$('.country-selector').autocomplete({
			selectFirst: true,
			search: Maps.Geolocation.discard,
			source: Maps.Geolocation.localities,
			select: Maps.Geolocation.select
		});
		
		$('.clear').click(Maps.Geolocation.reset);
	},
	
	geocoder: null,
		
	localities: function(request, response){
		var geocoder = Maps.Geolocation.geocoder;
		if (!geocoder) return response(Maps.Geolocation.dummyData());
		
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
		Maps.Geolocation.discard();
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
	Maps.Geolocation.initialize();
});
