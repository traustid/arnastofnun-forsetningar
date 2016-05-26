var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.Collection.extend({
	url: siteRoot+'/data.json',

	initialize: function() {
		this.fetch({
			reset: true
		});
	},

	parse: function(data) {
		return _.map(data, function(item) {
			item.coordination = {
				lat: item.coordination.split(', ')[0],
				lng: item.coordination.split(', ')[1]
			};
			return item;
		});
	},

	getFiltered: function(filters) {
		var filtered = _.map(this.models, function(model) {
			return model.toJSON();
		});

		_.each(filters, _.bind(function(filter) {
			filtered = _.filter(filtered, function(model) {
				return model[filter.key].indexOf(filter.value) > -1 && (model.coordination.lat && model.coordination.lng);
			});

		}, this));
		return new Backbone.Collection(filtered);
	}
});