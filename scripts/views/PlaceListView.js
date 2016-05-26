var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({
	initialize: function(options) {

	},

	events: {
		'click .place-list .item': 'placeListItemClick',
		'click .popup-title': 'titleClick'
	},

	titleClick: function(event) {
		event.preventDefault();
		
		this.$el.parent().toggleClass('open');
	},

	placeListItemClick: function(event) {
		this.trigger('placeClick', {
			place: $(event.currentTarget).data('marker')
		});
	},

	show: function() {
		this.$el.parent().removeClass('hidden');
	},

	hide: function() {
		this.$el.parent().addClass('hidden');
	},

	render: function() {
		var template = _.template($("#placeListViewTemplate").html());
		this.$el.html(template({
			places: _.sortBy(this.places, 'name')
		}));

		if (this.listHeader) {
			this.$el.find('.popup-title').html('Staðir á þekju: <span class="filter-name">'+this.listHeader+'</div>');
			this.$el.parent().addClass('open');
		}
		else {
			this.$el.find('.popup-title').text('Staðir á þekjum');
		}
	}
});

