import { defineFormKitConfig } from '@formkit/vue';
import GovButton from './components/GovButton.vue';
import GovRadios from './components/GovRadios.vue';
import type { FormKitInputs, FormKitOptionsProp } from '@formkit/inputs';
import GovDropdown from './components/GovDropdown.vue';
import GovInput from './components/GovInput.vue';


// Enable TypeScript support for custom inputs
declare module '@formkit/inputs' {
    interface FormKitInputProps<Props extends FormKitInputs<Props>> {
        'govRadios': {
            type: 'govRadios',
            options: FormKitOptionsProp
        },
        'govButton': {
            type: 'govButton'
        }
    }
}

// Register custom inputs with FormKit
export default defineFormKitConfig(() => {
    return {
        inputs: {
            govRadios: {
                type: 'input',
                component: GovRadios
            },
            govButton: {
                type: 'input',
                component: GovButton
            },
            govDropdown: {
                type: 'input',
                component: GovDropdown
            },
            govInput: {
                type: 'input',
                component: GovInput
            }
        }
    };
})