<script setup lang="ts">
defineProps<{ data: Record<string, string>; }>();
</script>

<template>
	<div class="product-table-container">
		<div class="govuk-table">
			<div class="govuk-table__body">
				<div v-for="prop in Object.keys(data)" :key="prop" class="govuk-table__row">
					<div scope="row" class="govuk-table__header">{{ prop }}</div>
					<div class="govuk-table__cell">{{ data[prop] }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.product-table-container {
		margin: 25px 0 50px;
	}

	.govuk-table__header {
		width: 50%;
		overflow: auto;
	}

	.govuk-table__body {
		column-count: 2;
		column-gap: 50px;
	}

	.govuk-table__row {
		display: flex;
	}

	.govuk-table__header, .govuk-table__cell {
		flex: 1
	}
</style>