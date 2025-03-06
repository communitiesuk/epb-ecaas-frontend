<script setup lang="ts">
const page = usePage();
const title = "Mechanical ventilation";
const store = useEcaasStore();

const { mechanicalVentilationObjects = [] } =
  store.infiltrationAndVentilation.InfilAndVentMechanicalVentilation.data;

function handleRemove(index: number) {
	mechanicalVentilationObjects.splice(index, 1);

	store.$patch({
		infiltrationAndVentilation: {
			InfilAndVentMechanicalVentilation: {
				data: {
					mechanicalVentilationObjects: mechanicalVentilationObjects.length
						? mechanicalVentilationObjects
						: undefined,
				},
			},
		},
	});
}
function handleDuplicate(index: number) {
	const mechanicalVentilation = mechanicalVentilationObjects[index];

	if (mechanicalVentilation) {
		const duplicates = mechanicalVentilationObjects.filter(s => s.name.match(duplicateNamePattern(mechanicalVentilation.name)));

		store.$patch((state) => {
			state.infiltrationAndVentilation.InfilAndVentMechanicalVentilation.data.mechanicalVentilationObjects?.push({
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
		id="mechanicalVentilation"
		title="Mechanical Ventilation"
		:form-url="page?.url!"
		:items="
			store.infiltrationAndVentilation.InfilAndVentMechanicalVentilation.data.mechanicalVentilationObjects?.map(
				x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<GovButton href="/infiltration-and-ventilation" secondary>
		Return to overview
	</GovButton>
</template>
