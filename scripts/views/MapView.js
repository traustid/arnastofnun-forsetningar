var Backbone = require('backbone');
window._ = require('underscore');
var $ = require('jquery');
require('../lib/leaflet');

var FsCollection = require('./../collections/FsCollection');
var FsLayer = require('./FsLayer');

module.exports = Backbone.View.extend({
	markerColors: [
		'#0054a6',
		'#c69c6d',
		'#8dc63f',
		'#f7941d',
		'#92278f',
		'#ed1c24',
		'#cccccc',
		'#00aeef',
		'#fff200',
		'#fdc689'
	],

	markerIcons: [],

	initialize: function(options) {
		this.options = options;

		this.collection = new FsCollection();
		this.collection.on('reset', _.bind(function() {
			this.trigger('dataLoaded');
		}, this), this);
		this.layers = new Backbone.Collection();

		this.markerPopupTemplate = _.template($("#markerPopupTemplate").html());

		this.renderMap();
	},

	createIcons: function() {
		_.each(this.markerColors, _.bind(function(color) {
			var randX = Math.round(Math.random()*20)-10;
			var randY = Math.round(Math.random()*20)-10;

			this.markerIcons.push(
				L.icon({
					iconUrl: siteRoot+'/img/map-marker-'+color+'.png',
					shadowUrl: siteRoot+'/img/map-marker-shadow.png',
					iconSize:     [15, 23],
					shadowSize:   [14, 10],
					iconAnchor:   [8+randX, 22+randY],
					shadowAnchor: [8+randX, 22+randY],
					popupAnchor:  [-1, -15]
				})
			);
		}, this));
	},

	addLayer: function(filters) {
		var fsLayer = new FsLayer({
			filters: filters,
			mapData: this.collection.getFiltered(filters),
			mapView: this
		});
		fsLayer.on('updateFilters', this.updateMarkers, this);
		this.layers.add({	
			view: fsLayer,
			filters: filters
		});
	},

	removeLayer: function(layer) {
		this.layers.remove(layer);
		this.updateMarkers();
	},

	clearLayers: function() {
		this.layers.reset();
		this.updateMarkers();
	},

	showAllPlaces: function() {
		this.markers.clearLayers();

		this.markerData = _.map(this.collection.models, function(model) {
			var modelData = model.toJSON();
			modelData.id = model.cid;
			return modelData;
		});

		_.each(this.markerData, _.bind(function(markerItem, index) {
			var marker = this.createMarker(markerItem, true);

			if (marker) {
				markerItem.marker = marker;
				this.markers.addLayer(marker);
			}
		}, this));
	},

	updateMarkers: function(event) {
		this.markers.clearLayers();

		var markerData = [];
		_.each(this.layers.models, _.bind(function(layer, index) {

			_.each(layer.get('view').mapData.models, function(layerDataItem) {
				if (_.find(markerData, function(marker) {
					return marker.name == layerDataItem.get('name') && marker.coordination == layerDataItem.get('coordination');
				})) {
				}
				else {
					var layersData = layerDataItem.toJSON();
					layersData.id = layerDataItem.cid;
					markerData.push(layersData);

				}
				var currentMarkerIndex = _.findIndex(markerData, function(marker) {
					return marker.name == layerDataItem.get('name') && marker.coordination == layerDataItem.get('coordination');
				});
				if (!markerData[currentMarkerIndex].layers) {
					markerData[currentMarkerIndex].layers = [];
				}
				markerData[currentMarkerIndex].layers.push(index);
			});
		}, this));

		this.markerData = markerData;

		_.each(markerData, _.bind(function(markerItem, index) {
			var marker = this.createMarker(markerItem);
			markerItem.marker = marker;

			this.markers.addLayer(marker);
		}, this));

		this.trigger('renderlayers', {
			markers: this.markerData
		});
	},

	getMarkerColorHtml: function(markerData) {
		var partsCount = 0;

		var layersClass = _.map(markerData.layers, function(layer) {
			return 'layer-'+layer;
		}).join(' ');

		var html = '<div class="colors-container parts-'+markerData.layers.length+' '+layersClass+'">'+
			_.map(markerData.layers, _.bind(function(layer) {
				partsCount++;
				return '<div class="part p'+partsCount+' part-layer-'+layer+'">'+
					'	<div class="inner" style="background-color: '+this.markerColors[layer]+'"></div>'+
					'</div>';

				return '<div class="color" style="background-color: '+this.markerColors[layer]+'"></div>';
			}, this)).join('')+
			'</div>';

		return {
			class: layersClass,
			html: html
		};
	},

	createMarker: function(markerData, initialSmall) {		
		if (markerData.coordination.lat && markerData.coordination.lng) {
			if (markerData.layers) {
				var markerHtml = this.getMarkerColorHtml(markerData);
			}

			var marker = L.marker(markerData.coordination, {
				title: markerData.name,
				icon: L.divIcon({
					className: 'marker-icon marker-'+markerData.id,
					html: markerData.layers ? 
						'<div class="marker-display">'+markerHtml.html+'<div class="marker-label '+markerHtml.class+'">'+markerData.name+'</div></div>' :
						'<div class="marker-display"><div class="colors-container parts-1"><div class="part p1"><div class="inner" style="background-color: '+this.markerColors[0]+'"></div></div></div><div class="marker-label"></div></div>',
					iconSize: [15, 15],
					iconAnchor: [0, 0]
				})
			});

			marker.bindPopup(this.markerPopupTemplate({
				model: markerData
			}));

			return marker;
		}
		else {
			return undefined;
		}
	},

	renderMap: function() {
		var openMapSurferLayer = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {
			maxZoom: 20,
			attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		var esriSatelliteLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		});

		this.map = L.map(this.el, {
			center: [64.99329541611105, -18.7261962890625], 
			zoom: 7,
			layers: [openMapSurferLayer],
			scrollWheelZoom: true,
			zoomControl: false
		});

		this.markers = L.featureGroup();
		this.map.addLayer(this.markers);

		var layers = {
			'Kort (OpenMapSurfer)': openMapSurferLayer,
			'Loftmynd (ESRI World Imagery)': esriSatelliteLayer
		};

		L.control.layers(layers).addTo(this.map);
		
		new L.Control.Zoom({ position: 'topright' }).addTo(this.map);
	}
});
