<script setup lang="ts">
import { displayCamelToSentenceCase } from "#imports";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const pageId = kebabToCamelCase(params.products as string);
const index = Number(params.pump);

const { data } = await useFetch(`/api/products/${params.id}/details`, {
	query: {
		technologyType: pcdbTechnologyTypes[pageId as keyof typeof pcdbTechnologyTypes],
	},
});

const backUrl = getUrl("airSourceProducts")
	.replace(":pump", params.pump as string)
	.replace(":products", params.products as string);

const productType = pcdbTechnologyTypes[pageId as HeatPumpType];

const selectProduct = () => {
	store.$patch((state) => {
		state.spaceHeating.heatGeneration.heatPump.data[index]!.data.productReference = data.value?.id;
	});

	navigateTo(getUrl("heatPump").replace(":pump", `${index}`));
};
</script>

<template>
	<Head>
		<Title>{{ data?.modelName }}</Title>
	</Head>

	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${productType}` : 'Back' }}
	</NuxtLink>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ data?.modelName }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ data?.brandName }}</h2>

	<div class="product-table-container">
		<table class="govuk-table">
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Source type</th>
					<td class="govuk-table__cell">{{ data?.sourceType ? displayCamelToSentenceCase(data.sourceType) : '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Backup control type</th>
					<td class="govuk-table__cell">{{ data?.backupControlType ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Standard rating capacity 20c</th>
					<td class="govuk-table__cell">{{ data?.standardRatingCapacity35C ? `${data.standardRatingCapacity35C} kW` : '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Minimum modulation rate</th>
					<td class="govuk-table__cell">{{ data?.minimumModulationRate35 ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Temp return feed max</th>
					<td class="govuk-table__cell">{{ data?.tempReturnFeedMax ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Min temp diff flow return for hp to operate</th>
					<td class="govuk-table__cell">{{ data?.minTempDiffFlowReturnForHpToOperate ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Power heating warm air fan</th>
					<td class="govuk-table__cell">{{ data?.powerHeatingWarmAirFan ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Power standby</th>
					<td class="govuk-table__cell">{{ data?.powerStandby ? `${data.powerStandby} kW` : '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Power off</th>
					<td class="govuk-table__cell">{{ data?.powerOff ? `${data.powerOff} kW` : '-' }}</td>
				</tr>
			</tbody>
		</table>

		<table class="govuk-table">
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Sink type</th>
					<td class="govuk-table__cell">{{ data?.sinkType ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Modulating control</th>
					<td class="govuk-table__cell">{{ data?.modulatingControl ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Standard rating capacity 35c</th>
					<td class="govuk-table__cell">{{ data?.standardRatingCapacity35C ? `${data.standardRatingCapacity35C} kW` : '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Time constant on/off rate</th>
					<td class="govuk-table__cell">{{ data?.timeConstantOnOffOperation ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Temp lower operating limit</th>
					<td class="govuk-table__cell">{{ data?.tempLowerOperatingLimit ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Var flow temp control during test</th>
					<td class="govuk-table__cell">{{ data?.varFlowTempCtrlDuringTest ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Power source circ pump</th>
					<td class="govuk-table__cell">{{ data?.powerSourceCircPump ?? '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Power crankcase heater</th>
					<td class="govuk-table__cell">{{ data?.powerCrankcaseHeater ? `${data.powerCrankcaseHeater} kW` : '-' }}</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Power max backup</th>
					<td class="govuk-table__cell">{{ data?.powerMaximumBackup ? `${data.powerMaximumBackup} kW` : '-' }}</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="govuk-button-group">
		<GovButton
			test-id="backToHeatPumpButton"
			@click="selectProduct"
		>
			Select {{ productType }}
		</GovButton>
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHeatPumpButton"
			@click="router.back()"
		>
			Back to {{ productType }}
		</GovButton>
	</div>
</template>

<style lang="scss" scoped>
	.product-table-container {
		margin: 25px 0;
		display: flex;
		gap: 50px;
	}

	.govuk-table__header {
		width: 50%;
	}
</style>