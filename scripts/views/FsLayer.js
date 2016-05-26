var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
require('../lib/leaflet');

module.exports = Backbone.View.extend({
	initialize: function(options) {
		this.options = options;

		this.mapData = this.options.mapData;

//		this.layer = L.featureGroup();
//		this.options.mapView.map.addLayer(this.layer);

		this.render();
	},

	updateFilters: function(filters) {
		this.options.filters = filters;
		this.mapData = this.options.mapView.collection.getFiltered(filters);
		this.trigger('updateFilters');
//		this.render();
	},

	removeFromMap: function() {
//		this.options.mapView.map.removeLayer(this.layer);
	},

	render: function() {
/*
		this.layer.clearLayers();

		_.each(this.mapData.models, _.bind(function(model) {
			var template = _.template($("#markerPopupTemplate").html());
			var marker = L.marker([model.get('coordination').lat, model.get('coordination').lng], {
				title: model.get('name'),
				icon: this.options.mapView.markerIcons[this.options.mapView.layers.length]
			}).bindPopup(template({
				model: model
			})).on('popupopen', _.bind(function(event) {
			}, this));

			this.layer.addLayer(marker);
		}, this));
*/
	}
});

