<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";

definePageMeta({ layout: false });

function kebabToCamelCase(text: string){
	return text.replace(/-([a-z])/g, function (g) { return g[1]!.toUpperCase(); });
}
const store = useEcaasStore();
const heatPumpStoreData = store.spaceHeating.heatGeneration.heatPump.data;
const route = useRoute()
const urlSegments = route.path.split("/");

const pageId = kebabToCamelCase(urlSegments[urlSegments.length -1]!);
const title = getTitle(pageId as PageId);

const index = Number(urlSegments[urlSegments.length -2]);

const currentHeatPump = useItemToEdit("pump", heatPumpStoreData);
const model = ref(currentHeatPump?.data);

const { data: heatPumps } = await useFetch("/api/products", { query: { category: "heatPump" } }); // currently getting all heat pumps - but this will need to fetch heat pumps depending on the heat pump type chosen

// sort into Small, Medium, Large (to retain while we are using test fake heat pumps and don't have better means to sort them by)
heatPumps.value?.sort((a, b) => -a.reference.localeCompare(b.reference));
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
			id="productsTable"
			:products="heatPumps!"
			:has-flow-temp="true"
			section="heatPump"
			:page-index="index"
			:url="route.path"
		/>

		<GovButton secondary :href="`/space-heating/heat-generation/heat-pump/${index}`" test-id="backToHeatPumpButton">Back to heat pump</GovButton> 
	</Formkit>
</template>