<script setup lang="ts">
import type { DisplayProduct, DisplayProductWithFlowTemp, ProductEntity, ProductReference } from "~/pcdb/products";

const store = useEcaasStore();
const props = defineProps<{
	products: ProductEntity<DisplayProduct>[];
	hasFlowTemp: boolean
	section: keyof spaceHeatingNew
	pageIndex: number
	url: string
}>();
function selectProduct(reference: string) {
	store.$patch((state) => {
		state.spaceHeatingNew.heatSource.data[props.pageIndex]!.data.productReference = reference;
	});
}

function getFlowTemperature(reference: ProductReference) {
	const fullProduct = props.products.find(p => p.reference === reference) as ProductEntity<DisplayProductWithFlowTemp> | undefined;
	return fullProduct?.product.testData?.[0]?.designFlowTemperature ?? "-";
}

</script>

<template>
	<div class="govuk-form-group">

		<table class="govuk-table govuk-!-margin-top-4">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header">Product reference</th>
					<th scope="col" class="govuk-table__header">Brand</th>
					<th scope="col" class="govuk-table__header">Model</th>
					<th scope="col" class="govuk-table__header">Model qualifier</th>
					<th v-if="hasFlowTemp" scope="col" class="govuk-table__header">Flow temp</th>
					<th class="govuk-table__header">&nbsp;</th>
				</tr>
			</thead>

			<tbody class="govuk-table__body">
				<tr
					v-for=" {reference, product }, index in products"
					:key="reference"
					class="govuk-table__row"
				>
					<td class="govuk-table__cell">{{ reference }}</td>
					<td class="govuk-table__cell">{{ product.brandName }}</td>
					<td class="govuk-table__cell">{{ product.modelName }}</td>
					<td class="govuk-table__cell">{{ product.modelQualifier }}</td>
					<td  v-if="hasFlowTemp" class="govuk-table__cell">{{ `${getFlowTemperature(reference)}°C` }}</td>
					<td class="govuk-table__cell" style="white-space:nowrap;">
						<a :href="`${url}/${reference}`" class="govuk-link govuk-!-margin-right-3">
							More details
						</a>
						<GovButton
							type="button"
							secondary
							:test-id="`selectProductButton_${index}`"
							@click="selectProduct(reference)"
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
