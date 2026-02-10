<script setup lang="ts">
import type { DisplayProduct } from "~/pcdb/pcdb.types";

defineProps<{
	products: DisplayProduct[];
	totalPages: number;
	onSelectProduct: (reference: string) => void;
}>();

const route = useRoute();
</script>

<template>
	<div class="govuk-form-group">
		<table class="govuk-table govuk-!-margin-top-4">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header govuk-table__header--id">
						<ColumnSort label="Product ID" field="id" />
					</th>
					<th scope="col" class="govuk-table__header govuk-table__header--brand">
						<ColumnSort label="Brand" field="brandName" />
					</th>
					<th scope="col" class="govuk-table__header">
						<ColumnSort label="Model" field="modelName" />
					</th>
					<th scope="col" class="govuk-table__header govuk-table__header--model-qualifier">
						<ColumnSort label="Model qualifier" field="modelQualifier" />
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
					<td class="govuk-table__cell">{{ product.brandName }}</td>
					<td class="govuk-table__cell">{{ product.modelName }}</td>
					<td class="govuk-table__cell">{{ product.modelQualifier ?? '-' }}</td>
					<td class="govuk-table__cell govuk-table__cell--select">
						<div>
							<GovButton
								type="button"
								secondary
								classes="govuk-!-margin-bottom-2"
								:test-id="`selectProductButton_${index}`"
								@click="() => onSelectProduct(product.id.toString())"
							>
								Select
							</GovButton>
						</div>
						<NuxtLink :href="`${route.path}/${product.id}`" class="govuk-link govuk-!-margin-right-3">
							More details
						</NuxtLink>
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
	width: 120px;
}
</style>
