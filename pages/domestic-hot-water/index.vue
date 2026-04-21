<script setup lang="ts">
import { hasPackagedProduct, isPackagedProduct, isEcaasForm } from "#imports";
import type { CustomListItem } from "~/components/CustomList.vue";
import { useDomesticHotWater } from "~/composables/domesticHotWater";
import formStatus from "~/constants/formStatus";
import type { HeatSourceData, WaterStorageData } from "~/stores/ecaasStore.schema";

const title = "Domestic hot water";

const page = usePage();
const store = useEcaasStore();
const { removeEntry, duplicateEntry } = useDomesticHotWater();

const { heatSources: dhwHeatSources } = store.domesticHotWater;

const errorMessages = ref<{ id: string, text: string }[]>([]);

function handleComplete() {
	const hasOtherHotWaterOutlet =
	store.domesticHotWater.hotWaterOutlets.data.some(
		(outlet) => outlet.data.typeOfHotWaterOutlet === "otherHotWaterOutlet",
	);
	console.log(hasOtherHotWaterOutlet, "<<<other hot water outlet");

	if (!hasOtherHotWaterOutlet) {
		errorMessages.value.push({ id: "hotWaterOutletNoOtherTypeError", text: "You must add at least one hot water outlet that has the type 'other'" });
		return;
	}

	store.$patch({
		domesticHotWater: {
			waterStorage: { complete: true },
			hotWaterOutlets: { complete: true },
			pipework: { complete: true },
			heatSources: { complete: true },
		},
	});

	navigateTo("/");
}

const hasIncompleteOrInvalidEntries = () => {
	if (dhwHeatSources.data.length > 1) return true;
	return Object.values(store.domesticHotWater)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));
};

function getNameFromSpaceHeatingHeatSource(heatSourceId: string) {
	const heatSource = store.spaceHeating.heatSource.data.find(x => x.data.id === heatSourceId);
	return heatSource ? heatSource.data.name : undefined;
}


const hasPackagedHeatSources = dhwHeatSources.data.every(x => isPackagedProduct(x.data) || hasPackagedProduct(x.data));
const hasExceeded = dhwHeatSources.data.length > 1 && !hasPackagedHeatSources;
if (hasExceeded) {
	errorMessages.value.push({ id: "heatSourceLimitExceededError", text: "You can only have one heat source for domestic hot water. Please delete any heat sources that should not be used." });
}

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovErrorSummary v-if="errorMessages.length > 0" :error-list="errorMessages" test-id="domesticHotWaterErrorSummary" :use-links="false"/>
	<CustomList 
		id="heatSources"
		title="Heat source"
		:form-url="`${page?.url!}/heat-sources`"
		:items="
			store.domesticHotWater.heatSources.data
				.filter(x => isEcaasForm(x))
				.map(x => {
					const heatSource = x as EcaasForm<HeatSourceData>;

					const item: CustomListItem = {
						name: x.data.isExistingHeatSource ? getNameFromSpaceHeatingHeatSource(x.data.heatSourceId)! : x.data.name,
						status: x.complete ? formStatus.complete : formStatus.inProgress,
						...(hasPackagedProduct(heatSource.data) || (x.data.isExistingHeatSource && x.data.createdAutomatically) ? {
							actions: ['edit']
						} : {})
					};

					return item;
				})
		"
		:show-status="true"
		:max-number-of-items=1
		section="dHWHeatSources"
		@remove="(index: number) => removeEntry('heatSources', index)"
	/>
	<CustomList 
		id="waterStorage"
		title="Water storage"
		:form-url="`${page?.url!}/water-storage`"
		:items="store.domesticHotWater.waterStorage.data
			.filter(x => isEcaasForm(x))
			.map(x => {
				const waterStorage = x as EcaasForm<WaterStorageData>;

				const item: CustomListItem = {
					name: x.data.name,
					status: x.complete ? formStatus.complete : formStatus.inProgress,
					...(hasPackagedProduct(waterStorage.data) ? {
						actions: ['edit']
					} : {})
				};

				return item;
			})"
		:show-status="true"
		@remove="(index: number) => removeEntry('waterStorage', index)"
		@duplicate="(index: number) => duplicateEntry('waterStorage', index)"
	/>

	<CustomList 
		id="hotWaterOutlets"
		title="Hot water outlets"
		:form-url="`${page?.url!}/hot-water-outlets`"
		:items="store.domesticHotWater.hotWaterOutlets.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => removeEntry('hotWaterOutlets', index)"
		@duplicate="(index: number) => duplicateEntry('hotWaterOutlets', index)"
	/>

	<CustomList 
		id="pipework"
		title="Pipework"
		:form-url="`${page?.url!}/pipework`"
		:items="store.domesticHotWater.pipework.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => removeEntry('pipework', index)"
		@duplicate="(index: number) => duplicateEntry('pipework', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/"
			secondary
		>
			Return to overview
		</GovButton>
		<NuxtLink :to="`${page?.url}/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
		<CompleteElement
			:is-complete="Object.values(store.domesticHotWater).every(section => section.complete)"
			:disabled="hasIncompleteOrInvalidEntries()"
			@completed="handleComplete"/>
	</div>
</template>