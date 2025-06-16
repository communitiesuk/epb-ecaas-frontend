<script setup lang="ts">
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
		const duplicates = data.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			};

			state.cooling.airConditioning.data.push(newItem);
			state.cooling.airConditioning.complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		cooling: {
			airConditioning: { complete: true }
		}
	});
		
	navigateTo('/');		
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
		:items="store.cooling.airConditioning.data.map(x => x.name)"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/" secondary>
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="store.cooling.airConditioning?.complete ?? false" @completed="handleComplete"/>
	</div>
</template>
