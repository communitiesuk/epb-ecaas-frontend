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
					<th scope="col" class="govuk-table__header">Product ID</th>
					<th scope="col" class="govuk-table__header">Brand</th>
					<th scope="col" class="govuk-table__header">Model</th>
					<th scope="col" class="govuk-table__header">Model qualifier</th>
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
					<td class="govuk-table__cell" style="white-space:nowrap;">
						<NuxtLink :href="`${route.path}/${product.id}`" class="govuk-link govuk-!-margin-right-3">
							More details
						</NuxtLink>
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

		<GovPagination :total-pages="totalPages" :range="3" />
	</div>
</template>

<style scoped lang="scss">
.govuk-table__header {
	color:  #1d70b8
}
</style>
