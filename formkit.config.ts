import FormKitStoredList from './components/form-kit/StoredList.vue';
import type {StoredListOption} from './components/form-kit/StoredList.vue';
import { defineFormKitConfig } from '@formkit/vue';
import FormKitButton from './components/form-kit/Button.vue';
import FormKitRadios from './components/form-kit/Radios.vue';
import type {RadioOption} from './components/form-kit/Radios.vue';
import type { FormKitInputs, FormKitOptionsProp } from '@formkit/inputs';
import FormKitDropdown from './components/form-kit/Dropdown.vue';
import FormKitInputFloat from './components/form-kit/InputFloat.vue';
import FormKitInputInt from './components/form-kit/InputInt.vue';
import FormKitInputWithSuffix from './components/form-kit/InputWithSuffix.vue';
import FormKitCheckboxes from './components/form-kit/Checkboxes.vue';
import FormKitInputText from './components/form-kit/InputText.vue';
import { FormKitBoolean } from '#components';

// Enable TypeScript support for custom inputs
declare module '@formkit/inputs' {
	interface FormKitInputProps<Props extends FormKitInputs<Props>> {
		'govRadios': {
			type: 'govRadios',
			options: Record<string, string | RadioOption> | Map<string, string>,
			valueType?: 'string' | 'number'
		},
		'govButton': {
			type: 'govButton'
		},
		'govDropdown': {
			type: 'govDropdown',
			options: FormKitOptionsProp | FormKitOptionsProp[]
		},
		'govInputFloat': {
			type: 'GovInputFloat'
		},
		'govInputInt': {
			type: 'govInputInt'
		},
		'govInputWithSuffix': {
			type: 'govInputWithSuffix',
			suffixText: string
		},
		'govCheckboxes': {
			type: 'govCheckboxes',
			options: FormKitOptionsProp,
			help?: string
		},
		'govInputText': {
			type: 'govInputText'
		}, 
		'govStoredList': {
			type: 'govStoredList',
			options: StoredListOption[]
		},
		'govBoolean': {
			type: 'govBoolean',
			trueLabel?: string,
			falseLabel?: string
		}
	}
}

// Register custom inputs with FormKit
export default defineFormKitConfig(() => {
	return {
		inputs: {
			govRadios: {
				type: 'input',
				component: FormKitRadios
			},
			govButton: {
				type: 'input',
				component: FormKitButton
			},
			govDropdown: {
				type: 'input',
				component: FormKitDropdown
			},
			govInputFloat: {
				type: 'input',
				component: FormKitInputFloat
			},
			govInputInt: {
				type: 'input',
				component: FormKitInputInt
			},
			govInputWithSuffix: {
				type: "input",
				component: FormKitInputWithSuffix
			},
			govCheckboxes: {
				type: "input",
				component: FormKitCheckboxes
			},
			govInputText: {
				type: "input",
				component: FormKitInputText
			},
			govStoredList: {
				type: "input",
				component: FormKitStoredList
			},
			govBoolean: {
				type: "input",
				component: FormKitBoolean
			}
		}
	};
});