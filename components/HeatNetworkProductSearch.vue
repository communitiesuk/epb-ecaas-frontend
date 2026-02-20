<script setup lang="ts">
import type { DisplayProduct } from "~/pcdb/pcdb.types";

const { products, model: searchModel } = defineProps<{
	products: DisplayProduct[];
	model: HeatNetworkProductSearchModel;
}>();

const getModel = (currentSearch: HeatNetworkProductSearchModel): HeatNetworkProductSearchModel => {
	return {
		...currentSearch,
		searchOption: searchModel.searchOption || "productId",
	};
};

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

const handleSubmit = (fields: typeof model.value) => {
	const query = Object.entries(fields).filter(e => !!e[1]);
	const params = new URLSearchParams(query);

	navigateTo(`?${params}`);
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

watch(() => searchModel, (currentSearch: HeatNetworkProductSearchModel, _previousSearch: HeatNetworkProductSearchModel) => {
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
			@submit="handleSubmit">
			<FormKit name="sort" type="hidden" />
			<FormKit name="order" type="hidden" />
			<FormKit
				id="searchOption"
				type="govRadios"
				name="searchOption"
				label="Search by"
				:options="searchOptions"
				:class-names="{
					radios: 'search-options'
				}"
			/>
			<div class="search-fields">
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
				
				<div>
					<FormKit type="govButton" label="Search" :ignore="true" :classes="{ button: 'search-btn' }" />
				</div>
			</div>
		</FormKit>
	</div>
</template>

<style lang="scss">
	.search-container {
		// suggested colour to replace removed light-grey in GOV.UK Frontend 6.0
		background-color: #f3f3f3;
		padding: 20px;
	}

	.search-fields {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 25px;
	}

	.search-btn {
		margin: 30px 0 2px;
	}

	.search-options {
		display: flex;
		flex-direction: row;
		gap: 25px;

		.govuk-radios__label {
			max-width: unset;

			&::before {
				background-color: white;
			}
		}
	}
</style>