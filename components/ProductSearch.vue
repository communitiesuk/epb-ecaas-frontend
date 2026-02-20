<script setup lang="ts">
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import type { ProductSearchModel, SearchOption } from "~/composables/productSearch";

const { products, model: searchModel } = defineProps<{
	products: DisplayProduct[];
	model: ProductSearchModel;
}>();

const getModel = (currentSearch: ProductSearchModel): ProductSearchModel => {
	return {
		...currentSearch,
		searchOption: searchModel.searchOption || "productId",
	};
};

const model = ref<ProductSearchModel>(getModel(searchModel));
	
const brandNames = ref<string[]>([]);
const modelNames = ref<string[]>([]);
const modelQualifiers = ref<string[]>([]);

const searchOptions: Record<SearchOption, string> = {
	productId: "Product ID",
	modelAndBrand: "Brand and model",
};

const setBrandName = (name: string) => model.value = {
	...model.value,
	brandName: name,
};

const setModelName = (name: string) => model.value = {
	...model.value,
	modelName: name,
};

const setModelQualifier = (qualifier: string) => model.value = {
	...model.value,
	modelQualifier: qualifier,
};

const handleSubmit = (fields: typeof model.value) => {
	const query = Object.entries(fields).filter(e => !!e[1]);
	const params = new URLSearchParams(query);

	navigateTo(`?${params}`);
};

const filterProducts = (currentModel: ProductSearchModel): DisplayProduct[] => {
	return useProductSearch(products, currentModel);
};

watch(model, (currentModel: ProductSearchModel, previousModel: ProductSearchModel) => {
	if (currentModel.brandName !== previousModel.brandName && (currentModel.brandName?.length || 0) > 2) {
		const filtered = filterProducts(currentModel);
		brandNames.value = Array.from(new Set(filtered.map(p => p.brandName)));
		return;
	}

	if (currentModel.modelName !== previousModel.modelName && (currentModel.modelName?.length || 0) > 2) {
		const filtered = filterProducts(currentModel);
		modelNames.value = Array.from(new Set(filtered.map(p => p.modelName)));
		return;
	}

	if (currentModel.modelQualifier !== previousModel.modelQualifier && (currentModel.modelQualifier?.length || 0) > 2) {
		const filtered = filterProducts(currentModel);
		modelQualifiers.value = Array.from(new Set(filtered.map(p => p.modelQualifier!)));
		return;
	}
});

watch(() => searchModel, (currentSearch: ProductSearchModel, _previousSearch: ProductSearchModel) => {
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
			data-testid="productSearch"
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
						id="brandName"
						name="brandName"
						label="Brand name"
						placeholder="Enter brand"
						:suggested-values="brandNames"
						:value="model.brandName"
						@select="setBrandName"
					/>
					<FieldsProductSearch
						id="modelName"
						name="modelName"
						label="Model name"
						placeholder="Enter model"
						:suggested-values="modelNames"
						:value="model.modelName"
						@select="setModelName"
					/>
					<FieldsProductSearch
						id="modelQualifier"
						name="modelQualifier"
						label="Model qualifier"
						placeholder="Enter qualifier"
						:suggested-values="modelQualifiers"
						:value="model.modelQualifier"
						@select="setModelQualifier"
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