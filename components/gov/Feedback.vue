<script setup lang="ts">
const satisfied = ref<boolean | null>(null);
const route = useRoute();

const handleFeedback = (isSatisfied: boolean | null) => {
	satisfied.value = isSatisfied;

	if (isSatisfied !== null) {
		useTrackEvent('page_feedback', {
			satisfied: isSatisfied
		});
	}
};

watch(() => route.fullPath, () => satisfied.value = null);
</script>

<!--
	This component and its styles are based on the feedback component from the GOVUK Component Guide
	(https://components.publishing.service.gov.uk/component-guide/feedback)
 -->
<template>
	<div class="feedback feedback__prompt feedback__prompt-content">
		<div class="feedback__prompt-questions">
			<div v-if="satisfied === null" class="feedback__prompt-question-answer">
				<h2 class="feedback__prompt-question">Are you satisfied with this page?</h2>
				<ul class="feedback__option-list">
					<li class="feedback__option-list-item">
						<button
							class="govuk-button feedback__prompt-link js-page-is-useful"
							data-ga4-event="{
								&quot;event_name&quot;: &quot;form_submit&quot;,
								&quot;type&quot;: &quot;feedback&quot;,
								&quot;text&quot;: &quot;Yes&quot;,
								&quot;section&quot;: &quot;Are you satisfied with this page?&quot;,
								&quot;tool_name&quot;: &quot;Are you satisfied with this page?&quot;
							}"
							@click="() => handleFeedback(true)">
							Yes <span class="govuk-visually-hidden">this page is useful</span>
						</button>
					</li>
					<li class="feedback__option-list-item">
						<button
							class="govuk-button feedback__prompt-link js-toggle-form js-page-is-not-useful"
							aria-controls="page-is-not-useful" aria-expanded="false"
							data-ga4-event="{
								&quot;event_name&quot;: &quot;form_submit&quot;,
								&quot;type&quot;: &quot;feedback&quot;,
								&quot;text&quot;: &quot;No&quot;,
								&quot;section&quot;: &quot;Are you satisfied with this page?&quot;,
								&quot;tool_name&quot;: &quot;Are you satisfied with this page?&quot;
							}"
							@click="() => handleFeedback(false)">
							No <span class="govuk-visually-hidden">this page is not useful</span>
						</button>
					</li>
				</ul>
			</div>
			<div v-else class="feedback__prompt-success">Thank you for your feedback</div>
		</div>

		<div class="feedback__prompt-questions feedback__prompt-questions--something-is-wrong">
			<NuxtLink
				href="/feedback"
				class="govuk-button feedback__prompt-link js-toggle-form js-something-is-wrong">
				Send detailed feedback about this page
			</NuxtLink>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.feedback {
		background: #fff;
		margin-top: 30px
	}

	@media(min-width: 48.0625em) {
		.feedback {
			margin-top:60px
		}
	}

	@media(max-width: 40.0525em) {
		.feedback {
			margin-right:-15px;
			margin-left: -15px
		}
	}

	@media(min-width: 40.0625em)and (max-width: 48.0525em) {
		.feedback {
			margin-right:-30px;
			margin-left: -30px
		}
	}

	.feedback__prompt {
		background-color: #f4f8fb;
		color: #0b0c0c;
		border-top: 1px solid #8eb8dc;
		outline: 0
	}

	.feedback__prompt-content {
		display: flex;
		flex-direction: column;
		padding: 0 15px
	}

	@media(min-width: 40.0625em) {
		.feedback__prompt-content {
			flex-direction:row;
			align-items: center;
			justify-content: space-between
		}
	}

	.feedback__prompt-questions {
		text-align: left;
		padding: 20px 0
	}

	@media(min-width: 40.0625em) {
		.feedback__prompt-questions {
			margin:0 15px
		}
	}

	.feedback__prompt-questions--something-is-wrong {
		border-top: 1px solid #b1b4b6
	}

	@media(min-width: 40.0625em) {
		.feedback__prompt-questions--something-is-wrong {
			border:0
		}
	}

	.feedback__prompt-question-answer {
		display: flex;
		align-items: center
	}

	@media(max-width: 19.99em) {
		.feedback__prompt-question-answer {
			justify-content:center;
			flex-wrap: wrap
		}
	}

	.feedback__prompt-question,
	.feedback__prompt-success {
		font-family: "GDS Transport",arial,sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-weight: 700;
		font-size: 1.1875rem;
		line-height: 1.3157894737
	}

	@media(min-width: 40.0625em) {
		.feedback__prompt-question,
		.feedback__prompt-success {
			font-family:"GDS Transport",arial,sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			font-weight: 700;
			font-size: 1rem;
			line-height: 1.25
		}
	}

	.feedback__prompt-question {
		margin: 0;
		padding-bottom: 10px;
	}

	.feedback__prompt-question:focus {
		outline: 0;
	}

	@media(min-width: 20em) {
		.feedback__prompt-question {
			padding-bottom:0;
			margin-right: 10px;
		}
	}

	@media(min-width: 48.0625em) {
		.feedback__prompt-question {
			margin-right:20px
		}
	}

	.feedback__prompt-link {
		background: rgba(0,0,0,0);
		color: #0b0c0c;
		box-shadow: 0 3px 0 #0b0c0c;
		border: 1px #0b0c0c solid;
		margin-bottom: 0;
		width: 100%;
		font-family: "GDS Transport",arial,sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		font-weight: 400;
		font-size: 1.1875rem;
		line-height: 1.3157894737
	}

	@media(min-width: 40.0625em) {
		.feedback__prompt-link {
			font-family:"GDS Transport",arial,sans-serif;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			font-weight: 400;
			font-size: 1rem;
			line-height: 1.25
		}
	}

	.feedback__prompt-link:focus,
	.feedback__prompt-link:focus:not(:active):not(:hover) {
		background: #fd0;
		border-color: #0b0c0c;
		box-shadow: 0 5px 0 #0b0c0c
	}

	.feedback__prompt-link:active {
		color: #0b0c0c
	}

	.feedback__prompt-link:hover {
		background: #b1b4b6;
		color: #0b0c0c
	}

	.feedback__prompt-link:link,
	.feedback__prompt-link:visited {
		color: #0b0c0c
	}

	.feedback__prompt-link:link:focus,
	.feedback__prompt-link:link:active,
	.feedback__prompt-link:visited:focus,
	.feedback__prompt-link:visited:active {
		color: #0b0c0c
	}

	.feedback__option-list {
		display: flex;
		list-style-type: none;
		margin: 0;
		padding: 0
	}

	.feedback__option-list-item:last-child {
		margin-left: 10px
	}

	@media(min-width: 48.0625em) {
		.feedback__option-list-item:last-child {
			margin-left:20px
		}
	}

	.feedback__option-list-item .feedback__prompt-link {
		min-width: 100px
	}

	@media(max-width: 48.0525em) {
		.feedback__option-list-item .feedback__prompt-link {
			min-width:80px
		}
	}
</style>