<script setup lang="ts">
import { handleSubmit } from "~/composables/productSearch";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

const { products, model: searchModel } = defineProps<{
	products: DisplayProduct[];
	model: HeatNetworkProductSearchModel;
}>();

const model = ref<HeatNetworkProductSearchModel>(getModel(searchModel));
const networkNames = ref<string[]>([]);

const searchOptions: Record<HeatNetworkSearchOption, string> = {
	productId: "Product ID",
	networkName: "Network name",
};

const setNetworkName = (name: string) => model.value = {
	...model.value,
	networkName: name,
};

const filterProducts = (currentModel: HeatNetworkProductSearchModel): DisplayProduct[] => {
	return useHeatNetworkProductSearch(products, currentModel);
};

watch(model, (currentModel: HeatNetworkProductSearchModel, previousModel: HeatNetworkProductSearchModel) => {
	if (currentModel.networkName !== previousModel.networkName && (currentModel.networkName?.length || 0) > 2) {
		const filtered = filterProducts(currentModel);
		networkNames.value = Array.from(new Set(filtered.map(p => p.communityHeatNetworkName!)));
		return;
	}
});

watch(() => searchModel, (currentSearch: HeatNetworkProductSearchModel) => {
	model.value = getModel(currentSearch);
});
</script>

<template>
	<div class="search-container">
		<FormKit
			v-model="model"
			type="form"
			method="get"
			:actions="false"
			:incomplete-message="false"
			data-testid="heatNetworkProductSearch"
			@submit="handleSubmit"
		>
			<ProductSearchFields :search-options="searchOptions">
				<template v-if="model.searchOption === 'productId'">
					<FieldsProductSearch
						id="productId"
						name="productId"
						label="Product ID"
						placeholder="Enter product ID"
						:value="model.productId"
					/>
				</template>
				<template v-else>
					<FieldsProductSearch
						id="networkName"
						name="networkName"
						label="Network name"
						placeholder="Enter network name"
						:suggested-values="networkNames"
						:value="model.networkName"
						@select="setNetworkName"
					/>
				</template>
			</ProductSearchFields>
		</FormKit>
	</div>
</template>