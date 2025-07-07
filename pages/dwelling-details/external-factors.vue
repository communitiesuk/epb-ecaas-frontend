<script setup lang="ts">
import type { TerrainClass, VentilationShieldClass } from '~/schema/api-schema.types';

const title = "External factors";
const store = useEcaasStore();

const model = ref({
	...store.dwellingDetails.externalFactors.data
});

const typeOfExposureOptions: Record<VentilationShieldClass, SnakeToSentenceCase<VentilationShieldClass>> = {
	Open: "Open",
	Normal: "Normal",
	Shielded: "Shielded"
};
const terrainTypeOptions: Record<TerrainClass, PascalToSentenceCase<TerrainClass>> = {
	OpenWater: "Open water",
	OpenField: "Open field",
	Suburban: "Suburban",
	Urban: "Urban"
};

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingDetails: {
			externalFactors: {
				data: {
					altitude: fields.altitude,
					typeOfExposure: fields.typeOfExposure,
					terrainType: fields.terrainType,
					noiseNuisance: fields.noiseNuisance
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-details");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm" @submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="externalFactorsErrorSummary"/>
		<FormKit
			id="altitude"
			type="govInputWithSuffix"
			label="Altitude"
			name="altitude"
			suffix-text="m"
			validation="required | number | min:-150 | max:7200"
			help="Enter the number of metres the dwelling is above sea level.">
			<GovDetails summary-text="Help with this input">
				<p>There are free online tools which can help estimate this.</p>
			</GovDetails>
		</FormKit>

		<FormKit
			id="typeOfExposure"
			type="govRadios"
			:options="typeOfExposureOptions"
			label="Type of exposure"
			name="typeOfExposure"
			validation="required"
			help="This is the level of shielding a dwelling has against external environmental factors such as wind, noise or outdoor pollutants.">
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr>
							<th scope="col" class="govuk-table__header">Option</th>
							<th scope="col" class="govuk-table__header">Description</th>
							<th scope="col" class="govuk-table__header">Examples</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Open</th>
							<td class="govuk-table__cell">Highly exposed location with minimal natural or artificial barriers.</td>
							<td class="govuk-table__cell">
								<ul>
									<li>Rural house in open land</li>
									<li>Coastal home</li>
									<li>Building next to open field or park</li>
								</ul>
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Normal</th>
							<td class="govuk-table__cell">Typical suburban or urban setting with average levels of protection.</td>
							<td class="govuk-table__cell">
								<ul>
									<li>Residential neighbourhood with some trees/buildings</li>
									<li>City apartment off main roads</li>
								</ul>
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Shielded</th>
							<td class="govuk-table__cell">Well protected by dense surroundings like trees, hills, or buildings.</td>
							<td class="govuk-table__cell">
								<ul>
									<li>House in a forest</li>
									<li>Building surrounded by taller structures</li>
									<li>Courtyard setting</li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="terrainType"
			type="govRadios"
			:options="terrainTypeOptions"
			label="Terrain Type"
			name="terrainType"
			validation="required"
			help="This is the type of surrounding landscape.">
			<GovDetails summary-text="Help with this input">
				<p>Terrain class helps determine how external conditions, such as wind speed and turbulence, will impact ventilation and airflow around a building.</p>
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr>
							<th scope="col" class="govuk-table__header">Option</th>
							<th scope="col" class="govuk-table__header">Description</th>
							<th scope="col" class="govuk-table__header">Examples</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Open water</th>
							<td class="govuk-table__cell">Large, flat surface of water with no obstructions to airflow.</td>
							<td class="govuk-table__cell">
								<ul>
									<li>Coastal areas</li>
									<li>Lakeside or riverside properties</li>
									<li>Offshore buildings</li>
								</ul>
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Open field</th>
							<td class="govuk-table__cell">Flat, unobstructed land with little to no buildings or trees.</td>
							<td class="govuk-table__cell">
								<ul>
									<li>Farmland</li>
									<li>Grasslands</li>
									<li>Airfields</li>
								</ul>
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Suburban</th>
							<td class="govuk-table__cell">Mixed development with houses, gardens, and moderate vegetation.</td>
							<td class="govuk-table__cell">
								<ul>
									<li>Residential neighbourhoods with spaced housing</li>
									<li>Tree-lined streets</li>
								</ul>
							</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Urban</th>
							<td class="govuk-table__cell">Dense development with closely packed buildings and limited vegetation.</td>
							<td class="govuk-table__cell">
								<ul>
									<li>City centres</li>
									<li>Business districts</li>
									<li>High-rise residential zones</li>
								</ul>
							</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="noiseNuisance"
			type="govBoolean"
			label="Noise nuisance"
			name="noiseNuisance"
			validation="required"
			help="Is there environmental noise from the surrounding area, which can influence whether occupants keep windows closed?"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
