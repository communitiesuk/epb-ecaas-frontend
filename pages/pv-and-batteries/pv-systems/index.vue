<script setup lang="ts">
const title = "Photovoltaic (PV) systems";
const page = usePage();
const store = useEcaasStore();

function handleRemove(index: number) {
	const data = store.pvAndBatteries.pvSystem?.data;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.pvAndBatteries.pvSystem!.data = data.length ? data : [];
			state.pvAndBatteries.pvSystem!.complete = false;
		});
	}
} 

function handleDuplicate<T extends PvSystemData>(index: number) {
	const data  = store.pvAndBatteries.pvSystem?.data;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.pvAndBatteries.pvSystem!.data.push(newItem);
			state.pvAndBatteries.pvSystem.complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		pvAndBatteries: {
			pvSystem: {
				complete: true
			}
		}
	});

	navigateTo('/pv-and-batteries');
}

function checkIsComplete(){
	return store.pvAndBatteries.pvSystem.complete ? true : false;
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
		id="pvSystems"
		title="PV Systems"
		:form-url="`${page?.url!}`"
		:items="store.pvAndBatteries.pvSystem.data.map(x => x.name)"
		@remove="(index: number) => handleRemove(index)"
		@duplicate="(index: number) => handleDuplicate(index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/"
			secondary
		>
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>
