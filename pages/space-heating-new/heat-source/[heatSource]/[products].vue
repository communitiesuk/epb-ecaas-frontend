<script setup lang="ts">
import { page, type PageId } from "~/data/pages/pages";

definePageMeta({ layout: false });

const store = useEcaasStore();
const route = useRoute();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const urlSegments = route.path.split("/");

const pageId = kebabToCamelCase(urlSegments[urlSegments.length - 1]!);
const title = getTitle(`${pageId + "Products" as PageId}`);

const index = Number(urlSegments[urlSegments.length - 2]);

const currentHeatSource = useItemToEdit("heatSource", heatSourceStoreData);
const model = ref(currentHeatSource?.data);

if (!(pageId in pcdbTechnologyTypes)) {
	throw createError({
		statusCode: 400,
		statusMessage: "Invalid product type selected",
	});
};

const { data: heatSources } = await useFetch("/api/products", {
	query: {
		technologyType: pcdbTechnologyTypes[pageId as keyof typeof pcdbTechnologyTypes]
	}
});

const heatSourceData = heatSources.value?.data ?? [];
const pageSize = 12;

const { totalPages, getData } = usePagination(heatSourceData, pageSize);

function selectProduct(reference: string) {
	store.$patch((state) => {
		state.spaceHeatingNew.heatSource.data[index]!.data.productReference = reference;
	});

	navigateTo(page("heatSource").url.replace(":heatSource", `${index}`));
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
	>
		<GovProductsTable 
			:products="getData()"
			:total-pages="totalPages"
			:onSelectProduct="selectProduct"
		/>
		<GovButton secondary :href="`/space-heating-new/heat-source/${index}`" test-id="backToHeatSourceButton">Back to heat source</GovButton> 
	</Formkit>
</template>