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
const primaryColumnLabel = computed(() => usesRadiatorColumns.value ? "Type" : "Model");
const secondaryColumnLabel = computed(() => usesRadiatorColumns.value ? "Height (mm)" : "Model qualifier");
const primarySortField = computed<ProductSortOption>(() => usesRadiatorColumns.value ? "type" : "modelName");
const secondarySortField = computed<ProductSortOption>(() => usesRadiatorColumns.value ? "height" : "modelQualifier");

const primaryValue = (product: DisplayProduct) => usesRadiatorColumns.value ? (product.type ?? "-") : (product.modelName ?? "-");
const secondaryValue = (product: DisplayProduct) => usesRadiatorColumns.value
	? (product.height != null ? `${product.height}` : "-")
	: (product.modelQualifier ?? "-");
</script>

<template>
	<div class="govuk-form-group" data-testid="productsTable">
		<table class="govuk-table govuk-!-margin-top-4">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header govuk-table__header--id">
						<ColumnSort label="Product ID" field="id" />
					</th>
					<th v-if="!usesRadiatorColumns" scope="col" class="govuk-table__header govuk-table__header--brand">
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
					<td v-if="!usesRadiatorColumns" class="govuk-table__cell">{{ product.brandName ?? '-' }}</td>
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
	width: 145px;
}

.govuk-table__cell--select {
	white-space: nowrap;
	text-align: right;
	width: 200px;
}
</style>
