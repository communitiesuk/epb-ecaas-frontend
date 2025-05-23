<script setup lang="ts">
import { OnSiteGenerationVentilationStrategy } from '~/schema/api-schema.types';

const title = "Photovoltaic (PV)";
const store = useEcaasStore();
const { saveToList } = useForm();

const pvSystemData = useItemToEdit(
	"system",
	store.pvAndBatteries.pvSystem.data
);
const model: Ref<PvSystemData> = ref(pvSystemData!);

const ventilationStrategyOptions: EnumRecord<OnSiteGenerationVentilationStrategy, string> = {
	[OnSiteGenerationVentilationStrategy.unventilated]: 'Unventilated',
	[OnSiteGenerationVentilationStrategy.moderately_ventilated]: 'Moderately ventilated',
	[OnSiteGenerationVentilationStrategy.strongly_or_forced_ventilated]: 'Strongly or forced ventilated',
	[OnSiteGenerationVentilationStrategy.rear_surface_free]: 'Rear surface free',
};

const saveForm = (fields: PvSystemData) => {
	store.$patch((state) => {
		const { pvSystem } = state.pvAndBatteries;

		const pvSystemItem: PvSystemData = {
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
			inverterIsInside: fields.inverterIsInside,
			inverterType: fields.inverterType,
			aboveDepth: fields.aboveDepth,
			aboveDistance: fields.aboveDistance,
			leftDepth: fields.leftDepth,
			leftDistance: fields.leftDistance,
			rightDepth: fields.rightDepth,
			rightDistance: fields.rightDistance,
		};

		saveToList(pvSystemItem, pvSystem);
		pvSystem.complete = false;
	});

	navigateTo("/pv-and-batteries");
};

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
			help="Provide a name to this PV so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="peakPower"
			type="govInputWithSuffix"
			label="Peak power"
			help="The maximum power output the photovoltaic system can generate under ideal conditions"
			name="peakPower"
			validation="required | number | min:0.001 | max: 100"
			suffix-text="kW"
		/>
		<FormKit
			id="ventilationStrategy"
			type="govRadios"
			:options="ventilationStrategyOptions"
			label="Ventilation strategy"
			name="ventilationStrategy"
			validation="required"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header">
								Ventilation strategy
							</th>
							<th scope="col" class="govuk-table__header">Explanation</th>
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
			help="The tilt angle (inclination) of the PV panel from horizontal measured upwards facing, 0 to 90, in degrees. 0 = horizontal surface, 90 = vertical surface."
			name="pitch"
			validation="required | number | min:0 | max: 90"
			suffix-text="degrees"
		/>
		<FieldsOrientation />
		<FormKit
			id="elevationalHeight"
			type="govInputWithSuffix"
			label="Elevational height of PV element at its base"
			help="Distance between the ground and the lowest edge of the PV"
			name="elevationalHeight"
			validation="required | number | min:0 | max: 500"
			suffix-text="m"
		/>
		<FormKit
			id="lengthOfPV"
			type="govInputWithSuffix"
			label="Length of PV"
			help="Length x width provides area"
			name="lengthOfPV"
			validation="required | number | min:0 | max: 100"
			suffix-text="m"
		/>
		<FormKit
			id="widthOfPV"
			type="govInputWithSuffix"
			label="Width of PV"
			help="Width x width provides area"
			name="widthOfPV"
			validation="required | number | min:0 | max: 100"
			suffix-text="m"
		/>
		<FormKit
			id="inverterPeakPowerAC"
			type="govInputWithSuffix"
			label="Inverter peak power AC"
			help="The maximum power output the inverter can provide on the AC side"
			name="inverterPeakPowerAC"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit
			id="inverterPeakPowerDC"
			type="govInputWithSuffix"
			label="Inverter peak power DC"
			help="The maximum power input the inverter can handle on the DC side"
			name="inverterPeakPowerDC"
			validation="required | number"
			suffix-text="kW"
		/>
		<FormKit
			id="inverterIsInside"
			type="govBoolean"
			true-label="Inside"
			false-label="Outside"
			label="Inverter location"
			help="Is the inverter inside the thermal envelope of the dwelling"
			name="inverterIsInside"
			validation="required"
		/>
		<FormKit
			id="inverterType"
			type="govRadios"
			:options="{
				central: 'Central inverter',
				micro: 'Micro inverter',
			}"
			label="Inverter type"
			name="inverterType"
			validation="required"
		/>
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
							id="aboveDepth" type="govInputWithSuffix" suffix-text="m" name="aboveDepth"
							validation="number0" />
					</td>
					<td>
						<FormKit
							id="aboveDistance" type="govInputWithSuffix" suffix-text="m" name="aboveDistance"
							validation="number0" />
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Left</th>
					<td>
						<FormKit
							id="leftDepth" type="govInputWithSuffix" suffix-text="m" name="leftDepth"
							validation="number0" />
					</td>
					<td>
						<FormKit
							id="leftDistance" type="govInputWithSuffix" suffix-text="m" name="leftDistance"
							validation="number0" />
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-!-text-align-left">Right</th>
					<td>
						<FormKit
							id="rightDepth" type="govInputWithSuffix" suffix-text="m" name="rightDepth"
							validation="number0" />
					</td>
					<td>
						<FormKit
							id="rightDistance" type="govInputWithSuffix" suffix-text="m" name="rightDistance"
							validation="number0" />
					</td>
				</tr>
			</tbody>
		</table>

		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>

