<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { VentType } from "~/schema/api-schema.types";
import formStatus from "~/constants/formStatus";

const page = usePage();
const title = "Mechanical ventilation";
const store = useEcaasStore();

const { data } = store.infiltrationAndVentilation.mechanicalVentilation;

function handleRemove(index: number) {
	const datum = data[index] ?? undefined;
	if (!datum) return;

	const mvhrID = datum.data.id;
	data.splice(index, 1);

	store.$patch({
		infiltrationAndVentilation: {
			mechanicalVentilation: {
				data,
				complete: false,
			},
		},
	});

	const matchingDuctwork = store.infiltrationAndVentilation.ductwork.data.filter(x => x.data.mvhrUnit !== mvhrID);

	store.$patch({
		infiltrationAndVentilation: {
			ductwork: {
				data: matchingDuctwork,
			},
		},
	});
}

function handleDuplicate(index: number) {
	const mechanicalVentilation = data[index];

	if (mechanicalVentilation) {
		const duplicates = data.filter(s => s.data.name.match(duplicateNamePattern(mechanicalVentilation.data.name)));

		store.$patch((state) => {
			state.infiltrationAndVentilation.mechanicalVentilation.data.push({
				data: {
					...mechanicalVentilation.data,
					name: `${mechanicalVentilation.data.name} (${duplicates.length})`,
					id: uuidv4(),
				},
			});

			state.infiltrationAndVentilation.mechanicalVentilation.complete = false;
		});
	}
}
const mvhrArray = store.infiltrationAndVentilation.mechanicalVentilation.data?.filter(
	x => x.data.typeOfMechanicalVentilationOptions === VentType.MVHR);

function handleComplete() {
	store.$patch({
		infiltrationAndVentilation: {
			mechanicalVentilation: { complete: true },
		},
	});
		
	navigateTo("/infiltration-and-ventilation");		
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
		id="mechanicalVentilation"
		title="Mechanical ventilation"
		:form-url="page?.url!"
		:items="store.infiltrationAndVentilation.mechanicalVentilation.data?.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<p
		v-if="mvhrArray.length > 0"
		class="govuk-body">Note if you remove a MVHR this will also remove any associated ductwork</p>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/infiltration-and-ventilation" secondary>
			Return to infiltration and ventilation
		</GovButton>
		<CompleteElement
			:is-complete="!!store.infiltrationAndVentilation.mechanicalVentilation?.complete"
			:disabled="store.infiltrationAndVentilation.mechanicalVentilation.data.some(s => !s.complete)"
			@completed="handleComplete"
		/>
	</div>
</template>
