<script setup lang="ts">
import formStatus from "~/constants/formStatus";

const title = "Pipework";
const page = usePage();
const store = useEcaasStore();

type PipeworkType = keyof typeof store.domesticHotWater.pipework;
type PipeworkData = EcaasForm<PrimaryPipeworkData> & EcaasForm<SecondaryPipeworkData>;

function handleRemove(pipeworkType: PipeworkType, index: number) {
	const pipework = store.domesticHotWater.pipework[pipeworkType].data;

	if (pipework) {
		pipework.splice(index, 1);

		store.$patch((state) => {
			state.domesticHotWater.pipework[pipeworkType].data = pipework.length ? pipework : [];
			state.domesticHotWater.pipework[pipeworkType].complete = false;
		});
	}
}

function handleDuplicate<T extends PipeworkData>(pipeworkType: PipeworkType, index: number) {
	const pipework = store.domesticHotWater.pipework[pipeworkType]?.data;
	const pipeworkItem = pipework?.[index];
	let name: string;

	if (pipeworkItem) {
		const duplicates = pipework.filter(d => {
			if(isEcaasForm(d) && isEcaasForm(pipeworkItem)) {
				name = pipeworkItem.data.name;
				return d.data.name.match(duplicateNamePattern(pipeworkItem.data.name));
			}
			return false;
		});
		
		store.$patch((state) => {

			const newItem = {
				complete: pipeworkItem.complete,
				data: {
					...pipeworkItem.data,
					name: `${name} (${duplicates.length})`
				}
			} as T;
			
			state.domesticHotWater.pipework[pipeworkType].data.push(newItem);
			state.domesticHotWater.pipework[pipeworkType].complete = false;
		});
	}
}


function handleComplete() {
	store.$patch({
		domesticHotWater: {
			pipework: {
				primaryPipework: { complete: true },
				secondaryPipework: { complete: true },
			}
		}
	});

	navigateTo("/domestic-hot-water");
}

function checkIsComplete(){
	const pipes = store.domesticHotWater.pipework;
	return Object.values(pipes).every(pipe => pipe.complete);
}

function hasIncompleteEntries(){

	const pipeworkTypes = store.domesticHotWater.pipework;

	return Object.values(pipeworkTypes).some(
		pipeworks => pipeworks.data.some(
			pipework => isEcaasForm(pipework) ? !pipework.complete : false));
}

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<LinksPipeworkGuidance />
	<CustomList
		id="primaryPipework"
		title="Primary pipework"
		:form-url="`${page?.url!}/primary`"
		:items="store.domesticHotWater.pipework.primaryPipework.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('primaryPipework', index)"
		@duplicate="(index: number) => handleDuplicate('primaryPipework', index)"
	/>
	<CustomList
		id="secondaryPipework"
		title="Secondary pipework (hot water distribution)"
		:form-url="`${page?.url!}/secondary`"
		:items="store.domesticHotWater.pipework.secondaryPipework.data.map(x => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress}))"
		:show-status="true"
		@remove="(index: number) => handleRemove('secondaryPipework', index)"
		@duplicate="(index: number) => handleDuplicate('secondaryPipework', index)"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton
			href="/domestic-hot-water"
			secondary
		>
			Return to domestic hot water
		</GovButton>
		<CompleteElement :is-complete="checkIsComplete()" :disabled="hasIncompleteEntries()" @completed="handleComplete"/>
	</div>
</template>
