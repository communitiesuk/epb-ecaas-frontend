<script setup lang="ts">

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

const { dwellingSpaceExternalWall } = store.dwellingFabric.dwellingSpaceWalls;
const { dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

const options = [
	dwellingSpaceExternalWall.data.map(x => [x.data.id, x.data.name] as [string, string]),
	dwellingSpaceRoofs.data.map(x => [x.data.id, x.data.name] as [string, string]),
].flat().filter(x => x[0] !== undefined);
</script>

<template>
	<ClientOnly>
		<FormKit
			v-if="options.length"
			:id="id"
			type="govRadios"
			:options="new Map(options.concat([['none', 'None of the above']]))"
			:label="label"
			:help="help"
			:name="name"
			:validation="validation ?? 'required'"
			:validation-rules="validationRules"
			:validation-messages="validationMessages"/>
	</ClientOnly>
</template>

<style scoped lang="scss">
.gov-radios-add-links {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>