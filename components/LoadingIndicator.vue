<!-- port of Home Office loading spinner https://design.homeoffice.gov.uk/design-system/components?name=Loading%20spinner -->

<template>
	<div class="epb-loading-spinner" role="status">
		<div class="epb-loading-spinner__spinner"/>
		<div class="epb-loading-spinner__content">
			<h2 class="govuk-heading-m">
				<slot />
			</h2>
		</div>
	</div>
</template>

<style>
.epb-loading-spinner__spinner {
  margin-left: auto;
  margin-right: auto;
  border: 12px solid #dee0e2;
  border-radius: 50%;
  border-top-color: #1d70b8;
  width: 80px;
  height: 80px;
  animation: epb-loading-spinner-animation 2s linear infinite;
}
@keyframes epb-loading-spinner-animation {
    0% {
        transform: rotate(0deg)
    }

    100% {
        transform: rotate(360deg)
    }
}
.epb-loading-spinner__content {
  text-align: center;
  padding-top: 15px;
}
@media (min-width: 40.0625em) {
  .epb-loading-spinner__content {
    padding-top: 20px;
  }
}
.epb-loading-spinner {
  padding-top: 15px;
}
@media (min-width: 40.0625em) {
  .epb-loading-spinner {
    padding-top: 20px;
  }
}
</style>