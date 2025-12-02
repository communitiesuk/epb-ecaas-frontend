<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Space heating NEW";
const page = usePage();
const store = useEcaasStore();

type SpaceHeatingType = keyof typeof store.spaceHeatingNew;
// type SpaceHeatingData = EcaasForm<HeatSourceData>;

function handleRemove(spaceHeatingType: SpaceHeatingType, index: number) {
	const data = store.spaceHeatingNew[spaceHeatingType]?.data;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.spaceHeatingNew[spaceHeatingType].data = data.length ? data : [];
			state.spaceHeatingNew[spaceHeatingType].complete = false;
		});
	}
};

function handleComplete() {
	store.$patch({
		spaceHeatingNew: {
			heatSource: { complete: true },
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
		title="Heat source"
		:form-url="`${page?.url!}/heat-source`"
		:items="store.spaceHeatingNew.heatSource.data.map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('heatSource', index)"
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