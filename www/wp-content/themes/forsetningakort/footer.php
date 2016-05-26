<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Forsetningakort
 */

?>

<?php if (is_page_template ('map-page.php')) { ?>

<script id="allPlacesViewTemplate" type="text/template">

	<div class="place-list list">
	</div>

	<div class="filter-search">
		<input type="text" placeholder="Leita að örnefni" />
	</div>

</script>

<script id="allPlacesViewListTemplate" type="text/template">
	<% _.each(models, function(model) { %>
		<a class="item item-<%= model.cid %>" data-marker="<%= model.cid %>">
			<div class="item-title"><%= model.get('name') %></div>
			<span class="attrib"><%= model.get('category') %></span>
			<span class="attrib"><%= model.get('county') %></span>
			<div class="u-cf"></div>
		</a>
	<% }) %>
</script>

<script id="filterViewTemplate" type="text/template">
	
	<div class="filter-items">
	</div>

	<div class="menu-buttons">
		<a href="#" class="button button-primary button-large u-full-width add-filter-button"><span class="icon icon-add-plus-button"></span>&nbsp;&nbsp;Bæta við kortaþekju</a>
		<a href="#" class="button button-gray button-large u-full-width clear-filters-button">Hreinsa kort</a>
	</div>

</script>

<script id="filterItemTemplate" type="text/template">
	<div class="filter-item">
		<a href="#" class="label" data-index="<%= index %>"><div class="filter-color" style="background-color: <%= color %>"></div>
			<% _.each(filters, function(filter, index) { %>
				<%= filter.label %>: <strong><%= filter.value %></strong> <%= index < filters.length-1 ? ', ' : '' %>
			<% }) %>

			<div class="settings-button">
				<span class="icon icon-settings-work-tool"></span>
			</div>
		</a>

		<div class="filter-form<%= filters.length == 0 ? ' visible' : '' %>">
			<div class="form-header">
				<div class="filter-color" style="background-color: <%= color %>"></div> <%= filters.length == 0 ? 'Ný sía' : 'Breyta síu' %>
			</div>

			<div class="row form-content">

				<% _.each(filterOptions, function(filterOption) { %>
					<div class="two columns">
						<label for="<%= filterOption.field %>select"><%= filterOption.label %>:</label>
						<select class="u-full-width form-option" data-field="<%= filterOption.field %>" id="<%= filterOption.field %>select">
		
							<option value="0"></option>
							<% _.each(filterOption.options, function(option) { %>
								<option <%= _.find(filters, function(filter) {
									return filter.key == filterOption.field && filter.value == option;
								}) ? 'selected="selected"' : '' %> value="<%= option %>"><%= option %></option>
							<% }) %>

						</select>
					</div>
				<% }) %>

			</div>

			<div class="row form-content">
				<div class="twelve columns">
					<a href="#" class="button button-primary save-filter-button">Uppfæra kortaþekju</a>
					<a href="#" class="button button-gray cancel-button">Loka</a>
					<a href="#" class="button button-gray u-pull-right delete-filter-button">Eyða kortaþekju</a>
				</div>
			</div>

		</div>
	</div>
</script>

<script type="text/template" id="markerPopupTemplate">

	<h2><%= model.name %></h2>
	<div class="attrib-table">

		<% if (model.other_names && model.other_names != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Önnur nöfn</div>
				<div class="attrib-cell value"><%= model.other_names %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

		<% if (model.motion_to && model.motion_to != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Hreyfing til</div>
				<div class="attrib-cell value"><%= model.motion_to %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

		<% if (model.motion_from && model.motion_from != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Hreyfing frá</div>
				<div class="attrib-cell value"><%= model.motion_from %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

		<% if (model.stay && model.stay != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Dvöl</div>
				<div class="attrib-cell value"><%= model.stay %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

		<% if (model.gender && model.gender != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Kyn</div>
				<div class="attrib-cell value"><%= model.gender %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

		<% if (model.example && model.example != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Dæmi</div>
				<div class="attrib-cell value"><%= model.example %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

		<% if (model.county && model.county != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Sýsla</div>
				<div class="attrib-cell value"><%= model.county %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

		<% if (model.category && model.category != '') { %>

			<div class="attrib">
				<div class="attrib-cell label">Tegund</div>
				<div class="attrib-cell value"><%= model.category %></div>
				<div class="u-cf"></div>
			</div>

		<% } %>

	</div>

</script>

<script id="placeListViewTemplate" type="text/template">
	<a href="#" class="popup-title">Staðir á þekjum</a>

	<div class="place-list list">
		<% _.each(places, function(place) { %>
			<a class="item item-<%= place.id %>" data-marker="<%= place.id %>">
				
				<div class="marker-colors"><%= place.html %></div>

				<div class="item-title"><%= place.name %></div>
				<span class="attrib"><%= place.category %></span>
				<span class="attrib"><%= place.county %></span>
				
				<div class="u-cf"></div>

			</a>
		<% }) %>
	</div>
</script>

<script src="<?php echo get_site_url(); ?>/js/app.min.js"></script>

<?php } else { ?>
				
				</div>

			</div>

			<div class="four columns">

				<?php get_sidebar(); ?>

			</div>
		</div>
	</div>
</div>

<div class="container footer">

	<div class="row">
		<div class="eight columns">
			<?php dynamic_sidebar( 'footer' ); ?>
		</div>

		<div class="four columns">
		</div>
	</div>

</div>

<?php } ?>

<?php wp_footer(); ?>

</body>
</html>
