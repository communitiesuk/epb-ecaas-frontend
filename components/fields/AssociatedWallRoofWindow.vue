<script setup lang="ts">
// import { getUrl } from "#imports";

defineProps<{
	id: string;
	name: string;
	label: string;
	help?: string;
	validation?: string;
	validationRules?: Record<string, (node: FormKitNode) => boolean>;
	validationMessages?: Record<string, string>;
}>();

const store = useEcaasStore();

const { dwellingSpaceWindows, dwellingSpaceCeilingsAndRoofs, dwellingSpaceWalls } = store.dwellingFabric;

const options = [
	dwellingSpaceWindows.data.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpaceCeilingsAndRoofs.dwellingSpaceRoofs.data.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpaceWalls.dwellingSpaceExternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
].flat().filter(x => x[0] !== "undefined");

</script>

<template>
	<ClientOnly>
		<FormKit
			:id="id"
			type="govRadios"
			:options="new Map(options)"
			:label="label"
			:help="help"
			:name="name"
			:validation="validation ?? 'required'"
			:validation-rules="validationRules"
			:validation-messages="validationMessages">
			<!-- <div v-if="!itemTaggedToVentOptions.length">
				<p class="govuk-error-message">No heat generators added.</p>
				<NuxtLink :to="getUrl('heatGeneration')" class="govuk-link gov-radios-add-link">
					Click here to add a heat generator
				</NuxtLink>
			</div> -->
		</FormKit>
	</ClientOnly>
</template>