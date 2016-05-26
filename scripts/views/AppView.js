var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var FsCollection = require('./../collections/FsCollection');
var MapView = require('./MapView');
var MapFiltersView = require('./MapFiltersView.js');
var PlaceListView = require('./PlaceListView.js');

module.exports = Backbone.View.extend({
	initialFilters: [
		{
	 		key: "motion_to",
		 	value: "í"
		},
		{
	 		key: "motion_to",
		 	value: "á"
		},
		{
	 		key: "motion_to",
		 	value: "til"
		},
		{
	 		key: "motion_from",
		 	value: "úr"
		},
		{
	 		key: "motion_from",
		 	value: "af"
		},
		{
	 		key: "motion_from",
		 	value: "frá"
		},
		{
	 		key: "stay",
		 	value: "í"
		},
		{
	 		key: "stay",
		 	value: "á"
		}
	],

	initialize: function() {
		this.render();
	},

	events: {
		'click .menu-tabs a': 'menuTabClick',
		'click .map-intro .close-button': 'introCloseButtonClick'
	},

	introCloseButtonClick: function() {
		this.$el.find('.map-intro').addClass('closed');
	},

	menuTabClick: function(event) {
		this.$el.find('.menu-tabs a').removeClass('selected');
		$(event.currentTarget).addClass('selected');

		this.filterView.setViewmode($(event.currentTarget).data('action'))
	},

	setInitialFilters: function() {
		_.each(this.initialFilters, _.bind(function(filter) {
			this.mapView.addLayer([filter]);
		}, this));

		this.mapView.updateMarkers();
		setTimeout(_.bind(function() {
			this.filterView.render();
		}, this), 500);
	},

	render: function() {
		this.mapView = new MapView({
			el: this.$el.find('.map-view')
		});

		this.filterView = new MapFiltersView({
			el: this.$el.find('.menu-filters'),
			collection: this.mapView.layers,
			mapView: this.mapView
		});

		this.placeList = new PlaceListView({
			el: this.$el.find('.layer-place-list')
		});

		this.filterView.on('addFilter', _.bind(function() {
			this.mapView.addLayer([]);
		}, this));
		this.filterView.on('clearFilters', _.bind(function() {
			this.mapView.clearLayers();
		}, this));
		this.filterView.on('deleteFilter', _.bind(function(event) {
			this.mapView.removeLayer(event.layer);
		}, this));

		this.filterView.on('placeClick', _.bind(function(event) {
			var marker = _.find(this.mapView.markerData, function(marker) {
				return marker.id == event.place;
			}).marker;
			marker.openPopup();
			this.mapView.map.setView(marker.getLatLng());
		}, this));

		this.placeList.on('placeClick', _.bind(function(event) {
			var marker = _.find(this.mapView.markerData, function(marker) {
				return marker.id == event.place;
			}).marker;
			marker.openPopup();
			this.mapView.map.setView(marker.getLatLng());
		}, this));

		this.filterView.on('placelist', _.bind(function(event) {
			$('.leaflet-marker-icon .marker-display .colors-container').addClass('small').addClass('opaque');

			_.each(event.markers, _.bind(function(marker) {
				$('.leaflet-marker-icon.marker-'+(marker.cid)+' .colors-container').removeClass('small').removeClass('opaque');
			}, this));
		}, this));

		this.filterView.on('placelistempty', _.bind(function(event) {
			$('.leaflet-marker-icon .marker-display .colors-container').removeClass('small').removeClass('opaque');
		}, this));

		this.filterView.on('viewmode', _.bind(function(event) {
			this.viewMode = event.viewMode;
			if (event.viewMode == 'advanced') {
				this.setInitialFilters();
			}
			if (event.viewMode == 'all') {
				this.mapView.showAllPlaces();

				this.placeList.hide();
			}
		}, this));

		this.mapView.on('renderlayers', _.bind(function(event) {
			if (this.viewMode == 'advanced') {
				this.placeList.places = _.map(event.markers, _.bind(function(marker) {
					marker.html = this.mapView.getMarkerColorHtml(marker).html;
					return marker;
				}, this));

				this.placeList.listHeader = null;
				this.placeList.render();
				this.placeList.show();
			}
		}, this));

		this.filterView.on('labelMouseEnter', _.bind(function(event) {
			$('.leaflet-marker-icon .marker-display .colors-container').removeClass('small');
			$('.leaflet-marker-icon .marker-display .colors-container:not(.layer-'+(event.layerIndex)+')').addClass('small');
			$('.leaflet-marker-icon .marker-display .colors-container').removeClass('full-part');
			$('.leaflet-marker-icon .marker-display .marker-label').removeClass('visible');
			$('.leaflet-marker-icon .marker-display .colors-container .part').removeClass('full-part');
			$('.leaflet-marker-icon .marker-display .colors-container.layer-'+(event.layerIndex)).addClass('full-part');
			$('.leaflet-marker-icon .marker-display .marker-label.layer-'+(event.layerIndex)).addClass('visible');
			$('.leaflet-marker-icon .marker-display .colors-container.layer-'+(event.layerIndex)+' .part.part-layer-'+(event.layerIndex)).addClass('full-part');
		}, this));
		this.filterView.on('labelMouseLeave', _.bind(function(event) {
			$('.leaflet-marker-icon .marker-display .colors-container').removeClass('small');
			$('.leaflet-marker-icon .marker-display .colors-container').removeClass('full-part');
			$('.leaflet-marker-icon .marker-display .marker-label').removeClass('visible');
			$('.leaflet-marker-icon .marker-display .colors-container .part').removeClass('full-part');
		}, this));

		this.filterView.on('layerClick', _.bind(function(event) {
			var layerPlaces = this.mapView.layers.at(event.index).get('view').mapData;

			var filtersString = _.map(this.mapView.layers.at(event.index).get('filters'), _.bind(function(filter) {
				return _.find(this.filterView.filterOptions, function(option) {
					return option.field == filter.key;
				}).label+': '+filter.value
			}, this)).join(', ');

			this.placeList.places = _.map(layerPlaces.models, _.bind(function(place) {
				var placeData = place.toJSON();
				placeData.id = place.cid;
				return placeData;
			}, this));

			this.placeList.listHeader = filtersString;

			this.placeList.render();
			this.placeList.show();
		}, this));

		this.mapView.on('dataLoaded', _.bind(function() {
			this.filterView.setViewmode('all');
		}, this));



		return this;
	}
});