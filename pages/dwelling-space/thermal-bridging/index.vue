<script setup lang="ts">
const title = "Thermal bridging";
const page = usePage();
const store = useEcaasStore();

type ThermalBridgingType = keyof typeof store.dwellingFabric.dwellingSpaceThermalBridging;
interface ThermalBridgingData extends LinearThermalBridgeData, PointThermalBridgeData {};

function handleRemove(thermalBridgingType: ThermalBridgingType, index: number) {
	const items = store.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]?.data;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]!.data = items.length ? items : [];
			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]!.complete = false;
		});
	}
} 

function handleDuplicate<T extends ThermalBridgingData>(thermalBridgingType: ThermalBridgingType, index: number) {
	const items  = store.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]?.data;
	const item = items?.[index];
    
	if (item) {
		const duplicates = items.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]!.data.push(newItem);
			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceThermalBridging: {
				dwellingSpaceLinearThermalBridges: { complete: true },
				dwellingSpacePointThermalBridges: { complete: true }
			}
		}
	});

	navigateTo('/dwelling-space');
}

function checkIsComplete(){
	const bridges = store.dwellingFabric.dwellingSpaceThermalBridging;
	return Object.values(bridges).every(bridge => bridge.complete);
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
		id="linearThermalBridges"
		title="Linear thermal bridges"
		:form-url="`${page?.url!}/linear`"
		:items="store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpaceLinearThermalBridges', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceLinearThermalBridges', index)"
	/>
	<CustomList
		id="pointThermalBridges"
		title="Point thermal bridges"
		:form-url="`${page?.url!}/point`"
		:items="store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('dwellingSpacePointThermalBridges', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpacePointThermalBridges', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/dwelling-space"
			secondary
		>
			Return to dwelling space
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>
