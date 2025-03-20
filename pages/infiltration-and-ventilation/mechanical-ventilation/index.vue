<script setup lang="ts">
const page = usePage();
const title = "Mechanical ventilation";
const store = useEcaasStore();

const { data } = store.infiltrationAndVentilation.mechanicalVentilation;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		infiltrationAndVentilation: {
			mechanicalVentilation: {
				data: data.length ? data : undefined,
				complete: data.length > 0
			},
		},
	});
}
function handleDuplicate(index: number) {
	const mechanicalVentilation = data[index];

	if (mechanicalVentilation) {
		const duplicates = data.filter(s => s.name.match(duplicateNamePattern(mechanicalVentilation.name)));

		store.$patch((state) => {
			state.infiltrationAndVentilation.mechanicalVentilation.data.push({
				...mechanicalVentilation,
				name: `${mechanicalVentilation.name} (${duplicates.length})`
			});
		});
	}
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovCustomList
		id="mechanicalVentilation" title="Mechanical ventilation" :form-url="page?.url!" :items="store.infiltrationAndVentilation.mechanicalVentilation.data?.map(
			x => x.name)" @remove="handleRemove" @duplicate="handleDuplicate" />
	<GovButton href="/infiltration-and-ventilation" secondary>
		Return to overview
	</GovButton>
</template>
