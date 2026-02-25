<script setup lang="ts">
const { model: searchModel, searchOptions = {
	productId: "Product ID",
	modelAndBrand: "Brand and model",
} } = defineProps<{
	model: ProductSearchModel;
	searchOptions?: Partial<Record<SearchOption, string>>;
}>();

const getModel = (currentSearch: ProductSearchModel): ProductSearchModel => {
	return {
		...currentSearch,
		searchOption: currentSearch.searchOption || "productId",
	};
};

const model = ref<ProductSearchModel>(getModel(searchModel));

const handleSubmit = (fields: typeof searchModel) => {
	const query = Object.entries(fields).filter(e => !!e[1]);
	const params = new URLSearchParams(query);

	navigateTo(`?${params}`);
};

watch(model, (currentModel: ProductSearchModel, previousModel: ProductSearchModel) => {
	if (currentModel.productId !== previousModel.productId ||
		currentModel.searchTerm !== previousModel.searchTerm ||
		currentModel.searchOption !== previousModel.searchOption) {
		handleSubmit(model.value);
	}
});

watch(() => searchModel, (currentSearch: ProductSearchModel) => {
	model.value = currentSearch;
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
			@submit="handleSubmit"
		>
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
				<FieldsProductSearch
					v-if="model.searchOption === 'productId'"
					id="productId"
					name="productId"
					label="Product ID"
					placeholder="Enter product ID"
					:value="model.productId"
				/>
				<FieldsProductSearch
					v-if="model.searchOption !== 'productId'"
					id="searchTerm"
					name="searchTerm"
					label="Search term"
					placeholder="Enter search term"
					:value="model.searchTerm"
				/>
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

	.search-fields {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: 25px;
	}
</style>