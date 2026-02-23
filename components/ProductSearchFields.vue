<script setup lang="ts">
defineProps<{
	searchOptions: Record<string, string>;
}>();
</script>

<template>
	<FormKit name="sort" type="hidden" />
	<FormKit name="order" type="hidden" />
	<FormKit
		id="searchOption"
		type="govRadios"
		name="searchOption"
		label="Search by"
		:options="searchOptions"
		:class-names="{
			radios: 'search-options'
		}"
	/>
	<div class="search-fields">
		<slot />
		<div>
			<FormKit type="govButton" label="Search" :ignore="true" :classes="{ button: 'search-btn' }" />
		</div>
	</div>
</template>

<style lang="scss">
	.search-container {
		// suggested colour to replace removed light-grey in GOV.UK Frontend 6.0
		background-color: #f3f3f3;
		padding: 20px;
	}
	
	.search-fields {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 25px;
	}

	.search-btn {
		margin: 30px 0 2px;
	}

	.search-options {
		display: flex;
		flex-direction: row;
		gap: 25px;

		.govuk-radios__label {
			max-width: unset;

			&::before {
				background-color: white;
			}
		}
	}
</style>