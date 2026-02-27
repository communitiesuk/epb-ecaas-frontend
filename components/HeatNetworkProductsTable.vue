<script setup lang="ts">
import type { DisplayProduct } from "~/pcdb/pcdb.types";

defineProps<{
	products: DisplayProduct[];
	totalPages: number;
	onSelectProduct: (product: DisplayProduct) => void;
}>();

const route = useRoute();
</script>

<template>
	<div class="govuk-form-group" data-testid="heatNetworkProductsTable">
		<table class="govuk-table govuk-!-margin-top-4">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header govuk-table__header--id">
						<ColumnSort label="Product ID" field="id" />
					</th>
					<th scope="col" class="govuk-table__header govuk-table__header--brand">
						<ColumnSort label="Network name" field="communityHeatNetworkName" />
					</th>
					<th class="govuk-table__header">&nbsp;</th>
				</tr>
			</thead>

			<tbody class="govuk-table__body">
				<tr
					v-for="product, index in products"
					:key="product.id"
					class="govuk-table__row"
				>
					<td class="govuk-table__cell">{{ product.id }}</td>
					<td class="govuk-table__cell">{{ product.communityHeatNetworkName }}</td>
					<td class="govuk-table__cell govuk-table__cell--select">
						<NuxtLink :href="`${route.path}/${product.id}`" class="govuk-link govuk-!-margin-right-3">
							More details
						</NuxtLink>
						<GovButton
							type="button"
							secondary
							classes="govuk-!-margin-bottom-0"
							:test-id="`selectProductButton_${index}`"
							@click="() => onSelectProduct(product)"
						>
							Select
						</GovButton>
					</td>
				</tr>
			</tbody>
		</table>

		<GovPagination :total-pages="totalPages" :range="3" />
	</div>
</template>

<style scoped lang="scss">
.govuk-table__header--id {
	width: 120px;
}

.govuk-table__cell--select {
	white-space: nowrap;
	text-align: right;
	width: 200px;
}
</style>
