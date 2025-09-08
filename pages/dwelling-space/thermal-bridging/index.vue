<script setup lang="ts">
import { isEcaasForm } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";

const title = "Thermal bridging";
const page = usePage();
const store = useEcaasStore();

type ThermalBridgingType = keyof typeof store.dwellingFabric.dwellingSpaceThermalBridging;
type ThermalBridgingData = EcaasForm<LinearThermalBridgeData> & EcaasForm<PointThermalBridgeData>;

function handleRemove(thermalBridgingType: ThermalBridgingType, index: number) {
	const items = store.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]?.data;

	if (items) {
		items.splice(index, 1);

		store.$patch((state) => {
			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType].data = items.length ? items : [];
			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType].complete = false;
		});
	}
} 

function handleDuplicate<T extends ThermalBridgingData>(thermalBridgingType: ThermalBridgingType, index: number) {
	const items  = store.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]?.data;
	const item = items?.[index];
	let name: string;
    
	if (item) {
		const duplicates = items.filter(f => {
			if (isEcaasForm(f) && isEcaasForm(item)) {
				name = item.data.name;
				return f.data.name.match(duplicateNamePattern(item.data.name));
			}
			return false;
		});

		store.$patch((state) => {
			const newItem = {
				complete: item.complete,
				data: {
					...item.data,
					name: `${name} (${duplicates.length})`
				}
			} as T;

			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType].data.push(newItem);
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

	navigateTo("/dwelling-space");
}

const hasIncompleteEntries = () =>
	Object.values(store.dwellingFabric.dwellingSpaceThermalBridging)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));

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
		:items="store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('dwellingSpaceLinearThermalBridges', index)"
		@duplicate="(index: number) => handleDuplicate('dwellingSpaceLinearThermalBridges', index)"
	/>
	<CustomList
		id="pointThermalBridges"
		title="Point thermal bridges"
		:form-url="`${page?.url!}/point`"
		:items="store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpacePointThermalBridges.data.filter(x => isEcaasForm(x)).map(x => ({
			name: x.data?.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
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
		<CompleteElement
			:is-complete="Object.values(store.dwellingFabric.dwellingSpaceThermalBridging).every(section => section.complete)"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"/>
	</div>
</template>
