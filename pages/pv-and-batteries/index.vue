<script setup lang="ts">
const title = "PV (photovoltaic) systems and electric batteries";
const page = usePage();
const store = useEcaasStore();

type PvAndBatteryType = keyof typeof store.pvAndBatteries;
type PvAndBatteryData = PvSystemData & ElectricBatteryData & PvDiverterData;

function handleRemove(pvAndBatteryType: PvAndBatteryType, index: number) {
	const data = store.pvAndBatteries[pvAndBatteryType]?.data;

	if (data) {
		data.splice(index, 1);

		store.$patch((state) => {
			state.pvAndBatteries[pvAndBatteryType].data = data.length ? data : [];
			state.pvAndBatteries[pvAndBatteryType].complete = false;
		});
	}
} 

function handleDuplicate<T extends PvAndBatteryData>(pvAndBatteryType: PvAndBatteryType, index: number) {
	const data  = store.pvAndBatteries[pvAndBatteryType]?.data;
	const item = data?.[index];
    
	if (item) {
		const duplicates = data.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.pvAndBatteries[pvAndBatteryType].data.push(newItem);
			state.pvAndBatteries[pvAndBatteryType].complete = false;
		});
	}
}
function handleComplete() {
	store.$patch({
		pvAndBatteries: {
			pvSystems: { complete: true },
			electricBattery: { complete: true }
		}
	});

	navigateTo('/');
}

function checkIsComplete(){
	const pvAndBatteries = store.pvAndBatteries;
	return Object.values(pvAndBatteries).every(pvAndBattery => pvAndBattery.complete);
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
		:form-url="`${page?.url!}/pv-systems`"
		:items="store.pvAndBatteries.pvSystems.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('pvSystems', index)"
		@duplicate="(index: number) => handleDuplicate('pvSystems', index)"
	/>
	<CustomList
		id="electricBattery"
		title="Electric battery"
		hint="Only one electric battery can be added per energy supply"
		:form-url="`${page?.url!}/electric-battery`"
		:items="store.pvAndBatteries.electricBattery.data.map(x => x.name)"
		:max-number-of-items=1
		@remove="(index: number) => handleRemove('electricBattery', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/"
			secondary
		>
			Return to overview
		</GovButton>
		<NuxtLink :to="`${page?.url}/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>