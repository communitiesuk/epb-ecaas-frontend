<script setup lang="ts">
import { getUrl } from "#imports";

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
			:id="id" type="govRadios" :options="new Map(options)" :label="label" :help="help" :name="name"
			:validation="validation ?? 'required'" :validation-rules="validationRules"
			:validation-messages="validationMessages">
			<div v-if="!options.length">
				<p class="govuk-error-message">No walls, roofs or windows added.</p>
				<div class="gov-radios-add-links">
					<NuxtLink :to="getUrl('dwellingSpaceWalls')" class="govuk-link gov-radios-add-link">
						Click here to add walls
					</NuxtLink>
					<NuxtLink :to="getUrl('dwellingSpaceCeilingsAndRoofs')" class="govuk-link gov-radios-add-link">
						Click here to add roofs
					</NuxtLink>
					<NuxtLink :to="getUrl('dwellingSpaceWindows')" class="govuk-link gov-radios-add-link">
						Click here to add windows
					</NuxtLink>
				</div>
			</div>
		</FormKit>
	</ClientOnly>
</template>


<style scoped lang="scss">
.gov-radios-add-links {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>