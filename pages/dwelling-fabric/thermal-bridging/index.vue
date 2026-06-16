<script setup lang="ts">
import { isEcaasForm, type EcaasForm, type FloorAboveUnheatedBasementData, type GroundFloorData, type LinearThermalBridgeData } from "~/stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";
import { page as pages } from "~/data/pages/pages";

const title = "Thermal bridging";
const page = usePage();
const store = useEcaasStore();
const psiJunctionErrors = ref<string[]>([]);

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
	psiJunctionErrors.value = [];

	const { dwellingSpaceGroundFloor, dwellingSpaceFloorAboveUnheatedBasement } = store.dwellingFabric.dwellingSpaceFloors;
	const linearThermalBridges = store.dwellingFabric.dwellingSpaceThermalBridging.dwellingSpaceLinearThermalBridges.data;

	const validateJunctions = (data: EcaasForm<GroundFloorData | FloorAboveUnheatedBasementData>[], type: "E5" | "E6") => {
		data.forEach(floor => {
			const thermalBridging = linearThermalBridges.filter(x => {
				const bridge = x.data as LinearThermalBridgeData;

				return bridge.typeOfThermalBridge === type && 
					(type === "E6" ? (bridge.associatedItemId === floor.data.id || bridge.associatedItemId === "none") :
						bridge.associatedItemId === floor.data.id);
			});

			if (!thermalBridging.length) {
				psiJunctionErrors.value.push(`You must add an ${type} junction associated with the element ${floor.data.name}`);
				return;
			}

			const totalLength = thermalBridging.map(x => x.data.length).reduce((acc, curr) => (acc ?? 0) + (curr ?? 0), 0);

			if ((totalLength ?? 0) > (floor.data.perimeter ?? 0)) {
				psiJunctionErrors.value.push(`The total lengths of all the thermal bridges associated with ${floor.data.name} are longer than the perimeter of the element itself.`);
			}
		});
	};

	validateJunctions(dwellingSpaceGroundFloor.data as EcaasForm<GroundFloorData>[], "E5");
	validateJunctions(dwellingSpaceFloorAboveUnheatedBasement.data as EcaasForm<FloorAboveUnheatedBasementData>[], "E6");

	return !psiJunctionErrors.value.length;
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<GovErrorSummary
		test-id="errorSummary"
		:error-list="[
			...psiJunctionErrors.map((error, index) => ({
				id: `thermalBridgesAssociatedElements_${index}`,
				text: error
			})),
		]"
		:use-links="false"
	/>
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
