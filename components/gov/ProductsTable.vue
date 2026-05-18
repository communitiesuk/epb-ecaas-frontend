<script setup lang="ts">
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import type { ProductSortOption } from "~/composables/productSearch";

const route = useRoute();
const props = defineProps<{
	products: DisplayProduct[];
	totalPages: number;
	onSelectProduct: (product: DisplayProduct) => void;
}>();

const usesRadiatorColumns = computed(() => props.products.some(product => product.technologyType === "ConvectorRadiator"));
const usesUnderfloorHeatingColumns = computed(() => props.products.some(product => product.technologyType === "UnderFloorHeating"));
const primaryColumnLabel = computed(() => {
	if (usesRadiatorColumns.value) return "Type";
	if (usesUnderfloorHeatingColumns.value) return "System";
	return "Model";
});
const secondaryColumnLabel = computed(() => {
	if (usesRadiatorColumns.value) return "Height (mm)";
	if (usesUnderfloorHeatingColumns.value) return "Spacing between heating pipes (mm)";
	return "Model qualifier";
});
const primarySortField = computed<ProductSortOption>(() => {
	if (usesRadiatorColumns.value) return "type";
	if (usesUnderfloorHeatingColumns.value) return "systemName";
	return "modelName";
});
const secondarySortField = computed<ProductSortOption>(() => {
	if (usesRadiatorColumns.value) return "height";
	if (usesUnderfloorHeatingColumns.value) return "pipeCentres";
	return "modelQualifier";
});
const primaryValue = (product: DisplayProduct) => {
	if (product.technologyType === "ConvectorRadiator") {
		return product.type ?? "-";
	}

	if (product.technologyType === "UnderFloorHeating") {
		return product.systemName ?? "-";
	}

	return product.modelName ?? "-";
};
const secondaryValue = (product: DisplayProduct) => {
	if (product.technologyType === "ConvectorRadiator") {
		return product.height != null ? `${product.height}` : "-";
	}

	if (product.technologyType === "UnderFloorHeating") {
		return product.pipeCentres != null ? `${product.pipeCentres}` : "-";
	}

	return product.modelQualifier ?? "-";
};
</script>

<template>
	<div class="govuk-form-group" data-testid="productsTable">
		<table class="govuk-table govuk-!-margin-top-4">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header govuk-table__header--id">
						<ColumnSort label="Product ID" field="id" />
					</th>
					<th v-if="!usesRadiatorColumns && !usesUnderfloorHeatingColumns" scope="col" class="govuk-table__header govuk-table__header--brand">
						<ColumnSort label="Brand" field="brandName" />
					</th>
					<th scope="col" class="govuk-table__header">
						<ColumnSort :label="primaryColumnLabel" :field="primarySortField" />
					</th>
					<th scope="col" class="govuk-table__header govuk-table__header--model-qualifier">
						<ColumnSort :label="secondaryColumnLabel" :field="secondarySortField" />
					</th>
					<th class="govuk-table__header">&nbsp;</th>
				</tr>
			</thead>

			<tbody class="govuk-table__body">
				<tr
					v-for="product, index in products"
					:key="product.id"
					class="govuk-table__row"
					data-testid="productRow"
				>
					<td class="govuk-table__cell">{{ product.id }}</td>
					<td v-if="!usesRadiatorColumns && !usesUnderfloorHeatingColumns" class="govuk-table__cell">{{ product.brandName ?? '-' }}</td>
					<td class="govuk-table__cell">{{ primaryValue(product) }}</td>
					<td class="govuk-table__cell">{{ secondaryValue(product) }}</td>
					<td class="govuk-table__cell govuk-table__cell--select">
						<NuxtLink :to="{ path: `${route.path}/${product.id}`, query: route.query }" class="govuk-link govuk-!-margin-right-3">
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

.govuk-table__header--brand {
	width: 150px;
}

.govuk-table__header--model-qualifier {
	width: 180px;
}

.govuk-table__cell--select {
	white-space: nowrap;
	text-align: right;
	width: 200px;
}
</style>
