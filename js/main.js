// http://code.google.com/intl/es-ES/apis/maps/documentation/javascript/services.html#Geocoding
// http://jqueryui.com/demos/autocomplete/

var Maps = {};
Maps.Geolocation = {
	/* options
	      selector: .location-selector,
	      formatted: .location-formatted,
	      location: .location-location,
	      geolocation: .location-geolocation
	  */
	initialize: function(opts){
		Maps.Geolocation.opts = $.extend({}, Maps.Geolocation.defaults, opts);
		
		try{
			Maps.Geolocation.geocoder = new google.maps.Geocoder();
		}catch(e){
			Maps.Geolocation.geocoder = null;
		}

		$(Maps.Geolocation.opts.selector).autocomplete({
      selectFirst: true,
      search: Maps.Geolocation.discard,
      source: Maps.Geolocation.localities,
      select: Maps.Geolocation.select
    }).keypress(Maps.Geolocation.avoidSubmitFormWithEnterKey);
		
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
              location: $.map(item.address_components, function(item){ return item.long_name }).join(", "),
              latitude: item.geometry.location.lat(),
              longitude: item.geometry.location.lng(),
							geolocation: [item.geometry.location.lat(), item.geometry.location.lng()].join(", ")
						}
					}
				}));
		  }
		);
	},
	
	select: function(event, ui){
		$(Maps.Geolocation.opts.formatted).removeAttr('disabled').val(ui.item.value);
    $(Maps.Geolocation.opts.location).removeAttr('disabled').val(ui.item.location);
    $(Maps.Geolocation.opts.geolocation).removeAttr('disabled').val(ui.item.geolocation);
    $('.wrap').addClass('selected');
	},
	
	// reset the text and hidden input
	reset: function(){
		Maps.Geolocation.discard();
		$(Maps.Geolocation.opts.selector).val('').focus();
	},
	
	// Discard the latest match
	discard: function(){
		$(Maps.Geolocation.opts.formatted).val('').attr('disabled', 'disabled');
    $(Maps.Geolocation.opts.location).val('').attr('disabled', 'disabled');
    $(Maps.Geolocation.opts.geolocation).val('').attr('disabled', 'disabled');
	},
  // We don't want to send the form using enter key
  avoidSubmitFormWithEnterKey: function(evt){
    if(evt.which == 13){
      evt.preventDefault();
    }
  },
	
	// testing
	dummyData: function(){
		return [
			{label: 'Valencia, España', value: 'Valencia, España'},
			{label: 'Valencia, Venzuela', value: 'Valencia, Venezuela'},
			{label: 'Valdepeñas, España', value: 'Valdepeñas, España'}
			];
	},
  defaults: {
    selector: '.location-selector',
    formatted: '.location-formatted',
    location: '.location-location',
    geolocation: '.location-geolocation'
  }
}

$(document).ready(function(){         
	Maps.Geolocation.initialize();
});
