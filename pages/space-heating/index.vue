<script setup lang="ts">
import formStatus from "~/constants/formStatus";
import { v4 as uuidv4 } from "uuid";

const title = "Space heating";
const page = usePage();
const store = useEcaasStore();

type SpaceHeatingType = keyof typeof store.spaceHeating;
type SpaceHeatingData = EcaasForm<HeatSourceData> & EcaasForm<HeatEmittingData> & EcaasForm<HeatingControlData>;

const { heatSources: dhwHeatSources, waterStorage, hotWaterOutlets } = store.domesticHotWater;

const { heatEmitters } = store.spaceHeating;
function handleRemove(spaceHeatingType: SpaceHeatingType, index: number) {
	const items = store.spaceHeating[spaceHeatingType]?.data;

	let heatSourceId;

	if (items[index]?.data && "typeOfHeatSource" in items[index].data) {
		heatSourceId = store.spaceHeating.heatSource.data[index]?.data.id;
	}
	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.spaceHeating[spaceHeatingType].data = items.length ? items : [];
			state.spaceHeating[spaceHeatingType].complete = false;
		});

		if (heatSourceId) {
			store.removeTaggedAssociations()([heatEmitters], heatSourceId, "heatSource"); 
			

			const dhwHeatSourceIdToRemove = dhwHeatSources.data
				.filter(({ data: x }) => x.heatSourceId === heatSourceId)
				.map(x => x.data.id)[0]; 

			//remove dhw heat sources that reference deleted space heating heat source
			const dhwHeatSourcesToKeep = dhwHeatSources.data.filter(({ data: x }) => x.heatSourceId !== heatSourceId); 
			store.$patch(state => {
				state.domesticHotWater.heatSources.data = dhwHeatSourcesToKeep;
				if (dhwHeatSourcesToKeep.length === 0) {
					state.domesticHotWater.heatSources.complete = false;
				}
			});

			//remove reference to deleted dhw heat source
			store.removeTaggedAssociations()([waterStorage, hotWaterOutlets], dhwHeatSourceIdToRemove, "dhwHeatSourceId"); 

		}
	}
};

function handleDuplicate<T extends SpaceHeatingData>(spaceHeatingType: SpaceHeatingType, index: number) {

	const { data } = store.spaceHeating[spaceHeatingType];
	const item = data?.[index];

	if (item) {
		const duplicates = data.filter(x => x && x.data.name.match(duplicateNamePattern(item.data.name)));

		store.$patch((state) => {
			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${item.data.name} (${duplicates.length})`,
					id: uuidv4(),
				},
			} as T;

			state.spaceHeating[spaceHeatingType].data.push(newItem);
			state.spaceHeating[spaceHeatingType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		spaceHeating: {
			heatSource: { complete: true },
			heatEmitters: { complete: true },
			heatingControls: { complete: true },
		},
	});

	navigateTo("/space-heating");
}

function checkIsComplete() {
	const sections = store.spaceHeating;
	return Object.values(sections).every((section) => section.complete);
}

function hasIncompleteEntries() {
	const spaceHeatingTypes = store.spaceHeating;

	return Object.values(spaceHeatingTypes).some((items) =>
		items.data.some((item) => (isEcaasForm(item) ? !item.complete : false)),
	);
}
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
		:items="
			store.spaceHeating.heatSource.data.map((x) => ({
				name: x.data?.name,
				status: x.complete ? formStatus.complete : formStatus.inProgress,
			}))
		"
		:show-status="true"
		@duplicate="(index: number) => handleDuplicate('heatSource', index)"
		@remove="(index: number) => handleRemove('heatSource', index)"
	/>
	<CustomList
		id="heatEmitters"
		title="Heat emitters"
		:form-url="`${page?.url!}/heat-emitters`"
		:items="
			store.spaceHeating.heatEmitters.data.map((x) => ({
				name: x.data?.name,
				status: x.complete ? formStatus.complete : formStatus.inProgress,
			}))
		"
		:show-status="true"
		@duplicate="(index: number) => handleDuplicate('heatEmitters', index)"
		@remove="(index: number) => handleRemove('heatEmitters', index)"
	/>
	<CustomList
		id="heatingControl"
		title="Heating controls"
		:form-url="`${page?.url!}/heating-controls`"
		:items="
			store.spaceHeating.heatingControls.data.map((x) => ({
				name: x.data?.name,
				status: x.complete ? formStatus.complete : formStatus.inProgress,
			}))
		"
		:show-status="true"
		:max-number-of-items="1"
		@remove="(index: number) => handleRemove('heatingControls', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/" secondary> Return to overview </GovButton>
		<NuxtLink
			:to="`${page?.url}/summary`"
			class="govuk-button govuk-button--secondary"
		>View summary</NuxtLink
		>
		<CompleteElement
			:is-complete="checkIsComplete()"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"
		/>
	</div>
</template>