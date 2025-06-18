import { defineCustomElement } from 'vue'
import AdvancedChatAi from './ChatWindow'

export { AdvancedChatAi }
export const VueAdvancedChat = defineCustomElement(AdvancedChatAi)

const PACKAGE_NAME = 'vue-advanced-chat'

export function register() {
	if (!customElements.get(PACKAGE_NAME)) {
		customElements.define(PACKAGE_NAME, VueAdvancedChat)
	}
}
