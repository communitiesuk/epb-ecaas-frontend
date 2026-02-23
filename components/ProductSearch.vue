<script setup lang="ts">
import { handleSubmit } from "~/composables/productSearch";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

const { products, model: searchModel } = defineProps<{
	products: DisplayProduct[];
	model: ProductSearchModel;
}>();

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

watch(() => searchModel, (currentSearch: ProductSearchModel) => {
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
			</ProductSearchFields>
		</FormKit>
	</div>
</template>