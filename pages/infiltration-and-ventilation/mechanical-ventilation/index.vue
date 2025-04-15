<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const page = usePage();
const title = "Mechanical ventilation";
const store = useEcaasStore();

const { data } = store.infiltrationAndVentilation.mechanicalVentilation;

function handleRemove(index: number) {
	const mvhrID = data[index].id;
	data.splice(index, 1);

	store.$patch({
		infiltrationAndVentilation: {
			mechanicalVentilation: {
				data: data,
				complete: data.length > 0
			},
		},
	});

	const matchingDuctwork = store.infiltrationAndVentilation.ductwork.data.filter(x => x.mvhrUnit !== mvhrID);

	store.$patch({
		infiltrationAndVentilation: {
			ductwork: {
				data: matchingDuctwork
			}
		}
	});
}

function handleDuplicate(index: number) {
	const mechanicalVentilation = data[index];

	if (mechanicalVentilation) {
		const duplicates = data.filter(s => s.name.match(duplicateNamePattern(mechanicalVentilation.name)));

		store.$patch((state) => {
			state.infiltrationAndVentilation.mechanicalVentilation.data.push({
				...mechanicalVentilation,
				name: `${mechanicalVentilation.name} (${duplicates.length})`,
				id: uuidv4()
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
			<p class="govuk-body">Note if you remove a MVHR this will also remove any associated ductwork</p>
	<GovButton href="/infiltration-and-ventilation" secondary>
		Return to overview
	</GovButton>
</template>
