<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { getTitle } from "~/utils/page";

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

if (!(pageId in pcdbTechnologyTypes)) {
	throw createError({
		statusCode: 400,
		statusMessage: "No product type selected"
	})
}

// currently getting all air source heat pumps - but this will need to fetch heat pumps depending on the heat pump type chosen
const { data: heatPumps } = await useFetch("/api/products", {
	query: {
		technologyType: pcdbTechnologyTypes[pageId as keyof typeof pcdbTechnologyTypes],
		pageSize: 12
	}
});
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
			section="heatPump"
			:page-index="index"
			:url="route.path"
		/>

		<GovButton secondary :href="`/space-heating/heat-generation/heat-pump/${index}`" test-id="backToHeatPumpButton">Back to heat pump</GovButton> 
	</Formkit>
</template>