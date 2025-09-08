<script setup lang="ts">
const title = "Vents";
const page = usePage();
const store = useEcaasStore();

const { data = [] } = store.infiltrationAndVentilation.vents;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		infiltrationAndVentilation: {
			vents: {
				data,
				complete: false
			}
		}
	});
}

function handleDuplicate(index: number) {
	const vent = data[index];

	if (vent) {
		const duplicates = data.filter(d => d.name.match(duplicateNamePattern(vent.name)));

		store.$patch((state) => {
			state.infiltrationAndVentilation.vents.data.push({
				...vent,
				name: `${vent.name} (${duplicates.length})`
			});
		});
		store.infiltrationAndVentilation.vents.complete = false;
	}
}
function handleComplete() {
	store.$patch({
		infiltrationAndVentilation: {
			vents: { complete: true }
		}
	});
		
	navigateTo("/infiltration-and-ventilation");		
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<VentsInfo />
	<CustomList
		id="vents"
		title="Vents"
		:form-url="page?.url!"
		:items="store.infiltrationAndVentilation.vents.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/infiltration-and-ventilation" secondary>
			Return to infiltration and ventilation
		</GovButton>
		<CompleteElement :is-complete="store.infiltrationAndVentilation.vents?.complete ?? false" @completed="handleComplete"/>
	</div>
</template>
