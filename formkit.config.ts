import { defineFormKitConfig } from '@formkit/vue';
import GovButton from './components/GovButton.vue';
import GovRadios from './components/GovRadios.vue';

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
            }
        }
    };
})