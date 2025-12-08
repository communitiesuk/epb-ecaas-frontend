<script setup lang="ts">
import type { DisplayProduct, PaginatedResult } from "~/pcdb/pcdb.types";

const store = useEcaasStore();
const props = defineProps<{
	products: PaginatedResult<DisplayProduct>;
	hasFlowTemp?: boolean;
	section: keyof HeatGeneration;
	pageIndex: number;
	url: string;
}>();

function selectProduct(reference: string) {
	store.$patch((state) => {
		// currently hardcoding heatPumps
		state.spaceHeating.heatGeneration.heatPump.data[props.pageIndex]!.data.productReference = reference;
		// update heatGeneration type to use ECaasFormList and add productReference key to each heatGeneration section item eg boiler - then use the lines below 
		// const section = props.section
		// state.spaceHeating.heatGeneration[section].data[props.pageIndex]!.data.productReference = reference
	});
}

function getFlowTemperature(reference: number) {
	/*const fullProduct = props.products.find(p => p.reference === reference) as ProductEntity<DisplayProductWithFlowTemp> | undefined;
	return fullProduct?.product.testData?.[0]?.designFlowTemperature ?? "-";*/
	return "-";
}

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
					<th v-if="hasFlowTemp" scope="col" class="govuk-table__header">Flow temp</th>
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
					<td  v-if="hasFlowTemp" class="govuk-table__cell">{{ `${getFlowTemperature(product.id)}` }}</td>
					<td class="govuk-table__cell" style="white-space:nowrap;">
						<a :href="`${url}/${product.id}`" class="govuk-link govuk-!-margin-right-3">
							More details
						</a>
						<GovButton
							type="button"
							secondary
							:test-id="`selectProductButton_${index}`"
							@click="selectProduct(product.id.toString())"
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
