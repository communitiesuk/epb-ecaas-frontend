<script setup lang="ts">
import { isEcaasForm } from "#imports";
import formStatus from "~/constants/formStatus";
import type { DomesticHotWaterHeatSourceData } from "~/stores/ecaasStore.schema";

const title = "Domestic hot water";

const page = usePage();
const store = useEcaasStore();
const { waterStorage, hotWaterOutlets, pipework } = store.domesticHotWater; 

type DomesticHotWaterType = keyof typeof store.domesticHotWater;
type DomesticHotWaterData = EcaasForm<DomesticHotWaterHeatSourceData> & EcaasForm<WaterStorageData> & EcaasForm<HotWaterOutletsData> & EcaasForm<PipeworkData>;
function handleRemove(domesticHotWaterType: DomesticHotWaterType, index: number) {
	const items = store.domesticHotWater[domesticHotWaterType]?.data;
	
	if (items) {
		let heatSourceId: string | undefined;
		if (items[index]?.data && "typeOfHeatSource" in items[index].data) {
			heatSourceId = store.domesticHotWater.heatSources.data[index]?.data.id;
		}

		let waterStorageId: string | undefined;
		if (items[index]?.data && "typeOfWaterStorage" in items[index].data) {
			waterStorageId = store.domesticHotWater.waterStorage.data[index]?.data.id;
		}

		items.splice(index, 1);
		store.$patch((state) => {
			state.domesticHotWater[domesticHotWaterType].data = items.length ? items : [];
			state.domesticHotWater[domesticHotWaterType].complete = false;
		});

		if (heatSourceId) {
			store.removeTaggedAssociations()([waterStorage, hotWaterOutlets], heatSourceId, "dhwHeatSourceId"); 
		}
		if (waterStorageId) {
			store.removeTaggedAssociations()([pipework], waterStorageId, "waterStorage"); 
		}
	}
} 

function handleDuplicate<T extends DomesticHotWaterData>(domesticHotWaterType: DomesticHotWaterType, index: number) {
	const data = store.domesticHotWater[domesticHotWaterType]?.data;
	const item = data?.[index];
	let name: string;
    
	if (item) {
		const duplicates = data.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(item)) {
				if (domesticHotWaterType === "heatSources" && (item.data as DomesticHotWaterHeatSourceData).isExistingHeatSource) {
					// I have no idea what to do here
					// Either prevent duplication of existing heat sources
					// Or allow it and create a new entry in space heating too?
					// Or create a new heat source in domestic hot water?
					return false;
				}
				name = (item.data as { name: string }).name;
				return (f.data as { name: string }).name.match(duplicateNamePattern(name));
			}
			return false;
		});

		store.$patch((state) => {
			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${name} (${duplicates.length})`,
				},
			} as T;

			state.domesticHotWater[domesticHotWaterType].data.push(newItem);
			state.domesticHotWater[domesticHotWaterType].complete = false;
		});
	}
}
function handleComplete() {
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

const hasIncompleteEntries = () =>
	Object.values(store.domesticHotWater)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));

function getNameFromSpaceHeatingHeatSource(heatSourceId: string) {
	const heatSource = store.spaceHeating.heatSource.data
		.find((x) => x.data.id === heatSourceId);
	return heatSource ? heatSource.data.name : undefined;
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<CustomList 
		id="heatSources"
		title="Heat sources"
		:form-url="`${page?.url!}/heat-sources`"
		:items="store.domesticHotWater.heatSources.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.isExistingHeatSource ? getNameFromSpaceHeatingHeatSource(x.data.heatSourceId)! : x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress, preventDuplication: x.data.heatSourceId !== 'NEW_HEAT_SOURCE'}))"
		:show-status="true"
		:can-duplicate="false"
		@remove="(index: number) => handleRemove('heatSources', index)"
		@duplicate="(index: number) =>  handleDuplicate('heatSources', index)"
	/>
	<CustomList 
		id="waterStorage"
		title="Water storage"
		:form-url="`${page?.url!}/water-storage`"
		:items="store.domesticHotWater.waterStorage.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('waterStorage', index)"
		@duplicate="(index: number) => handleDuplicate('waterStorage', index)"
	/>

	<CustomList 
		id="hotWaterOutlets"
		title="Hot water outlets"
		:form-url="`${page?.url!}/hot-water-outlets`"
		:items="store.domesticHotWater.hotWaterOutlets.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('hotWaterOutlets', index)"
		@duplicate="(index: number) => handleDuplicate('hotWaterOutlets', index)"
	/>

	<CustomList 
		id="pipework"
		title="Pipework"
		:form-url="`${page?.url!}/pipework`"
		:items="store.domesticHotWater.pipework.data
			.filter(x => isEcaasForm(x))
			.map(x=>({name: x.data.name, status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('pipework', index)"
		@duplicate="(index: number) => handleDuplicate('pipework', index)"
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
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"/>
	</div>
</template>