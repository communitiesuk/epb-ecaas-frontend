<script setup lang="ts">
const title = "Thermal bridging";
const page = usePage();
const store = useEcaasStore();

type ThermalBridgingType = keyof typeof store.livingSpaceFabric.livingSpaceThermalBridging;
interface ThermalBridgingData extends LinearThermalBridgeData, PointThermalBridgeData {};

function handleRemove(thermalBridgingType: ThermalBridgingType, index: number) {
	const items = store.livingSpaceFabric.livingSpaceThermalBridging[thermalBridgingType]?.data;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.livingSpaceFabric.livingSpaceThermalBridging[thermalBridgingType]!.data = items.length ? items : [];
			state.livingSpaceFabric.livingSpaceThermalBridging[thermalBridgingType]!.complete = false;
		});
	}
} 

function handleDuplicate<T extends ThermalBridgingData>(thermalBridgingType: ThermalBridgingType, index: number) {
	const items  = store.livingSpaceFabric.livingSpaceThermalBridging[thermalBridgingType]?.data;
	const item = items?.[index];
    
	if (item) {
		const duplicates = items.filter(f => f.name.match(duplicateNamePattern(item.name)));

		store.$patch((state) => {
			const newItem = {
				...item,
				name: `${item.name} (${duplicates.length})`
			} as T;

			state.livingSpaceFabric.livingSpaceThermalBridging[thermalBridgingType]!.data.push(newItem);
			state.livingSpaceFabric.livingSpaceThermalBridging[thermalBridgingType].complete = false;
		});
	}
}

function handleComplete() {
	store.$patch({
		livingSpaceFabric: {
			livingSpaceThermalBridging: {
				livingSpaceLinearThermalBridges: { complete: true },
				livingSpacePointThermalBridges: { complete: true }
			}
		}
	});

	navigateTo('/living-space');
}

function checkIsComplete(){
	const bridges = store.livingSpaceFabric.livingSpaceThermalBridging;
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
		:items="store.livingSpaceFabric.livingSpaceThermalBridging.livingSpaceLinearThermalBridges.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpaceLinearThermalBridges', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpaceLinearThermalBridges', index)"
	/>
	<CustomList
		id="pointThermalBridges"
		title="Point thermal bridges"
		:form-url="`${page?.url!}/point`"
		:items="store.livingSpaceFabric.livingSpaceThermalBridging.livingSpacePointThermalBridges?.data.map(x => x.name)"
		@remove="(index: number) => handleRemove('livingSpacePointThermalBridges', index)"
		@duplicate="(index: number) => handleDuplicate('livingSpacePointThermalBridges', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/living-space"
			secondary
		>
			Return to overview
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" @completed="handleComplete"/>
	</div>
</template>
