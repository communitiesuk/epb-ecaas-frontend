<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { emitterFloorAreaZod, lengthRadiatorZod, productCountZod, type WetDistributionEmitterData } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";
import type { ConvectorRadiatorProduct, Product } from "~/pcdb/pcdb.types";
import { isConvectorRadiatorProduct } from "~/utils/convectorRadiator";

const route = useRoute();
const router = useRouter();

const clearEmitterIndexFromUrl = () => {
	router.replace({ query: { ...route.query, emitterIndex: undefined } });
};

const emitterTypeOptions = {
	radiator: "Radiator",
	underfloorHeating: "Underfloor heating",
	fanCoil: "Fan coil",
} as const;
// boolean for switch for underfloor heating feature
const useUnderfloorHeating: boolean = false;

const { underfloorHeating, ...others } = emitterTypeOptions;
const heatEmitterTypes = useUnderfloorHeating ? emitterTypeOptions : others;
type EmitterType = keyof typeof emitterTypeOptions;

const props = defineProps<{
	index: number;
}>();

const store = useEcaasStore();

const emitters = computed(() => {
	const heatEmitter = store.spaceHeating.heatEmitters.data[props.index];
	if (heatEmitter && "emitters" in heatEmitter.data) {
		return (heatEmitter.data as { emitters: (Partial<WetDistributionEmitterData> & { id: string })[] }).emitters;
	}
	return [];
});

const formModel = ref<Record<string, unknown>>({});
const editIndex = ref<number | null>(null);
const addingEmitterIndex = ref<number | null>(null);
const isEditing = computed(() => editIndex.value !== null);
const showAddForm = ref(false);
const emitterCards = ref<HTMLElement[]>([]);

const queryEmitterIndex = route.query.emitterIndex != null ? Number(route.query.emitterIndex) : null;
if (queryEmitterIndex != null && emitters.value[queryEmitterIndex]) {
	editIndex.value = queryEmitterIndex;
	formModel.value = { ...emitters.value[queryEmitterIndex] };
}

onMounted(() => {
	if (queryEmitterIndex != null && emitterCards.value[queryEmitterIndex]) {
		emitterCards.value[queryEmitterIndex].scrollIntoView({ behavior: "instant", block: "start" });
	}
});

const productDetails = ref<Record<string, string[]>>({});

const fetchProductName = async (productReference: string) => {
	if (productDetails.value[productReference]) return;
	const { data: product } = await useFetch<Product | ConvectorRadiatorProduct>(`/api/products/${productReference}`);
	if (!product.value) {
		return;
	}

	if ("modelName" in product.value && product.value.modelName) {
		productDetails.value[productReference] = [
			"brandName" in product.value ? product.value.brandName : undefined,
			product.value.modelName,
			"modelQualifier" in product.value ? product.value.modelQualifier : undefined,
		].filter(Boolean) as string[];
		return;
	}

	if (isConvectorRadiatorProduct(product.value) && product.value.type) {
		const heightText = product.value.height != null ? `${product.value.height} mm` : undefined;
		productDetails.value[productReference] = [product.value.type, heightText].filter(Boolean) as string[];
	}
};

watch(
	emitters,
	(list) => {
		list.forEach((emitter) => {
			if (emitter.productReference) {
				fetchProductName(emitter.productReference);
			}
		});
	},
	{ immediate: true },
);

const emitterSummaryData = (emitter: Partial<WetDistributionEmitterData> & { id: string }) => {
	const { typeOfHeatEmitter, productReference } = emitter;
	const typeName = typeOfHeatEmitter ? emitterTypeOptions[typeOfHeatEmitter] : undefined;
	const product = productReference ? productDetails.value[productReference] : undefined;

	switch (typeOfHeatEmitter) {
		case "radiator":
			return {
				"Type of emitter": typeName,
				"Radiator product": product,
				"Length": (emitter as { length?: number }).length != null ? `${(emitter as { length: number }).length} m` : undefined,
				"Number of radiators": (emitter as { numOfRadiators?: number }).numOfRadiators,
			};
		case "fanCoil":
			return {
				"Type of emitter": typeName,
				"Fan coil product": product,
				"Number of fan coils": (emitter as { numOfFanCoils?: number }).numOfFanCoils,
			};
		case "underfloorHeating":
			return {
				"Type of emitter": typeName,
				"Underfloor heating product": product,
				"Area of underfloor heating": (emitter as { areaOfUnderfloorHeating?: number }).areaOfUnderfloorHeating != null ? `${(emitter as { areaOfUnderfloorHeating: number }).areaOfUnderfloorHeating} m²` : undefined,
			};
		default:
			return {
				"Type of emitter": typeName,
			};
	}
};

const addEmitter = (type: unknown) => {
	const id = uuidv4();
	const newEmitter = {
		id,
		typeOfHeatEmitter: type,
		name: emitterTypeOptions[type as EmitterType] ?? type,
	};

	store.$patch((state) => {
		const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
		if (heatEmitter && "emitters" in heatEmitter.data) {
			(heatEmitter.data as { emitters: unknown[] }).emitters.push(newEmitter);
			heatEmitter.complete = false;
		}
	});

	showAddForm.value = false;
	const newIndex = emitters.value.length - 1;
	addingEmitterIndex.value = newIndex;
	editIndex.value = newIndex;
	formModel.value = { ...emitters.value[newIndex]! };
	clearEmitterIndexFromUrl();
};

const removeEmitter = (emitterIndex: number) => {
	store.$patch((state) => {
		const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
		if (heatEmitter && "emitters" in heatEmitter.data) {
			(heatEmitter.data as { emitters: unknown[] }).emitters.splice(emitterIndex, 1);
		}
		heatEmitter!.complete = false;
	});
	if (editIndex.value === emitterIndex) {
		editIndex.value = null;
		formModel.value = {};
	}
	if (addingEmitterIndex.value === emitterIndex) {
		addingEmitterIndex.value = null;
	}
};

const startEdit = (emitterIndex: number) => {
	addingEmitterIndex.value = null;
	editIndex.value = emitterIndex;
	formModel.value = { ...emitters.value[emitterIndex]! };
	clearEmitterIndexFromUrl();
	store.$patch((state) => {
		const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
		if (heatEmitter) {
			heatEmitter.complete = false;
		}
	});
};

const cancelEdit = () => {
	clearEmitterIndexFromUrl();
	if (editIndex.value !== null && addingEmitterIndex.value === editIndex.value) {
		removeEmitter(editIndex.value);
		return;
	}
	addingEmitterIndex.value = null;
	editIndex.value = null;
	formModel.value = {};
};

const isAddEmitterCard = (emitterIndex: number) => addingEmitterIndex.value === emitterIndex;

watch(
	() => formModel.value.typeOfHeatEmitter,
	(newType, oldType) => {
		if (oldType && newType !== oldType) {
			const { id, name } = formModel.value;
			formModel.value = { id, name, typeOfHeatEmitter: newType };
		}
	},
);

watch(
	formModel,
	(newData) => {
		if (editIndex.value === null) return;
		const emitterIndex = editIndex.value;

		store.$patch((state) => {
			const heatEmitter = state.spaceHeating.heatEmitters.data[props.index];
			if (heatEmitter && "emitters" in heatEmitter.data) {
				const emittersList = (heatEmitter.data as { emitters: Record<string, unknown>[] }).emitters;
				if (emittersList[emitterIndex]) {
					emittersList[emitterIndex] = { ...newData };
				}
			}
		});
	},
	{ deep: true },
);

const saveEmitter = () => {
	addingEmitterIndex.value = null;
	editIndex.value = null;
	formModel.value = {};
	clearEmitterIndexFromUrl();
};
</script>

<template>
	<div data-testid="emittersSection">
		<h2 class="govuk-heading-l">Emitters</h2>
		<div
			v-for="(emitter, i) in emitters"
			:key="emitter.id"
			ref="emitterCards"
			:data-testid="`emitter-${emitter.id}`"
			class="govuk-summary-card"
		>
			<div class="govuk-summary-card__title-wrapper">
				<h2 v-if="editIndex === i" class="govuk-summary-card__title">{{ isAddEmitterCard(i) ? "Add emitter" : "Edit emitter" }}</h2>
				<h2 v-else class="govuk-summary-card__title">{{ emitter.name }}</h2>
				<ul v-if="editIndex !== i" class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`emitter_edit_${i}`"
							@click.prevent="startEdit(i)"
						>
							Edit
						</a>
					</li>
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`emitter_remove_${i}`"
							@click.prevent="removeEmitter(i)"
						>
							Remove
						</a>
					</li>
				</ul>
			</div>
			<div v-if="editIndex !== i" class="govuk-summary-card__content emitter-summary">
				<SummaryList :id="`emitter-${i}`" :data="emitterSummaryData(emitter)" />
			</div>
			<div v-else class="govuk-summary-card__content">
				<FormKit
					v-model="formModel"
					type="form"
					:actions="false"
					:incomplete-message="false"
					@submit="saveEmitter"
				>
					
					<FormKit
						:id="`typeOfHeatEmitter_${i}`"
						type="govRadios"
						label="Type of emitter"
						:help="useUnderfloorHeating ? undefined : 'Please note, underfloor heating is not currently available, but will be in future releases.'"
						:options="heatEmitterTypes"
						name="typeOfHeatEmitter"
						validation="required"
					/>
					<FormKit
						:id="`emitterName_${i}`"
						type="govInputText"
						label="Name"
						name="name"
						validation="required"
					/>
					<template v-if="formModel.typeOfHeatEmitter === 'radiator'">
						<FormKit
							:id="`selectRadiator_${i}`"
							type="govPcdbProduct"
							label="Product reference"
							name="productReference"
							validation="required"
							help="Select the radiator type from the PCDB using the button below."
							:selected-product-reference="formModel.productReference as string"
							selected-product-type="radiator"
							:page-url="route.fullPath"
							:page-index="props.index"
							:emitter-index="i"
						/>
						<FormKit
							:id="`numOfRadiators_${i}`"
							type="govInputInt"
							label="Number of radiators"
							name="numOfRadiators"
							:validation="zodTypeAsFormKitValidation(productCountZod)"
						/>
						<FormKit
							:id="`length_${i}`"
							type="govInputWithSuffix"
							label="Length"
							name="length"
							suffix-text="m"
							:validation="zodTypeAsFormKitValidation(lengthRadiatorZod)"
						/>
					</template>
					<template v-if="formModel.typeOfHeatEmitter === 'fanCoil'">
						<FormKit
							:id="`selectFanCoil_${i}`"
							type="govPcdbProduct"
							label="Select a product"
							name="productReference"
							validation="required"
							help="Select the fan coil type from the PCDB using the button below."
							:selected-product-reference="formModel.productReference as string"
							selected-product-type="fanCoil"
							:page-url="route.fullPath"
							:page-index="props.index"
							:emitter-index="i"
						/>
						<FormKit
							:id="`numOfFanCoils_${i}`"
							type="govInputInt"
							label="Number of fan coils"
							name="numOfFanCoils"
							:validation="zodTypeAsFormKitValidation(productCountZod)"
						/>
					</template>
					<template v-if="formModel.typeOfHeatEmitter === 'underfloorHeating'">
						<FormKit
							:id="`productReference_${i}`"
							type="govInputText"
							label="Product reference"
							name="productReference"
							validation="required"
						/>
						<FormKit
							:id="`areaOfUnderfloorHeating_${i}`"
							type="govInputWithSuffix"
							label="Area of underfloor heating"
							name="areaOfUnderfloorHeating"
							suffix-text="m²"
							:validation="zodTypeAsFormKitValidation(emitterFloorAreaZod)"
						/>
					</template>
					<div class="govuk-button-group">
						<button
							type="submit"
							class="govuk-button govuk-button--secondary"
							:data-testid="`saveEmitter_${i}`"
						>
							Save emitter
						</button>
						<a
							href="#"
							class="govuk-link govuk-body-s"
							:data-testid="`emitter_cancel_${i}`"
							@click.prevent="cancelEdit"
						>
							Cancel
						</a>
					</div>
				</FormKit>
			</div>
		</div>

		<GovButton
			v-if="emitters.length > 0 && !showAddForm && !isEditing"
			secondary
			test-id="addEmitterButton"
			:click="() => { showAddForm = true }"
		>
			Add another emitter
		</GovButton>

		<div v-if="(showAddForm || emitters.length === 0) && !isEditing" class="govuk-summary-card">
			<div class="govuk-summary-card__title-wrapper">
				<h2 class="govuk-summary-card__title">Add emitter</h2>
				<ul v-if="emitters.length > 0" class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<a
							href="#"
							class="govuk-link govuk-body-s"
							data-testid="cancelAddEmitter"
							@click.prevent="showAddForm = false"
						>
							Cancel
						</a>
					</li>
				</ul>
			</div>
			<div class="govuk-summary-card__content">
				<FormKit type="group" :ignore="true">
					<FormKit
						id="typeOfHeatEmitter"
						type="govRadios"
						label="Type of emitter"
						:options="heatEmitterTypes"
						:help="useUnderfloorHeating ? undefined : 'Please note, underfloor heating is not currently available, but will be in future releases.'"
						name="emitterTypeSelection"
						@input="addEmitter"
					/>
				</FormKit>
			</div>
		</div>
	</div>
</template>

<style scoped>
.emitter-summary :deep(.govuk-summary-list__key),
.emitter-summary :deep(.govuk-summary-list__value) {
	font-size: 1.1875rem;
}

:deep(.govuk-fieldset__legend--m),
:deep(.govuk-body--m),
:deep(.govuk-label--m) {
	font-size: 1.1875rem !important;
}
</style>
