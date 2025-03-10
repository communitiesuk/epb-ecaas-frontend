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
				complete: data.length > 0
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
	}
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<p v-if="store.infiltrationAndVentilation.vents.data.length === 0" class="govuk-hint">
		Add vents below, after adding one you will have options to add others, edit and duplicate.
	</p>
	<GovCustomList
		id="vents"
		title="Vents"
		:form-url="page?.url!"
		:items="store.infiltrationAndVentilation.vents.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<GovButton href="/infiltration-and-ventilation" secondary>Return to overview</GovButton>
</template>
