<script setup lang="ts">
import HeatEmitterProductDetailsPage from "~/components/HeatEmitterProductDetailsPage.vue";
import type { PageId } from "~/data/pages/pages";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import type { HeatEmittingProductType, PcdbProduct } from "~/stores/ecaasStore.schema";
import { heatEmittingProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params, query } = useRoute();

const heatEmittingType = kebabToCamelCase(params.products as string);

if (!(heatEmittingType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${heatEmittingType}Products` as PageId;
const productType = heatEmittingProductTypesDisplay[heatEmittingType as HeatEmittingProductType];

const data = await useProductDetails(params.id as string);

const backUrl = getUrl(pageId)
	.replace(":heatEmitter", params.heatEmitter as string);

const selectProduct = () => {
	const index = Number(params.heatEmitter);
	const emitterIndex = query.emitterIndex != null ? Number(query.emitterIndex) : null;

	store.$patch((state) => {
		const selectedReference = String(params.id);
		const item = state.spaceHeating.heatEmitters.data[index];

		if (item && data && emitterIndex != null) {
			const emitters = (item.data as { emitters: Record<string, unknown>[] }).emitters;
			const emitter = emitters[emitterIndex];
			if (emitter) {
				emitter.productReference = selectedReference;
			}
		} else if (item && data) {
			const product = item.data as PcdbProduct;
			product.productReference = selectedReference;
		}
	});

	const returnUrl = emitterIndex != null
		? `${getUrl("heatEmitters").replace(":heatEmitter", `${index}`)}?emitterIndex=${emitterIndex}`
		: getUrl("heatEmitters").replace(":heatEmitter", `${index}`);

	navigateTo(returnUrl);
};
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<HeatEmitterProductDetailsPage :product="(data as AnyPcdbProduct)" :heat-emitting-type="heatEmittingType" />

	<div class="govuk-button-group">
		<GovButton
			test-id="selectProductButton"
			@click="selectProduct"
		>
			Select {{ productType && sentenceToLowerCase(productType(false)) }}
		</GovButton>
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHeatPumpButton"
			@click="router.back()"
		>
			Back to {{ productType && sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>