<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";

definePageMeta({ layout: false });

const route = useRoute();
const store = useEcaasStore();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const pageId = "heatSourceProduct";
const title = getTitle(pageId as PageId);
const index = Number(route.params["heatSource"]);

const currentHeatPump = useItemToEdit("heatSource", heatSourceStoreData);
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
			section="heatSource"
			:page-index="index"
			:url="route.path"
		/>
		<GovButton secondary :href="`/space-heating-new/heat-source/${index}`" test-id="backToHeatSourceButton">Back to heat source</GovButton> 
	</Formkit>
</template>