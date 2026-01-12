<script setup lang="ts">
import type { ProductForTechnology } from "~/pcdb/clients/client.types";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const index = Number(params.pump);

const { data: { value: data } } = await useFetch<ProductForTechnology<"AirSourceHeatPump">>(`/api/products/${params.id}/details`, {
	query: {
		technologyType: pcdbTechnologyTypes.airSource,
	},
});

const backUrl = getUrl("airSourceProducts")
	.replace(":pump", params.pump as string);

const productType = `${heatPumpTypes.airSource.toLowerCase()} heat pumps`;

const tableData: Record<string, string> = 
{
	"Source type": data?.sourceType ? displayCamelToSentenceCase(data.sourceType) : "-",
	"Backup control type": data?.backupCtrlType ?? "-",
	"Standard rating capacity 20c": data?.standardRatingCapacity20C ? `${data.standardRatingCapacity20C} kW` : "-",
	"Minimum modulation rate": data?.minimumModulationRate35?.toString() ?? "-",
	"Temp return feed max": data?.tempReturnFeedMax?.toString() ?? "-",
	"Min temp diff flow return for hp to operate": data?.minTempDiffFlowReturnForHpToOperate?.toString() ?? "-",
	"Power heating warm air fan": data?.powerHeatingWarmAirFan?.toString() ?? "-",
	"Power standby": data?.powerStandby ? `${data.powerStandby} kW` : "-",
	"Power off": data?.powerOff ? `${data.powerOff} kW` : "-",
	"Sink type": data?.sinkType ?? "-",
	"Modulating control": displayBoolean(data?.modulatingControl),
	"Standard rating capacity 35c": data?.standardRatingCapacity35C ? `${data.standardRatingCapacity35C} kW` : "-",
	"Time constant on/off rate": data?.timeConstantOnOffOperation?.toString() ?? "-",
	"Temp lower operating limit": data?.tempLowerOperatingLimit?.toString() ?? "-",
	"Var flow temp control during test": displayBoolean(data?.varFlowTempCtrlDuringTest),
	"Power source circ pump": data?.powerSourceCircPump?.toString() ?? "-",
	"Power crankcase heater": data?.powerCrankcaseHeater ? `${data.powerCrankcaseHeater} kW` : "-",
	"Power max backup": data?.powerMaximumBackup ? `${data.powerMaximumBackup} kW` : "-",
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