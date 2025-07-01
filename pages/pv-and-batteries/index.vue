<script setup lang="ts">
const title = "Photovoltaic (PV) systems";
const page = usePage();
const store = useEcaasStore();

function handleRemove(index: number) {
	const data = store.pvAndBatteries.pvSystems?.data;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.pvAndBatteries.pvSystems!.data = data.length ? data : [];
			state.pvAndBatteries.pvSystems!.complete = false;
		});
	}
} 

function handleDuplicate<T extends PvSystemData>(index: number) {
	const data  = store.pvAndBatteries.pvSystems?.data;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.pvAndBatteries.pvSystems!.data.push(newItem);
			state.pvAndBatteries.pvSystems.complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		pvAndBatteries: {
			pvSystems: {
				complete: true
			}
		}
	});

	navigateTo('/pv-and-batteries');
}

function checkIsComplete(){
	return store.pvAndBatteries.pvSystems.complete ? true : false;
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
		:form-url="`${page?.url!}/pv-system`"
		:items="store.pvAndBatteries.pvSystems.data.map(x => x.name)"
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
