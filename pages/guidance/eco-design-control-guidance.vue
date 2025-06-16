
<script setup lang="ts">
const title = "Eco design control class";
</script>
<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>

	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<ul class="govuk-list govuk-list--bullet">
		<li><b>Class I --  On/off Room Thermostat:</b> A room thermostat that controls the on/off operation of a heater. Performance parameters, including switching differential and room temperature control accuracy, are determined by the thermostat's mechanical construction.</li>
		<li><b>Class II --  Weather compensator control, for use with modulating heaters:</b> A heater flow temperature control that varies the set point of the flow temperature of water leaving the heater dependent upon prevailing outside temperature and selected weather compensation curve. Control is achieved by modulating the output of the heater. </li>  
		<li><b>Class III --  Weather compensator control, for use with on/off output heaters:</b> A heater flow temperature control that varies the set point of the flow temperature of water leaving the heater dependent upon prevailing outside temperature and selected weather compensation curve. Heater flow temperature is varied by controlling the on/off operation of the heater. </li>
		<li><b>Class IV --  TPI10 room thermostat, for use with on/off output heaters:</b> An electronic room thermostat that controls both thermostat cycle rate and in-cycle on/off ratio of the heater proportional to room temperature. TPI control strategy reduces mean water temperature, improves room temperature control accuracy and enhances system efficiency. </li>
		<li><b>Class V --  Modulating room thermostat, for use with modulating heaters:</b> An electronic room thermostat that varies the flow temperature of the water leaving the heater dependent upon measured room temperature deviation from room thermostat set point. Control is achieved by modulating the output of the heater. </li>
		<li><b>Class VI --  Weather compensator and room sensor, for use with modulating heaters:</b> A heater flow temperature control that varies the flow temperature of water leaving the heater dependent upon prevailing outside temperature and selected weather compensation curve. A room temperature sensor monitors room temperature and adjusts the compensation curve parallel displacement to improve room comfort. Control is achieved by modulating the output of the heater. </li>
		<li><b>Class VII --  Weather compensator and room sensor, for use with on/off output heaters:</b> A heater flow temperature control that varies the flow temperature of water leaving the heater dependent upon prevailing outside temperature and selected weather compensation curve. A room temperature sensor monitors room temperature and adjusts the compensation curve parallel displacement to improve room comfort. Heater flow temperature is varied by controlling the on/off operation of the heater. </li>
		<li><b>Class VIII --  Multi-sensor room temperature control, for use with modulating heaters:</b> An electronic control, equipped with 3 or more room sensors that varies the flow temperature of the water leaving the heater dependent upon the aggregated measured room temperature deviation from room sensor set points. Control is achieved by modulating the output of the heater. </li>
	</ul>
</template>
