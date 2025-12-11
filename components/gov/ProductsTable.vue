<script setup lang="ts">
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

const props = defineProps<{
	products: PaginatedResult<DisplayProduct>;
	section: keyof HeatGeneration;
	pageIndex: number;
	url: string;
	onSelectProduct: (reference: string) => void;
}>();
</script>

<template>
	<div class="govuk-form-group">

		<table class="govuk-table govuk-!-margin-top-4">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header">Product ID</th>
					<th scope="col" class="govuk-table__header">Brand</th>
					<th scope="col" class="govuk-table__header">Model</th>
					<th scope="col" class="govuk-table__header">Model qualifier</th>
					<th class="govuk-table__header">&nbsp;</th>
				</tr>
			</thead>

			<tbody class="govuk-table__body">
				<tr
					v-for="product, index in products.data"
					:key="product.id"
					class="govuk-table__row"
				>
					<td class="govuk-table__cell">{{ product.id }}</td>
					<td class="govuk-table__cell">{{ product.brandName }}</td>
					<td class="govuk-table__cell">{{ product.modelName }}</td>
					<td class="govuk-table__cell">{{ product.modelQualifier ?? '-' }}</td>
					<td class="govuk-table__cell" style="white-space:nowrap;">
						<a :href="`${url}/${product.id}`" class="govuk-link govuk-!-margin-right-3">
							More details
						</a>
						<GovButton
							type="button"
							secondary
							:test-id="`selectProductButton_${index}`"
							@click="() => onSelectProduct(product.id.toString())"
						>
							Select
						</GovButton>
					</td>
				</tr>
			</tbody>
		</table>

	</div>
</template>

<style scoped lang="scss">
.govuk-table__header {
	color:  #1d70b8
}
</style>
