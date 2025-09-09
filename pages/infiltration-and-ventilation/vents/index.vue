<script setup lang="ts">
import formStatus from '~/constants/formStatus';

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
		const duplicates = data.filter(d => d.data.name.match(duplicateNamePattern(vent.data.name)));

		store.$patch((state) => {
			state.infiltrationAndVentilation.vents.data.push({
				data: {
					...vent.data,
					name: `${vent.data.name} (${duplicates.length})`
				}
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
		:items="store.infiltrationAndVentilation.vents.data?.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/infiltration-and-ventilation" secondary>
			Return to infiltration and ventilation
		</GovButton>
		<CompleteElement
			:is-complete="store.infiltrationAndVentilation.vents?.complete ?? false"
			:disabled="store.infiltrationAndVentilation.vents.data.some(s => !s.complete)"
			@completed="handleComplete"
		/>
	</div>
</template>
