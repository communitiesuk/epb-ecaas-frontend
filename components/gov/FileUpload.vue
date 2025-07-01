<script lang="ts" setup>
import { createAll, FileUpload } from 'govuk-frontend';

interface FileUploadProps {
	id: string,
	name: string,
	label?: {
		html: string;
	} | {
		text: string;
	};
	accept?: string;
	change?: (event: Event) => void;
}

const { id, label = { text: 'Upload a file' }, accept = undefined, change = undefined } = defineProps<FileUploadProps>();

const el = useTemplateRef('el');

watch(el, async (el) => {
	if (!el) {
		return;
	}
	createAll(FileUpload, undefined, el);
});

</script>

<template>
	<div ref="el" class="govuk-form-group">
		<!-- eslint-disable vue/no-v-html -->
		<label v-if="'html' in label" class="govuk-label" :for="id" v-html="label.html" />
		<!-- eslint-enable -->
		<label v-else class="govuk-label" :for="id">
			{{ label.text }}
		</label>
		<div class="govuk-drop-zone" data-module="govuk-file-upload">
			<input :id :name type="file" class="govuk-file-upload" :accept @change="change">
		</div>
	</div>
</template>
