<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Cooling";
const page = usePage();
const store = useEcaasStore();

function handleRemove(index: number) {
	const { data } = store.cooling.airConditioning;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.cooling.airConditioning.data = data.length ? data : [];
			state.cooling.airConditioning.complete = false;
		});
	}
}

function handleDuplicate(index: number) {
	const { data } = store.cooling.airConditioning;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f && f.data.name.match(duplicateNamePattern(item.data.name)));

		store.$patch((state) => {
			const newItem = {
				data: { ...item.data, name: `${item.data.name} (${duplicates.length})` },
				complete: item.complete,
			} as EcaasForm<AirConditioningData>;

			state.cooling.airConditioning.data.push(newItem);
			state.cooling.airConditioning.complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		cooling: {
			airConditioning: { complete: true },
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
		title="Air conditioning systems"
		:form-url="`${page?.url!}/air-conditioning`"
		:items="store.cooling.airConditioning.data?.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/heating-and-cooling-systems" secondary>
			Return to heating and cooling systems
		</GovButton>
		<CompleteElement
			:is-complete="store.cooling.airConditioning?.complete ?? false"
			:disabled="store.cooling.airConditioning.data.some(s => !s.complete)"
			@completed="handleComplete"/>
	</div>
</template>
