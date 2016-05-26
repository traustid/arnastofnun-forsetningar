var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({

	initialize: function(options) {
		this.options = options;

		this.render();
	},

	events: {
		'click': 'thisClick',
		'click .save-filter-button': 'saveFilterButtonClick',
		'click .label .settings-button': 'settingsClick',
		'click .label': 'labelClick',
		'click .cancel-button, .form-header': 'cancelButtonClick',
		'click .delete-filter-button': 'deleteFilterClick',
	},

	thisClick: function(event) {
		event.stopPropagation();
	},

	settingsClick: function(event) {
		event.stopPropagation();
		$('.filter-items .filter-form').removeClass('visible');
		this.$el.find('.filter-form').addClass('visible');
	},

	labelClick: function(event) {
		this.trigger('labelClick', {
			index: $(event.currentTarget).data('index')
		});
	},

	cancelButtonClick: function() {
		this.$el.find('.filter-form').removeClass('visible');
	},

	deleteFilterClick: function() {
		this.trigger('deleteFilter', {
			layer: this.model
		});
	},

	saveFilterButtonClick: function() {
		var filters = [];
		_.each(this.$el.find('.form-option'), _.bind(function(formEl) {

			if ($(formEl).val() != '0') {
				filters.push({
					key: $(formEl).data('field'),
					value: $(formEl).val()
				});
			}
		}, this));

		this.model.get('view').updateFilters(filters);
		this.model.set('filters', filters);
		this.render();
		this.trigger('filterChange');
	},

	labelMouseEnter: function() {
		this.trigger('labelMouseEnter', {
			layerIndex: this.options.filterIndex
		});
	},

	labelMouseLeave: function() {
		this.trigger('labelMouseLeave', {
			layerIndex: this.options.filterIndex
		});
	},

	render: function() {
		var template = _.template($("#filterItemTemplate").html());

		var filters = _.map(this.options.model.get('filters'), _.bind(function(filter) {
			return {
				key: filter.key,
				value: filter.value,
				label: _.find(this.options.filterOptions, function(option) {
					return option.field == filter.key;
				}).label
			};
		}, this));

		this.$el.html(template({
			filterOptions: this.options.filterOptions,
			filters: filters,
			color: this.options.color,
			index: this.options.filterIndex
		}));

		if (filters.length == 0) {
			setTimeout(_.bind(function() {
				this.$el.find('.filter-form').addClass('visible');
			}, this), 100);
		}

		this.$el.hover(_.bind(this.labelMouseEnter, this), _.bind(this.labelMouseLeave, this));
	}
});

