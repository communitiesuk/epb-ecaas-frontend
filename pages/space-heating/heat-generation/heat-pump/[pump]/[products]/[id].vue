<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import type { ProductForTechnology } from "~/pcdb/clients/client.types";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const heatPumpType = kebabToCamelCase(params.products as string) as HeatPumpType;

if (!(heatPumpType in pcdbTechnologyTypes)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const technologyType = pcdbTechnologyTypes[heatPumpType];
const pageId = `${heatPumpType}Products` as PageId;
const productType = `${heatPumpTypes[heatPumpType]} heat pumps`;

const index = Number(params.pump);

const { data: { value: data } } = await useFetch<ProductForTechnology<typeof technologyType>>(`/api/products/${params.id}/details`, {
	query: {
		technologyType,
	},
});

const backUrl = getUrl(pageId)
	.replace(":pump", params.pump as string);

const tableData: Record<string, string> = 
{
	"Source type": data?.sourceType ? displayCamelToSentenceCase(data.sourceType) : "-",
	"Backup control type": data?.backupCtrlType ?? "-",
	"Standard rating capacity 20c": data?.standardRatingCapacity20C ? `${data.standardRatingCapacity20C} kW` : "-",
	...(data?.minimumModulationRate35 ? { "Minimum modulation rate": data?.minimumModulationRate35?.toString() } : {}),
	...(data?.minimumModulationRate ? { "Minimum modulation rate": data?.minimumModulationRate?.toString() } : {}),
	"Temp return feed max": data?.tempReturnFeedMax?.toString() ?? "-",
	"Min temp diff flow return for hp to operate": data?.minTempDiffFlowReturnForHpToOperate?.toString() ?? "-",
	...(data?.powerHeatingWarmAirFan ? { "Power heating warm air fan": data?.powerHeatingWarmAirFan?.toString() } : {}),
	"Power standby": data?.powerStandby !== undefined ? `${data.powerStandby} kW` : "-",
	"Power off": data?.powerOff !== undefined ? `${data.powerOff} kW` : "-",
	"Sink type": data?.sinkType ?? "-",
	"Modulating control": displayBoolean(data?.modulatingControl),
	"Standard rating capacity 35c": data?.standardRatingCapacity35C ? `${data.standardRatingCapacity35C} kW` : "-",
	"Time constant on/off rate": data?.timeConstantOnoffOperation?.toString() ?? "-",
	"Temp lower operating limit": data?.tempLowerOperatingLimit?.toString() ?? "-",
	"Var flow temp control during test": displayBoolean(data?.varFlowTempCtrlDuringTest),
	"Power source circ pump": data?.powerSourceCircPump?.toString() ?? "-",
	"Power heating circ pump": data?.powerHeatingCircPump?.toString() ?? "-",
	"Power crankcase heater": data?.powerCrankcaseHeater !== undefined ? `${data.powerCrankcaseHeater} kW` : "-",
	"Power max backup": data?.powerMaximumBackup !== undefined ? `${data.powerMaximumBackup} kW` : "-",
};

const selectProduct = () => {
	store.$patch((state) => {
		state.spaceHeating.heatGeneration.heatPump.data[index]!.data.productReference = data?.id;
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

	<ProductDetails :data="tableData" />

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