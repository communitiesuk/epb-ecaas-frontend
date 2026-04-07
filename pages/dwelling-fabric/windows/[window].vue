<script setup lang="ts">
import type { WindowData } from "#imports";
import { getUrl, uniqueName } from "#imports";
import { v4 as uuidv4 } from "uuid";
import { gValueZod, heightTransparentZod, maxWindowOpenAreaZod, midHeightAirFlowPathZod, widthTransparentZod } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

const title = "Window";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const windowsData = store.dwellingFabric.dwellingSpaceWindows.data;
const window = useItemToEdit("window", windowsData);
const windowId = window?.data.id ?? uuidv4();
const index = getStoreIndex(windowsData);

const model = ref(window?.data);

const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

// Build tagging options with "none of the above"
const tagOptions = [
	...dwellingSpaceExternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
	...dwellingSpaceRoofs.data.map(x => [x.data.id, x.data.name] as [string, string]),
	["none", "None of the above"] as [string, string],
].filter(x => x[0] !== undefined);


if (model.value && model.value.taggedItem === undefined) {
	model.value.taggedItem = "none";
}

const saveForm = (fields: WindowData) => {
	store.$patch((state) => {
		const { dwellingSpaceWindows } = state.dwellingFabric;
		const shouldSavePitchOrientation = tagOptions.length === 1 || fields.taggedItem === "none";

		const commonFields: Partial<WindowData> = {
			id: windowId || uuidv4(),
			name: fields.name,
			taggedItem: shouldSavePitchOrientation ? undefined : fields.taggedItem,
			pitch: shouldSavePitchOrientation ? fields.pitch : undefined,
			orientation: shouldSavePitchOrientation ? fields.orientation : undefined,
			height: fields.height,
			width: fields.width,
			uValue: fields.uValue,
			solarTransmittance: fields.solarTransmittance,
			elevationalHeight: fields.elevationalHeight,
			securityRisk: fields.securityRisk,
			openingToFrameRatio: fields.openingToFrameRatio,
		};

		let commonFieldsIncludingOpenableParts;

		const numberParts = fields.numberOpenableParts;

		switch (numberParts) {
			case "0":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
				};
				break;
			case "1":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
				} as Extract<WindowData, { numberOpenableParts: "1" }>;
				break;
			case "2":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
				} as Extract<WindowData, { numberOpenableParts: "2" }>;
				break;
			case "3":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
				} as Extract<WindowData, { numberOpenableParts: "3" }>	;
				break;
			case "4":
				commonFieldsIncludingOpenableParts = {
					...commonFields,
					numberOpenableParts: fields.numberOpenableParts,
					maximumOpenableArea: fields.maximumOpenableArea,
					midHeightOpenablePart1: fields.midHeightOpenablePart1,
					midHeightOpenablePart2: fields.midHeightOpenablePart2,
					midHeightOpenablePart3: fields.midHeightOpenablePart3,
					midHeightOpenablePart4: fields.midHeightOpenablePart4,
				} as Extract<WindowData, { numberOpenableParts: "4" }>;
				break;
			default:
				commonFieldsIncludingOpenableParts = { ...commonFields } as WindowData;
				break;
		}
		let newWindowValue : WindowData;

		if (fields.curtainsOrBlinds) {
			newWindowValue = {
				...commonFieldsIncludingOpenableParts,
				curtainsOrBlinds: true,
				treatmentType: fields.treatmentType,
				treatmentControls: fields.treatmentControls,
				thermalResistivityIncrease: fields.thermalResistivityIncrease,
				solarTransmittanceReduction: fields.solarTransmittanceReduction,
			} as WindowData;
		} else {
			newWindowValue = {
				curtainsOrBlinds: false,
				...commonFieldsIncludingOpenableParts,
			} as WindowData;
		}

		const existingShading = (dwellingSpaceWindows.data[index]?.data as Record<string, unknown>)?.shading;

		dwellingSpaceWindows.data[index] = {
			data: {
				...newWindowValue,
				...(fields.hasShading ? {
					hasShading: true,
					shading: existingShading ?? [],
				} : {
					hasShading: false, 
				}),
			} as WindowData,
			complete: true,
		};

		dwellingSpaceWindows.complete = false;
	});
	navigateTo("/dwelling-fabric/windows");
};

autoSaveElementForm<WindowData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceWindows,
	defaultName: "Window",
	onPatch: (state, newData, index) => {
		newData.data.id ??= windowId;
		const existingShading = (state.dwellingFabric.dwellingSpaceWindows.data[index]?.data as Record<string, unknown> | undefined)?.shading;
		state.dwellingFabric.dwellingSpaceWindows.data[index] = newData;
		if (existingShading !== undefined) {
			(state.dwellingFabric.dwellingSpaceWindows.data[index].data as Record<string, unknown>).shading = existingShading;
		}
		state.dwellingFabric.dwellingSpaceWindows.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();

const shading = model?.value && "shading" in model.value ? model.value.shading : [];

const writeShadingToStore = (items: ShadingObjectData[]) => {
	store.$patch((state) => {
		const window = state.dwellingFabric.dwellingSpaceWindows.data[index];
		if (!window) return;
		(window.data as Record<string, unknown>).shading = items;
	});
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="windowErrorSummary" />
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(windowsData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FieldsAssociatedWallRoof
			id="taggedItem"
			name="taggedItem"
			label="Associated wall or roof"
			help="Select the wall or roof that this door is in. It should have the same orientation and pitch as the door."
		/>
		<template v-if="model && (model.taggedItem === 'none' || tagOptions.length === 1)">
			<FieldsPitch
				id="pitch"
				name="pitch"
				data-field="Zone.BuildingElement.*.pitch"
			/>
			<FieldsOrientation
				v-if="model.pitch != null && model.pitch !== 0 && model.pitch !== 180"
				id="orientation"
				name="orientation"
				data-field="Zone.BuildingElement.*.orientation360"
			/>
		</template>
		<FormKit
			id="height"
			type="govInputWithSuffix"
			suffix-text="m" 
			label="Height"
			help="Enter the height of the window, including the frame"
			name="height"
			:validation="zodTypeAsFormKitValidation(heightTransparentZod)"
			data-field="Zone.BuildingElement.*.height" />
		<FormKit
			id="width"
			type="govInputWithSuffix"
			suffix-text="m"
			label="Width"
			help="Enter the width of the window, including the frame"
			name="width"
			:validation="zodTypeAsFormKitValidation(widthTransparentZod)"
			data-field="Zone.BuildingElement.*.width" />
		<FieldsElevationalHeight />

		<FieldsUValue />
		<FormKit
			id="solarTransmittance"
			type="govInputFloat"
			label="Transmittance of solar energy "
			help="Enter the total solar energy transmittance or G value of the transparent part of the window. It should be a decimal between 0 and 1."
			name="solarTransmittance"
			:validation="zodTypeAsFormKitValidation(gValueZod)"
			data-field="Zone.BuildingElement.*.g_value" />
		<FormKit
			id="openingToFrameRatio" 
			type="govInputFloat"
			label="Frame to opening ratio"
			help="Enter the proportion of the window taken up by the frame compared to the total opening area. It should be a decimal between 0 and 1."
			name="openingToFrameRatio"
			validation="required | number | min:0 | max:1"
			data-field="Zone.BuildingElement.*.frame_area_fraction">
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-half">Opening to frame ratio</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">0</th>
							<td class="govuk-table__cell">There is no frame, only glass</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">1</th>
							<td class="govuk-table__cell">There is no glass</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="securityRisk"
			name="securityRisk"
			type="govBoolean"
			label="Is having this window open a security risk?"
			help="A window is a security risk if you are unable to leave it open at night. If it is on the ground floor, in a basement, or is easily accessible, it is a security risk."
			validation="required"
			data-field="Zone.BuildingElement.*.security_risk"
		/>
		<FormKit
			id="numberOpenableParts"
			type="govRadios"
			:options="{
				1: '1',
				2: '2',
				3: '3',
				4: '4',
				0: 'None',
			}"
			label="Number of openable parts"
			name="numberOpenableParts"
			validation="required"
		/>

		<template v-if="!!model && model.numberOpenableParts && model.numberOpenableParts !== '0'">
			<FormKit
				id="maximumOpenableArea"
				type="govInputWithSuffix"
				suffix-text="m²"
				label="Maximum openable area"
				help="Enter the total area of the gap created when the window is fully open, as defined by Part O"
				name="maximumOpenableArea"
				:validation="zodTypeAsFormKitValidation(maxWindowOpenAreaZod)"
			/>
		</template>

		<template v-if="!!model && model.numberOpenableParts && model.numberOpenableParts !== '0'">
			<FormKit
				id="midHeightOpenablePart1"
				type="govInputWithSuffix"
				suffix-text="m"
				label="Mid height of the air flow path for openable part 1 "
				help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the window when fully open"
				name="midHeightOpenablePart1"
				:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
			/>
			<template v-if="model.numberOpenableParts !== '1'">
				<FormKit
					id="midHeightOpenablePart2"
					type="govInputWithSuffix"
					suffix-text="m"
					label="Mid height of the air flow path for openable part 2 "
					help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the window when fully open"
					name="midHeightOpenablePart2"
					:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
				/>
				<template v-if="model.numberOpenableParts !== '2'">
					<FormKit
						id="midHeightOpenablePart3"
						type="govInputWithSuffix"
						suffix-text="m"
						label="Mid height of the air flow path for openable part 3 "
						help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the window when fully open"
						name="midHeightOpenablePart3"
						:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
					/>
					<template v-if="model.numberOpenableParts !== '3'">
						<FormKit
							id="midHeightOpenablePart4"
							type="govInputWithSuffix"
							suffix-text="m"
							label="Mid height of the air flow path for openable part 4 "
							help="Enter the height from the lowest finished floor of the dwelling to the midpoint of the air flow path through this part of the window when fully open"
							name="midHeightOpenablePart4"
							:validation="zodTypeAsFormKitValidation(midHeightAirFlowPathZod)"
						/>
					</template>
				</template>
			</template>
		</template>
		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
		<h2 class="govuk-heading-l no-bottom-padding">Window shading</h2>
		<p class="govuk-body guidance_link">
			<a href="/guidance/window-shading-guidance" target="_blank" class="govuk-link">
				Guidance on window shading (opens in another window)
			</a>
		</p>
		<FormKit
			id="hasShading"
			type="govBoolean"
			label="Does anything shade the window?"
			name="hasShading"
			validation="required"
		/>
		<ShadingSection
			v-if="model?.hasShading"
			:index="index"
			:model="shading"
			shading-section-type="window"
			:write-shading-to-store="writeShadingToStore"
		/>

		<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

		<h2 class="govuk-heading-l">Curtains and blinds</h2>
		<FormKit
			id="curtainsOrBlinds"
			type="govBoolean"
			label="Does this window have any curtains or blinds?"
			name="curtainsOrBlinds"
			validation="required"
		/>
		<WindowTreatmentSection
			v-if="model && model.curtainsOrBlinds"
			treatment-section-type="window"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingSpaceWindows')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
<style scoped lang="scss">
	.guidance_link {
		margin-bottom: 30px;
	}
	.no-bottom-padding {
		margin-bottom: 10px;
	}
	.gov-radios-add-links {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>