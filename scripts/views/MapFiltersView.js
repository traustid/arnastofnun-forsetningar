var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var MapFilterItemView = require('./MapFilterItemView');

module.exports = Backbone.View.extend({
	filterOptions: [
		{
			field: 'motion_to',
			label: 'Hreyfing til',
			options: [
			]
		},
		{
			field: 'motion_from',
			label: 'Hreyfing frá',
			options: [
			]
		},
		{
			field: 'stay',
			label: 'Dvöl',
			options: [
			]
		},
		{
			field: 'second_part',
			label: 'Ending',
			options: [
			]
		},
		{
			field: 'category',
			label: 'Flokkur',
			options: [
			]
		},
		{
			field: 'county',
			label: 'Sýsla',
			options: [
			]
		}
	],

	initialize: function(options) {
		this.options = options;
		this.mapView = this.options.mapView;

		this.renderUI();

		this.collection.on('add', this.addItem, this);
		this.collection.on('remove', this.render, this);
		this.collection.on('reset', this.render, this);

		this.mapView.collection.once('reset', this.updateFilterOptions, this);
	},

	updateFilterOptions: function() {
		_.each(this.filterOptions, _.bind(function(optionItem) {
			_.each(this.mapView.collection.models, function(item) {
				optionItem.options = _.union(optionItem.options, item.get(optionItem.field).split(', '));
				optionItem.options = _.union(optionItem.options, [item.get(optionItem.field)]);
			});

			optionItem.options = _.filter(_.uniq(optionItem.options), function(item) {
				return item != '' && item != ' ';
			});
		}, this));
	},

	events: {
		'click .add-filter-button': 'addFilterClick',
		'click .clear-filters-button': 'clearFiltersClick',
		'click .place-list .item': 'placeListItemClick',
		'keyup .filter-search input': 'filterInputKeyUp'
	},

	filterInputKeyUp: function() {
		this.renderPlacelist(this.$el.find('.filter-search input').val());
	},

	addFilterClick: function(event) {
		event.preventDefault();
		this.trigger('addFilter');
		this.trigger('filterChange');
	},

	clearFiltersClick: function(event) {
		if (event) {
			event.preventDefault();
		}

		this.trigger('clearFilters');
		this.trigger('filterChange');
	},

	placeListItemClick: function(event) {
		this.trigger('placeClick', {
			place: $(event.currentTarget).data('marker')
		});
	},

	clearMap: function() {
		this.clearFiltersClick();
	},

	setViewmode: function(viewMode) {
		this.viewMode = viewMode;
		this.clearMap();
		this.renderUI();
	},

	renderUI: function() {
		if (this.viewMode == 'all') {
			var template = _.template($("#allPlacesViewTemplate").html());
			this.$el.html(template());
			this.renderPlacelist();
		}
		if (this.viewMode == 'advanced') {		
			var template = _.template($("#filterViewTemplate").html());
			this.$el.html(template({}));
		}

		this.trigger('viewmode', {
			viewMode: this.viewMode
		});

		$('html').click(_.bind(function() {
			this.$el.find('.filter-items .filter-form').removeClass('visible');
		}, this));
	},

	filterChange: function(event) {
		this.trigger('deleteFilter', event);
		this.trigger('filterChange');
	},

	renderPlacelist: function(search) {
		var models = _.sortBy(_.filter(this.mapView.collection.models, function(model) {
			return model.get('coordination').lat && model.get('coordination').lng;
		}), function(model) {
			return model.get('name');
		});

		if (search && search.length > 2) {
			models = _.filter(models, function(model) {
				return model.get('name').toLowerCase().indexOf(search.toLowerCase()) > -1;
			});

			this.trigger('placelist', {
				markers: models
			});
		}
		else {
			this.trigger('placelistempty');
		}

		var template = _.template($("#allPlacesViewListTemplate").html());
		this.$el.find('.place-list').html(template({
			models: models
		}));
	},

	render: function() {
		this.$el.find('.filter-items').html('');
		
		_.each(this.collection.models, _.bind(function(model, index) {
			var newEl = $('<div/>');
			this.$el.find('.filter-items').append(newEl);

			var filterItem = new MapFilterItemView({
				el: newEl,
				filterOptions: this.filterOptions,
				model: model,
				color: this.options.mapView.markerColors[index],
				filterIndex: index
			});
			filterItem.on('deleteFilter', this.filterChange, this);
			filterItem.on('filterChange', _.bind(function(event) {
				this.trigger('filterChange');
			}, this));
			filterItem.on('labelMouseEnter', _.bind(function(event) {
				this.trigger('labelMouseEnter', event);
			}, this));
			filterItem.on('labelMouseLeave', _.bind(function(event) {
				this.trigger('labelMouseLeave');
			}, this));
			filterItem.on('labelClick', _.bind(function(event) {
				this.trigger('layerClick', event);
			}, this));
		}, this));
	},

	addItem: function() {
		var newEl = $('<div/>');
		this.$el.find('.filter-items').append(newEl);

		var filterItem = new MapFilterItemView({
			el: newEl,
			filterOptions: this.filterOptions,
			model: this.collection.at(this.collection.length-1),
			color: this.options.mapView.markerColors[this.collection.length-1],
			filterIndex: this.options.mapView.layers ? this.options.mapView.layers.length-1 : 0
		});
		filterItem.on('deleteFilter', this.filterChange, this);
		filterItem.on('filterChange', _.bind(function(event) {
			this.trigger('filterChange');
		}, this));
		filterItem.on('labelMouseEnter', _.bind(function(event) {
			this.trigger('labelMouseEnter', event);
		}, this));
		filterItem.on('labelMouseLeave', _.bind(function(event) {
			this.trigger('labelMouseLeave');
		}, this));
		filterItem.on('labelClick', _.bind(function(event) {
			this.trigger('layerClick', event);
		}, this));
	}
});

