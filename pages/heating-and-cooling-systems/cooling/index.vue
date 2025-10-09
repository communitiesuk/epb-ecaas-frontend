<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Cooling";
const page = usePage();
const store = useEcaasStore();

function handleRemove(index: number) {
	const { data } = store.heatingSystems.cooling.airConditioning;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.heatingSystems.cooling.airConditioning.data = data.length ? data : [];
			state.heatingSystems.cooling.airConditioning.complete = false;
		});
	}
}

function handleDuplicate(index: number) {
	const { data } = store.heatingSystems.cooling.airConditioning;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f && f.data.name.match(duplicateNamePattern(item.data.name)));

		store.$patch((state) => {
			const newItem = {
				data: {...item.data, name: `${item.data.name} (${duplicates.length})`},
				complete: item.complete
			} as EcaasForm<AirConditioningData>

			state.heatingSystems.cooling.airConditioning.data.push(newItem);
			state.heatingSystems.cooling.airConditioning.complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		heatingSystems: {
			cooling: {
				airConditioning: { complete: true },
			},
		},
	});
		
	navigateTo("/heating-and-cooling-systems");		
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
		id="airConditioning"
		title="Air conditioning"
		:form-url="`${page?.url!}/air-conditioning`"
		:items="store.heatingSystems.cooling.airConditioning.data?.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/heating-and-cooling-systems" secondary>
			Return to heating systems
		</GovButton>
		<CompleteElement
			:is-complete="store.heatingSystems.cooling.airConditioning?.complete ?? false"
			:disabled="store.heatingSystems.cooling.airConditioning.data.some(s => !s.complete)"
			@completed="handleComplete"/>
	</div>
</template>
