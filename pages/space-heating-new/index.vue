<script setup lang="ts">
import formStatus from "~/constants/formStatus";
import { v4 as uuidv4 } from "uuid";

const title = "Space heating NEW";
const page = usePage();
const store = useEcaasStore();

type SpaceHeatingType = keyof typeof store.spaceHeatingNew;

const { hotWaterCylinder } = store.domesticHotWater.waterHeating;
// const { wetDistribution } = store.spaceHeatingNew.heatEmitting;

function handleRemove(spaceHeatingType: SpaceHeatingType, index: number) {
	const items = store.spaceHeatingNew[spaceHeatingType]?.data;
	
	let heatSourceId;

	if(items[index]?.data && "typeOfHeatSource" in items[index].data){
		heatSourceId = store.spaceHeatingNew.heatSource.data[index]?.data.id;
	}
	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.spaceHeatingNew[spaceHeatingType].data = items.length ? items : [];
			state.spaceHeatingNew[spaceHeatingType].complete = false;
		});

		if(heatSourceId) {
			store.removeTaggedAssociations()([ hotWaterCylinder], heatSourceId, "heatSource");
		}
	}
};

function handleDuplicate(spaceHeatingType: SpaceHeatingType, index: number) {

	const { data } = store.spaceHeatingNew[spaceHeatingType];
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f && f.data.name.match(duplicateNamePattern(item.data.name)));

		store.$patch((state) => {
			const newItem = {
				data: { ...item.data, name: `${item.data.name} (${duplicates.length})`, id: uuidv4() },
				complete: item.complete,
			};

			state.spaceHeatingNew[spaceHeatingType].data.push(newItem);
			state.spaceHeatingNew[spaceHeatingType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		spaceHeatingNew: {
			heatSource: { complete: true },
			heatingControls: { complete: true },
		},
	});

	navigateTo("/space-heating-new");
};

function checkIsComplete(){
	const generators = store.spaceHeatingNew;
	return Object.values(generators).every(generator => generator.complete);
};

function hasIncompleteEntries() {
	const spaceHeatingTypes = store.spaceHeatingNew;
	
	return Object.values(spaceHeatingTypes).some(
		items => items.data.some(
			item => isEcaasForm(item) ? !item.complete : false));
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="heatSource"
		title="Heat sources"
		:form-url="`${page?.url!}/heat-source`"
		:items="store.spaceHeatingNew.heatSource.data.map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@duplicate="(index: number) => handleDuplicate('heatSource', index)"
		@remove="(index: number) => handleRemove('heatSource', index)"
	/>
	<CustomList
		id="heatSource"
		title="Heating controls"
		:form-url="`${page?.url!}/heating-controls`"
		:items="store.spaceHeatingNew.heatingControls.data.map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		:max-number-of-items=1
		@remove="(index: number) => handleRemove('heatingControls', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/"
			secondary
		>
			Return to overivew
		</GovButton>
		<NuxtLink :to="`${page?.url}/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete"/>
	</div>
</template>