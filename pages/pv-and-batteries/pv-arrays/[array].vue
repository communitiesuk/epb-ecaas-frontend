<script setup lang="ts">
import type { OnSiteGenerationVentilationStrategy, SchemaInverterType } from "~/schema/aliases";
import { getUrl, uniqueName } from "#imports";

const title = "PV array";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const pvArraysStoreData = store.pvAndBatteries.pvArrays.data;
const index = getStoreIndex(pvArraysStoreData);
const PvArrayData = useItemToEdit("array", pvArraysStoreData);
const model = ref(PvArrayData?.data);

const shadingSectionDisabled = true;

const ventilationStrategyOptions: Record<OnSiteGenerationVentilationStrategy, string> = {
	unventilated: "Unventilated",
	moderately_ventilated: "Moderately ventilated",
	strongly_or_forced_ventilated: "Strongly or forced ventilated",
	rear_surface_free: "Rear surface free",
};

const inverterTypeOptions: Record<SchemaInverterType, string> = {
	optimised_inverter: "Optimised",
	string_inverter: "String",
};

const inverterLocationOptions: Record<string, string> = {
	heated_space: "Heated space",
	unheated_space: "Unheated space",
};

const electricityPriorityOptions: Record<string, string> = {
	diverter: "Diverter",
	electricBattery: "Electric battery",
};


const saveForm = (fields: PvArrayData) => {
	store.$patch((state) => {
		const { pvArrays } = state.pvAndBatteries;

		pvArrays.data[index] = {
			data: {
				name: fields.name,
				peakPower: fields.peakPower,
				ventilationStrategy: fields.ventilationStrategy,
				pitch: fields.pitch,
				orientation: fields.orientation,
				elevationalHeight: fields.elevationalHeight,
				lengthOfPV: fields.lengthOfPV,
				widthOfPV: fields.widthOfPV,
				inverterPeakPowerAC: fields.inverterPeakPowerAC,
				inverterPeakPowerDC: fields.inverterPeakPowerDC,
				locationOfInverter: fields.locationOfInverter,
				canExportToGrid: fields.canExportToGrid,
				electricityPriority: fields.electricityPriority,
				inverterType: fields.inverterType,
				aboveDepth: fields.aboveDepth,
				aboveDistance: fields.aboveDistance,
				leftDepth: fields.leftDepth,
				leftDistance: fields.leftDistance,
				rightDepth: fields.rightDepth,
				rightDistance: fields.rightDistance,
			},
			complete: true,
		};
		pvArrays.complete = false;
	});

	navigateTo("/pv-and-batteries");
};

autoSaveElementForm<PvArrayData>({
	model,
	storeData: store.pvAndBatteries.pvArrays,
	defaultName: "PV array",
	onPatch: (state, newData, index) => {
		state.pvAndBatteries.pvArrays.data[index] = newData;
		state.pvAndBatteries.pvArrays.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary
			:error-list="errorMessages"
			test-id="photovoltaicErrorSummary"
		/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name so this PV array can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(pvArraysStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="peakPower"
			type="govInputWithSuffix"
			label="Peak power"
			help="Enter the maximum power output the photovoltaic system can generate under ideal conditions"
			name="peakPower"
			validation="required | number | min:0.001 | max: 100"
			suffix-text="kWp"
		>
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">
								Home type
							</th>
							<th scope="col" class="govuk-table__header">Typical peak power</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Small flat</td>
							<td class="govuk-table__cell">
								0.5 - 1.5 kWp
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Terraced house</td>
							<td class="govuk-table__cell">
								1.5 - 2.5 kWp
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Semi-detached house</td>
							<td class="govuk-table__cell">
								2 - 3.5 kWp
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Detached house</td>
							<td class="govuk-table__cell">
								4 - 6 kWp
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="ventilationStrategy"
			type="govRadios"
			:options="ventilationStrategyOptions"
			label="Ventilation strategy"
			name="ventilationStrategy"
			validation="required"
		>
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">
								Ventilation strategy
							</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Unventilated</td>
							<td class="govuk-table__cell">
								The PV module is installed without airflow behind it, leading to
								higher operating temperatures and reduced efficiency. Suitable
								for building-integrated systems (e.g., PV panels embedded in
								roofs or facades).
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Moderately ventilated</td>
							<td class="govuk-table__cell">
								Limited airflow is present behind the PV module, allowing some
								cooling but still leading to moderate temperature increases.
								Common in rooftop installations with a small gap between the
								panel and the surface.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Strongly or forced ventilated</td>
							<td class="govuk-table__cell">
								Active airflow (natural or mechanical) is used to cool the PV
								module, reducing temperature and improving efficiency. Often
								used in large-scale solar farms or setups with cooling fans.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Rear surface free</td>
							<td class="govuk-table__cell">
								The back of the PV module is completely open to airflow,
								maximising natural cooling. Typically seen in ground-mounted
								systems or open-rack installations.
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="pitch"
			type="govInputWithSuffix"
			label="Pitch"
			help="Enter the tilt angle, or inclination, of the PV array from horizontal measured upwards facing, where 0° is a horizontal surface and 90° is a vertical surface"
			name="pitch"
			validation="required | number | min:0 | max: 90"
			suffix-text="°"
		/>
		<FieldsOrientation details-caption="To define the orientation of the PV array, measure the angle of the panel clockwise from true North, accurate to the nearest degree. If the panel is facing true north then the orientation is 0°. If the panel is facing south then the orientation is 180°." cleared-non-llm />
		<FormKit
			id="elevationalHeight"
			type="govInputWithSuffix"
			label="Elevational height of PV array at its base"
			help="Enter the distance between the ground and the lowest edge of the PV"
			name="elevationalHeight"
			validation="required | number | min:0 | max: 500"
			suffix-text="m"
		/>
		<FormKit
			id="lengthOfPV"
			type="govInputWithSuffix"
			label="Length of PV array"
			help="Enter the length of the PV array so the area can be calculated"
			name="lengthOfPV"
			validation="required | number | min:0 | max: 100"
			suffix-text="m"
		/>
		<FormKit
			id="widthOfPV"
			type="govInputWithSuffix"
			label="Width of PV array"
			help="Enter the width of the PV array so the area can be calculated"
			name="widthOfPV"
			validation="required | number | min:0 | max: 100"
			suffix-text="m"
		/>
		<FormKit
			id="inverterPeakPowerAC"
			type="govInputWithSuffix"
			label="Inverter peak power AC"
			help="Enter the maximum amount of alternating current (AC) power the inverter can output at a given time under ideal conditions"
			name="inverterPeakPowerAC"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit
			id="inverterPeakPowerDC"
			type="govInputWithSuffix"
			label="Inverter peak power DC"
			help="Enter the maximum amount of direct current (DC) power the inverter can handle from the solar panel array"
			name="inverterPeakPowerDC"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit
			id="locationOfInverter"
			type="govRadios"
			:options="inverterLocationOptions"
			label="Location of inverter"
			name="locationOfInverter"
			validation="required"
		/>

		<FormKit
			id="canExportToGrid"
			type="govBoolean"
			label="Can the electricity be exported to the grid?"
			name="canExportToGrid"
			validation="required"
		/>

		<FormKit
			id="electricityPriority"
			type="govRadios"
			:options="electricityPriorityOptions"
			label="What is the priority for generated electricity?"
			name="electricityPriority"
			validation="required"
		/>

		<FormKit
			id="inverterType"
			type="govRadios"
			:options="inverterTypeOptions"
			label="Inverter type"
			name="inverterType"
			validation="required">
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">Inverter type</th>
							<th scope="col" class="govuk-table__header">Description</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">String</td>
							<td class="govuk-table__cell">
								String inverters are the traditional and most common type of inverter. They connect a series of solar panels together.
							</td>
						</tr>
						<tr class="govuk-table__row">
							<td class="govuk-table__cell">Optimised</td>
							<td class="govuk-table__cell">
								Optimised inverters are string inverters with DC optimisers, which are mounted on the back of the solar panel.
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<template v-if="!shadingSectionDisabled">
			<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
			<h2 class="govuk-heading-l">PV shading</h2>
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr class="govuk-table__row">
						<td colspan="3" class="govuk-!-text-align-left">This refers to objects on the roof which might cause shading to the PV.</td>
					</tr>
					<tr class="govuk-table__row">
						<td colspan="3" class="govuk-!-text-align-left govuk-!-font-weight-bold govuk-!-padding-bottom-5" >This is not distant shading objects such as trees or buildings</td>
					</tr>		
					<tr class="govuk-table__row">
						<th scope="col" class="govuk-!-text-align-left">Shading direction</th>
						<th scope="col" class="govuk-!-text-align-left">Depth</th>
						<th scope="col" class="govuk-!-text-align-left">Distance</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-!-text-align-left">Above</th>
						<td>
							<FormKit
								id="aboveDepth"
								type="govInputWithSuffix"
								suffix-text="m"
								name="aboveDepth"
								validation="number0" />
						</td>
						<td>
							<FormKit
								id="aboveDistance"
								type="govInputWithSuffix"
								suffix-text="m"
								name="aboveDistance"
								validation="number0" />
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-!-text-align-left">Left</th>
						<td>
							<FormKit
								id="leftDepth"
								type="govInputWithSuffix"
								suffix-text="m"
								name="leftDepth"
								validation="number0" />
						</td>
						<td>
							<FormKit
								id="leftDistance"
								type="govInputWithSuffix"
								suffix-text="m"
								name="leftDistance"
								validation="number0" />
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-!-text-align-left">Right</th>
						<td>
							<FormKit
								id="rightDepth"
								type="govInputWithSuffix"
								suffix-text="m"
								name="rightDepth"
								validation="number0" />
						</td>
						<td>
							<FormKit
								id="rightDistance"
								type="govInputWithSuffix"
								suffix-text="m"
								name="rightDistance"
								validation="number0" />
						</td>
					</tr>
				</tbody>
			</table>
		</template>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('pvAndBatteries')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>

