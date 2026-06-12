<script setup lang="ts">
import { isEcaasForm, type EcaasForm, type FloorAboveUnheatedBasementData, type FloorOfHeatedBasementData, type GroundFloorData } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";
import { page as pages } from "~/data/pages/pages";

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
	const items = store.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType]?.data;
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
					name: `${name} (${duplicates.length})`,
				},
			} as T;

			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType].data.push(newItem);
			state.dwellingFabric.dwellingSpaceThermalBridging[thermalBridgingType].complete = false;
		});
	}
}

function handleComplete() {
	if (!validatePsiJunctions()) {
		return;
	}

	store.$patch({
		dwellingFabric: {
			dwellingSpaceThermalBridging: {
				dwellingSpaceLinearThermalBridges: { complete: true },
				dwellingSpacePointThermalBridges: { complete: true },
			},
		},
	});

	navigateTo("/dwelling-fabric");
}

const hasIncompleteEntries = () =>
	Object.values(store.dwellingFabric.dwellingSpaceThermalBridging)
		.some(section => section.data.some(item => isEcaasForm(item) && !item.complete));

const validatePsiJunctions = (): boolean => {
	const { dwellingSpaceGroundFloor, dwellingSpaceFloorAboveUnheatedBasement, dwellingSpaceFloorOfHeatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
	const { dwellingSpaceWallOfHeatedBasement } = store.dwellingFabric.dwellingSpaceWalls;
	const linearThermalBridges = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;

	const validateJunctions = (type: "E5" | "E6" | "E22", data: EcaasForm<GroundFloorData | FloorAboveUnheatedBasementData | FloorOfHeatedBasementData>[]) => {
		const groupedByAssociatedItem = Object.groupBy(linearThermalBridges, x => {
			const bridge = x.data as LinearThermalBridgeData;
			
			if (bridge.typeOfThermalBridge === type) {
				return bridge.associatedItemId;
			}

			return "ungrouped";
		});

		const associatedItemIds = Object.keys(groupedByAssociatedItem);

		if (associatedItemIds.some(x => x === undefined)) {
			return false;
		}

		return associatedItemIds.filter(x => x !== "ungrouped").every(associatedItemId => {
			const associatedFloor = data.find(x => x.data.id === associatedItemId);

			const totalLength = groupedByAssociatedItem[associatedItemId]?.map(x => x.data.length)
				.reduce((acc, curr) => (acc ?? 0) + (curr ?? 0), 0);

			if (associatedFloor && "perimeter" in associatedFloor.data) {
				return (totalLength ?? 0) <= (associatedFloor?.data.perimeter ?? 0);
			}

			const wallOfHeatedBasement = dwellingSpaceWallOfHeatedBasement.data.find(wall => wall.data.associatedBasementFloorId === associatedFloor?.data.id);

			return (totalLength ?? 0) <= (wallOfHeatedBasement?.data.perimeter ?? 0);
		});
	};

	return [
		validateJunctions("E5", dwellingSpaceGroundFloor.data as EcaasForm<GroundFloorData>[]),
		validateJunctions("E6", dwellingSpaceFloorAboveUnheatedBasement.data as EcaasForm<FloorAboveUnheatedBasementData>[]),
		validateJunctions("E22", dwellingSpaceFloorOfHeatedBasement.data as EcaasForm<FloorOfHeatedBasementData>[]),
	].every(isValid => isValid);
};
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
		<GovButton :href="pages('dwellingFabric').url" secondary>
			Return to dwelling fabric
		</GovButton>
		<GovButton :href="pages('dwellingFabricSummary').url" secondary>
			View summary
		</GovButton>
		<CompleteElement
			:is-complete="Object.values(store.dwellingFabric.dwellingSpaceThermalBridging).every(section => section.complete)"
			:disabled="hasIncompleteEntries()"
			@completed="handleComplete"/>
	</div>
</template>
