<script setup lang="ts">
const title = "Understanding mass distribution class";

</script>

<template>
  
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">The thermal mass of building components is dealt with in the core heat balance equations, as described in BS EN ISO
		52016-1:2017. In accordance with this standard, the areal heat capacity¹ (in J/(m²·K)) of each element is input
		along with one of 5 mass distribution classes describing in general terms the position of the mass (from internal to
		external) relative to the thermal resistance:
	</p>
	<ul class="govuk-list govuk-list--bullet">
		<li>Mass concentrated on internal side - Construction with external thermal insulation (main mass component near inside surface), or equivalent</li>
		<li>Mass concentrated on external side - Construction with internal thermal insulation (main mass component near outside surface), or equivalent</li>
		<li>Mass divided over internal and external side - Construction with thermal insulation in between two main mass components, or equivalent </li>
		<li>Mass equally distributed - Uninsulated construction (e.g. solid or hollow bricks, heavy or lightweight concrete, or lightweight construction with negligible mass (e.g. steel sandwich panel), or equivalent</li>
		<li>Mass concentrated inside - Construction with both internal and external insulation (main mass component concentrated near centre of construction), or equivalent</li>
	</ul>
	<p class="govuk-body">The standard also includes typical default values for areal heat capacity with a set of default construction type classes, varying from "very light" to "very heavy". These construction types can be found in BS EN ISO 52016-1:2017 Table B.14. Table 1 below is a summary of the construction of these default classes.</p>
	<img class="custom-govuk__img__padding-bottom" src="/img/construction-types.png" alt="Examples of construction type for each default class">
	<p class="govuk-body">Each opaque building element is modelled as five heat balance nodes and the areal heat capacity is distributed among these nodes according to the mass distribution class (the procedure is described in BS EN ISO 52016-1:2017 section 6.5.7). The five nodes are then included in the overall network for the zone in the model. The heat balance equations for all the nodes in the zone are then solved simultaneously using a linear algebra solver.</p>
	<p class="govuk-body">Thermal mass of transparent building elements is ignored.</p>
	<p class="govuk-body">Note: that the thermal mass includes the entire thickness of the building element. A monthly method such as the Standard Assessment Procedure would instead use the kappa value, which includes only the thickness of the construction active in thermal storage for the internal surface.</p>
	<p class="govuk-body">The thermal mass is either distributed as a whole unit, or divided up in fractions of a half, a quarter or one-eighth. The distribution amongst the nodes is shown graphically below, where the thermal mass distribution is represented by the brown area.</p>
	<div>
		<img class="custom-govuk__img" src="/img/mass-concentrated-internal-side.png" alt="Mass concenrated on internal side">
		<img class="custom-govuk__img" src="/img/mass-concentrated-external-side.png" alt="Mass concenrated on internal side">
		<img class="custom-govuk__img" src="/img/mass-divided-internal-external-sides.png" alt="Mass divided over internal and external sides">
		<img class="custom-govuk__img" src="/img/mass-equally-distributed.png" alt="Mass equally distributed">
		<img class="custom-govuk__img" src="/img/mass-concentrated-inside.png" alt="Mass concenrated inside">
	</div>
	<GovLLMWarning classes="govuk-!-margin-top-8" />
</template>


<style scoped lang="scss">
 .custom-govuk__img__padding-bottom {
  padding-bottom: 20px;
 }
	.custom-govuk__img {
    width: 75%;
    padding-top: 45px;
  }

</style>