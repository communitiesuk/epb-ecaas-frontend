<script setup lang="ts">
import formStatus from "~/constants/formStatus";
import { checkMvhrHasDuctwork } from "../../../utils/checkMvhrHasDuctwork";
const title = "MVHR ductwork";
const page = usePage();
const store = useEcaasStore();


const { data } = store.infiltrationAndVentilation.ductwork;

function handleRemove(index: number) {
	data.splice(index, 1);

	store.$patch({
		infiltrationAndVentilation: {
			ductwork: {
				data: data.length ? data : undefined,
				complete: false,
			},
		},
	});
}

function handleDuplicate(index: number) {
	const ductwork = data[index];
	if (ductwork) {
		const duplicates = data.filter((x) =>
			x.data.name.match(duplicateNamePattern(ductwork.data.name))
		);
		store.$patch((state) => {
			state.infiltrationAndVentilation.ductwork.data?.push({
				...ductwork,
				data: {
					...ductwork.data,
					name: `${ductwork.data.name} (${duplicates.length})`
				}
			});
		});
		store.infiltrationAndVentilation.ductwork.complete = false;
	}
}

function handleComplete() {
	if(checkMvhrHasDuctwork()){
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: { complete: true }
			}
		});
		navigateTo("/infiltration-and-ventilation");		
	}
		
}
function checkIsComplete(){
	if(!store.infiltrationAndVentilation.ductwork.complete){
		return false;
	}
	return checkMvhrHasDuctwork();
}
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<CustomList
		id="ductwork"
		title="Ductwork"
		:form-url="page?.url!"
		:items="store.infiltrationAndVentilation.ductwork.data?.map((x) => ({
			name: x.data.name,
			status: x.complete ? formStatus.complete : formStatus.inProgress
		}))"
		:show-status="true"
		@remove="handleRemove"
		@duplicate="handleDuplicate"
	/>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/infiltration-and-ventilation" secondary>
			Return to infiltration and ventilation
		</GovButton>
		<CompleteElement
			:is-complete="checkIsComplete()"
			:disabled="store.infiltrationAndVentilation.ductwork.data?.some(s => !s.complete)"
			@completed="handleComplete"
		/>
	</div>

</template>
