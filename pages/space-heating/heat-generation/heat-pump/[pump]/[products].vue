<script setup lang="ts">
import { page, type PageId } from "~/data/pages/pages";

definePageMeta({ layout: false });

const store = useEcaasStore();
const route = useRoute();

const heatPumpStoreData = store.spaceHeating.heatGeneration.heatPump.data;
const urlSegments = route.path.split("/");

const pageId = kebabToCamelCase(urlSegments[urlSegments.length - 1]!);
const title = getTitle(`${pageId + "Products" as PageId}`);

const index = Number(urlSegments[urlSegments.length - 2]);

const currentHeatPump = useItemToEdit("pump", heatPumpStoreData);
const model = ref(currentHeatPump?.data);

if (!(pageId in pcdbTechnologyTypes)) {
	throw createError({
		statusCode: 400,
		statusMessage: "Invalid product type selected",
	});
}

const { data: heatPumps } = await useFetch("/api/products", {
	query: {
		technologyType: pcdbTechnologyTypes[pageId as keyof typeof pcdbTechnologyTypes],
	},
});

const heatPumpData = heatPumps.value?.data ?? [];
const pageSize = 12;

const { totalPages, getData } = usePagination(heatPumpData, pageSize);

function selectProduct(reference: string) {
	store.$patch((state) => {
		state.spaceHeating.heatGeneration.heatPump.data[index]!.data.productReference = reference;
	});

	navigateTo(page("heatPump").url.replace(":pump", `${index}`));
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
			:on-select-product="selectProduct"
		/>

		<GovButton secondary :href="`/space-heating/heat-generation/heat-pump/${index}`" test-id="backToHeatPumpButton">Back to heat pump</GovButton> 
	</Formkit>
</template>