<template>
	33
	<div class="vac-card-window" :style="[{ height }, cssVars]">
		<div class="vac-chat-container">
			<rooms-list v-if="!singleRoomCasted" :current-user-id="currentUserId" :rooms="orderedRooms"
				:loading-rooms="loadingRoomsCasted" :rooms-loaded="roomsLoadedCasted" :room="room"
				:room-actions="roomActionsCasted" :custom-search-room-enabled="customSearchRoomEnabled"
				:text-messages="t" :show-search="showSearchCasted" :show-add-room="showAddRoomCasted"
				:show-rooms-list="showRoomsList && roomsListOpenedCasted" :text-formatting="textFormattingCasted"
				:link-options="linkOptionsCasted" :is-mobile="isMobile" :scroll-distance="scrollDistance"
				@fetch-room="fetchRoom" @fetch-more-rooms="fetchMoreRooms"
				@loading-more-rooms="loadingMoreRooms = $event" @add-room="addRoom" @search-room="searchRoom"
				@room-action-handler="roomActionHandler"
>
				<template v-for="el in slots" #[el.slot]="data">
					<slot :name="el.slot" v-bind="data" />
				</template>
			</rooms-list>

			<room :current-user-id="currentUserId" :rooms="roomsCasted" :room-id="room.roomId || ''"
				:load-first-room="loadFirstRoomCasted" :messages="messagesCasted" :room-message="roomMessage"
				:messages-loaded="messagesLoadedCasted" :menu-actions="menuActionsCasted"
				:message-actions="messageActionsCasted" :message-selection-actions="messageSelectionActionsCasted"
				:auto-scroll="autoScrollCasted" :show-send-icon="showSendIconCasted" :show-files="showFilesCasted"
				:show-audio="showAudioCasted" :audio-bit-rate="audioBitRate" :audio-sample-rate="audioSampleRate"
				:show-emojis="showEmojisCasted" :show-reaction-emojis="showReactionEmojisCasted"
				:show-new-messages-divider="showNewMessagesDividerCasted" :show-footer="showFooterCasted"
				:text-messages="t" :single-room="singleRoomCasted"
				:show-rooms-list="showRoomsList && roomsListOpenedCasted" :text-formatting="textFormattingCasted"
				:link-options="linkOptionsCasted" :is-mobile="isMobile" :loading-rooms="loadingRoomsCasted"
				:room-info-enabled="roomInfoEnabledCasted" :textarea-action-enabled="textareaActionEnabledCasted"
				:textarea-auto-focus="textareaAutoFocusCasted" :user-tags-enabled="userTagsEnabledCasted"
				:emojis-suggestion-enabled="emojisSuggestionEnabledCasted" :scroll-distance="scrollDistance"
				:accepted-files="acceptedFiles" :capture-files="captureFiles" :multiple-files="multipleFilesCasted"
				:templates-text="templatesTextCasted" :username-options="usernameOptionsCasted"
				:emoji-data-source="emojiDataSource" @toggle-rooms-list="toggleRoomsList" @room-info="roomInfo"
				@fetch-messages="fetchMessages" @send-message="sendMessage" @edit-message="editMessage"
				@delete-message="deleteMessage" @open-file="openFile" @open-user-tag="openUserTag"
				@open-failed-message="openFailedMessage" @menu-action-handler="menuActionHandler"
				@message-action-handler="messageActionHandler"
				@message-selection-action-handler="messageSelectionActionHandler"
				@send-message-reaction="sendMessageReaction" @typing-message="typingMessage"
				@textarea-action-handler="textareaActionHandler"
>
				<template v-for="el in slots" #[el.slot]="data">
					<slot :name="el.slot" v-bind="data" />
				</template>
			</room>
		</div>
		<transition name="vac-fade-preview" appear>
			<media-preview v-if="showMediaPreview" :file="previewFile" @close-media-preview="showMediaPreview = false">
				<template v-for="el in slots" #[el.slot]="data">
					<slot :name="el.slot" v-bind="data" />
				</template>
			</media-preview>
		</transition>
	</div>
</template>

<script setup lang="ts">
    import { ref, computed, watch, onMounted, onUpdated, defineProps, defineEmits, defineExpose, Ref, type PropType } from 'vue'
    import RoomsList from './RoomsList/RoomsList.vue'
    import Room from './Room/Room.vue'
    import MediaPreview from './MediaPreview/MediaPreview.vue'

    import locales from '../locales'
    import { defaultThemeStyles, cssThemeVars } from '../themes'
    import { roomsValidation, partcipantsValidation } from '../utils/data-validation'

    // Props
    interface AutoScrollConfig {
      send: {
        new: boolean;
        newAfterScrollUp: boolean;
      };
      receive: {
        new: boolean;
        newAfterScrollUp: boolean;
      };
    }

    interface TextFormattingConfig {
      disabled: boolean;
    }

    interface LinkOptionsConfig {
      disabled: boolean;
      target: string;
      rel: string | null;
    }

    interface UsernameOptionsConfig {
      minUsers: number;
      currentUser: boolean;
    }

    interface RoomType {
      roomId: string;
      index?: number;
      users: Array<any>; // Adicione uma interface mais específica se os usuários tiverem uma estrutura definida
      // Adicione outras propriedades da sala aqui
    }

    interface MessageType {
      // Adicione propriedades da mensagem aqui
    }

    interface ActionType {
      name: string;
      title: string;
      onlyMe?: boolean;
    }

    const props = defineProps({
      height: { type: String, default: '600px' },
      theme: { type: String, default: 'light' },
      styles: { type: [Object, String] as PropType<Record<string, any> | string>, default: () => ({}) },
      responsiveBreakpoint: { type: Number, default: 900 },
      singleRoom: { type: [Boolean, String] as PropType<boolean | string>, default: false },
      roomsListOpened: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      textMessages: { type: [Object, String] as PropType<Record<string, any> | string>, default: () => ({}) },
      currentUserId: { type: String, default: '' },
      rooms: { type: [Array, String] as PropType<RoomType[] | string>, default: () => [] },
      roomsOrder: { type: String, default: 'desc' },
      loadingRooms: { type: [Boolean, String] as PropType<boolean | string>, default: false },
      roomsLoaded: { type: [Boolean, String] as PropType<boolean | string>, default: false },
      roomId: { type: String as PropType<string | null>, default: null },
      loadFirstRoom: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      messages: { type: [Array, String] as PropType<MessageType[] | string>, default: () => [] },
      messagesLoaded: { type: [Boolean, String] as PropType<boolean | string>, default: false },
      roomActions: { type: [Array, String] as PropType<ActionType[] | string>, default: () => [] },
      menuActions: { type: [Array, String] as PropType<ActionType[] | string>, default: () => [] },
      messageActions: {
        type: [Array, String] as PropType<ActionType[] | string>,
        default: () => [
          { name: 'replyMessage', title: 'Reply' },
          { name: 'editMessage', title: 'Edit Message', onlyMe: true },
          { name: 'deleteMessage', title: 'Delete Message', onlyMe: true },
          { name: 'selectMessages', title: 'Select' }
        ]
      },
      messageSelectionActions: { type: [Array, String] as PropType<ActionType[] | string>, default: () => [] },
      autoScroll: {
        type: [Object, String] as PropType<AutoScrollConfig | string>,
        default: () => {
          return {
            send: {
              new: true,
              newAfterScrollUp: true
            },
            receive: {
              new: true,
              newAfterScrollUp: false
            }
          }
        }
      },
      customSearchRoomEnabled: { type: [Boolean, String] as PropType<boolean | string>, default: false },
      showSearch: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      showAddRoom: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      showSendIcon: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      showFiles: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      showAudio: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      audioBitRate: { type: Number, default: 128 },
      audioSampleRate: { type: Number, default: 44100 },
      showEmojis: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      showReactionEmojis: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      showNewMessagesDivider: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      showFooter: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      textFormatting: {
        type: [Object, String] as PropType<TextFormattingConfig | string>,
        default: () => ({
          disabled: false
        })
      },
      linkOptions: {
        type: [Object, String] as PropType<LinkOptionsConfig | string>,
        default: () => ({ disabled: false, target: '_blank', rel: null })
      },
      roomInfoEnabled: { type: [Boolean, String] as PropType<boolean | string>, default: false },
      textareaActionEnabled: { type: [Boolean, String] as PropType<boolean | string>, default: false },
      textareaAutoFocus: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      userTagsEnabled: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      emojisSuggestionEnabled: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      roomMessage: { type: String, default: '' },
      scrollDistance: { type: Number, default: 60 },
      acceptedFiles: { type: String, default: '*' },
      captureFiles: { type: String, default: '' },
      multipleFiles: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      templatesText: { type: [Array, String] as PropType<string[] | string>, default: () => [] },
      mediaPreviewEnabled: { type: [Boolean, String] as PropType<boolean | string>, default: true },
      usernameOptions: {
        type: [Object, String] as PropType<UsernameOptionsConfig | string>,
        default: () => ({ minUsers: 3, currentUser: false })
      },
      emojiDataSource: { type: String as PropType<string | undefined>, default: undefined }
    })

    // Emits
    const emit = defineEmits([
      'toggle-rooms-list',
      'room-info',
      'fetch-messages',
      'send-message',
      'edit-message',
      'delete-message',
      'open-file',
      'open-user-tag',
      'open-failed-message',
      'menu-action-handler',
      'message-action-handler',
      'send-message-reaction',
      'typing-message',
      'textarea-action-handler',
      'fetch-more-rooms',
      'add-room',
      'search-room',
      'room-action-handler',
      'message-selection-action-handler'
    ])

    // Data
    const slots: any = ref([])
    const room: any = ref({})
    const loadingMoreRooms: Ref<boolean> = ref(false)
    const showRoomsList = ref<boolean>(true)
    const isMobile = ref<boolean>(false)
    const showMediaPreview = ref<boolean>(false)
    const previewFile = ref<any>({}) // Pode ser mais específico se o tipo de arquivo for conhecido

    // Methods
    const castBoolean = (val: boolean | string): boolean => {
      return val === 'true' || val === true
    }

    const castArray: any = (val: any | string) => {
      return !val ? [] : Array.isArray(val) ? val : JSON.parse(val as string)
    }

    const castObject: any = (val: any | string) => {
      return !val ? {} : typeof val === 'object' ? val : JSON.parse(val as string)
    }

    const updateResponsive = (): void => {
      isMobile.value = window.innerWidth < Number(props.responsiveBreakpoint)
    }

    const toggleRoomsList = (): void => {
      showRoomsList.value = !showRoomsList.value
      if (isMobile.value) room.value = {} as RoomType
      emit('toggle-rooms-list', { opened: showRoomsList.value })
    }

    const fetchRoom = ({ room: selectedRoom }: { room: RoomType }): void => {
      room.value = selectedRoom
      fetchMessages({ reset: true })
      if (isMobile.value) showRoomsList.value = false
    }

    const fetchMoreRooms = (): void => {
      emit('fetch-more-rooms')
    }

    const roomInfo = (): void => {
      emit('room-info', room.value)
    }

    const addRoom = (): void => {
      emit('add-room')
    }

    const searchRoom = (val: string): void => {
      emit('search-room', { value: val, roomId: room.value.roomId })
    }

    const fetchMessages = (options: { reset: boolean }): void => {
      emit('fetch-messages', { room: room.value, options })
    }

    const sendMessage = (message: any): void => { // Pode ser mais específico se o tipo de mensagem for conhecido
      emit('send-message', { ...message, roomId: room.value.roomId })
    }

    const editMessage = (message: any): void => { // Pode ser mais específico se o tipo de mensagem for conhecido
      emit('edit-message', { ...message, roomId: room.value.roomId })
    }

    const deleteMessage = (message: any): void => { // Pode ser mais específico se o tipo de mensagem for conhecido
      emit('delete-message', { message, roomId: room.value.roomId })
    }

    const openFile = ({ message, file }: { message: any; file: any }): void => { // Pode ser mais específico se o tipo de mensagem e arquivo forem conhecidos
      if (mediaPreviewEnabledCasted.value && file.action === 'preview') {
        previewFile.value = file.file
        showMediaPreview.value = true
      } else {
        emit('open-file', { message, file })
      }
    }

    const openUserTag = ({ user }: { user: any }): void => { // Pode ser mais específico se o tipo de usuário for conhecido
      emit('open-user-tag', { user })
    }

    const openFailedMessage = ({ message }: { message: any }): void => { // Pode ser mais específico se o tipo de mensagem for conhecido
      emit('open-failed-message', {
        message,
        roomId: room.value.roomId
      })
    }

    const menuActionHandler = (ev: any): void => { // Pode ser mais específico se o tipo de evento for conhecido
      emit('menu-action-handler', {
        action: ev,
        roomId: room.value.roomId
      })
    }

    const roomActionHandler = ({ action, roomId }: { action: any; roomId: string }): void => { // Pode ser mais específico se o tipo de ação for conhecido
      emit('room-action-handler', {
        action,
        roomId
      })
    }

    const messageActionHandler = (ev: any): void => { // Pode ser mais específico se o tipo de evento for conhecido
      emit('message-action-handler', {
        ...ev,
        roomId: room.value.roomId
      })
    }

    const messageSelectionActionHandler = (ev: any): void => { // Pode ser mais específico se o tipo de evento for conhecido
      emit('message-selection-action-handler', {
        ...ev,
        roomId: room.value.roomId
      })
    }

    const sendMessageReaction = (messageReaction: any): void => { // Pode ser mais específico se o tipo de reação for conhecido
      emit('send-message-reaction', {
        ...messageReaction,
        roomId: room.value.roomId
      })
    }

    const typingMessage = (message: any): void => { // Pode ser mais específico se o tipo de mensagem for conhecido
      emit('typing-message', {
        message,
        roomId: room.value.roomId
      })
    }

    const textareaActionHandler = (message: any): void => { // Pode ser mais específico se o tipo de mensagem for conhecido
      emit('textarea-action-handler', {
        message,
        roomId: room.value.roomId
      })
    }

    // Computeds
    const t = computed(() => {
      return {
        ...locales,
        ...textMessagesCasted.value
      }
    })

    const cssVars = computed(() => {
      const defaultStyles = defaultThemeStyles[props.theme as keyof typeof defaultThemeStyles]
      const customStyles: any = {}

      Object.keys(defaultStyles).map(key => {
        customStyles[key] = {
          ...(defaultStyles as any)[key],
          ...(stylesCasted.value[key] || {})
        }
      })

      return cssThemeVars(customStyles)
    })

    const orderedRooms = computed(() => {
      return roomsCasted.value.slice().sort((a, b) => {
        const aVal = a.index || 0
        const bVal = b.index || 0

        if (props.roomsOrder === 'asc') {
          return aVal < bVal ? -1 : bVal < aVal ? 1 : 0
        }

        return aVal > bVal ? -1 : bVal > aVal ? 1 : 0
      })
    })

    const singleRoomCasted = computed(() => castBoolean(props.singleRoom))
    const roomsListOpenedCasted = computed(() => castBoolean(props.roomsListOpened))
    const loadingRoomsCasted = computed(() => castBoolean(props.loadingRooms))
    const roomsLoadedCasted = computed(() => castBoolean(props.roomsLoaded))
    const loadFirstRoomCasted = computed(() => castBoolean(props.loadFirstRoom))
    const messagesLoadedCasted = computed(() => castBoolean(props.messagesLoaded))
    const multipleFilesCasted = computed(() => castBoolean(props.multipleFiles))
    const showSearchCasted = computed(() => castBoolean(props.showSearch))
    const showAddRoomCasted = computed(() => castBoolean(props.showAddRoom))
    const showSendIconCasted = computed(() => castBoolean(props.showSendIcon))
    const showFilesCasted = computed(() => castBoolean(props.showFiles))
    const showAudioCasted = computed(() => castBoolean(props.showAudio))
    const showEmojisCasted = computed(() => castBoolean(props.showEmojis))
    const showReactionEmojisCasted = computed(() => castBoolean(props.showReactionEmojis))
    const showNewMessagesDividerCasted = computed(() => castBoolean(props.showNewMessagesDivider))
    const showFooterCasted = computed(() => castBoolean(props.showFooter))
    const roomInfoEnabledCasted = computed(() => castBoolean(props.roomInfoEnabled))
    const textareaActionEnabledCasted = computed(() => castBoolean(props.textareaActionEnabled))
    const textareaAutoFocusCasted = computed(() => castBoolean(props.textareaAutoFocus))
    const userTagsEnabledCasted = computed(() => castBoolean(props.userTagsEnabled))
    const emojisSuggestionEnabledCasted = computed(() => castBoolean(props.emojisSuggestionEnabled))
    const mediaPreviewEnabledCasted = computed(() => castBoolean(props.mediaPreviewEnabled))
    const roomsCasted = computed(() => castArray(props.rooms))
    const messagesCasted = computed(() => castArray(props.messages))
    const roomActionsCasted = computed(() => castArray(props.roomActions))
    const menuActionsCasted = computed(() => castArray(props.menuActions))
    const messageActionsCasted = computed(() => castArray(props.messageActions))
    const messageSelectionActionsCasted = computed(() => castArray(props.messageSelectionActions))
    const templatesTextCasted = computed(() => castArray(props.templatesText))
    const stylesCasted = computed(() => castObject(props.styles))
    const textMessagesCasted = computed(() => castObject(props.textMessages))
    const autoScrollCasted = computed(() => castObject(props.autoScroll))
    const textFormattingCasted = computed(() => castObject(props.textFormatting))
    const linkOptionsCasted = computed(() => castObject(props.linkOptions))
    const usernameOptionsCasted = computed(() => castObject(props.usernameOptions))

    // Watchers
    watch(roomsCasted, (newVal, oldVal) => {
      if (
        !newVal[0] ||
        !newVal.find(roomItem => roomItem.roomId === room.value.roomId)
      ) {
        showRoomsList.value = true
      }

      if (
        !loadingMoreRooms.value &&
        loadFirstRoomCasted.value &&
        newVal[0] &&
        (!oldVal || newVal.length !== oldVal.length)
      ) {
        if (props.roomId) {
          const foundRoom = newVal.find(r => r.roomId === props.roomId) || {} as RoomType
          fetchRoom({ room: foundRoom })
        } else if (!isMobile.value || singleRoomCasted.value) {
          fetchRoom({ room: orderedRooms.value[0] })
        } else {
          showRoomsList.value = true
        }
      }
    }, { immediate: true, deep: true })

    watch(loadingRoomsCasted, (val) => {
      if (val) room.value = {} as RoomType
    })

    watch(() => props.roomId, (newVal, oldVal) => {
        if (newVal && !loadingRoomsCasted.value && roomsCasted.value.length) {
            const foundRoom = roomsCasted.value.find(r => r.roomId === newVal) || {} as RoomType
            fetchRoom({ room: foundRoom })
        } else if (oldVal && !newVal) {
            room.value = {} as RoomType
        }
    }, { immediate: true })

    watch(room, (val: any) => {
      if (!val || Object.entries(val).length === 0) return

      roomsValidation(val)

      val.users.forEach(user => {
        partcipantsValidation(user)
      })
    }, { deep: true })

    watch(roomsListOpenedCasted, (val) => {
      showRoomsList.value = val
    }, { immediate: true })

    // Lifecycle Hooks
    onMounted(() => {
      updateResponsive()
      window.addEventListener('resize', (ev: Event) => {
        if ((ev as any).isTrusted) updateResponsive()
      })
    })

    onUpdated(() => {
      const currentSlots = document.querySelectorAll('[slot]')
      if (slots.value.length !== currentSlots.length) {
        slots.value = currentSlots
      }
    })

    // Expose methods externally
    defineExpose({
        toggleRoomsList,
        fetchRoom,
        fetchMoreRooms,
        roomInfo,
        addRoom,
        searchRoom,
        fetchMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        openFile,
        openUserTag,
        openFailedMessage,
        menuActionHandler,
        roomActionHandler,
        messageActionHandler,
        messageSelectionActionHandler,
        sendMessageReaction,
        typingMessage,
        textareaActionHandler
  })
</script>

<style lang="scss">
@import '../styles/index.scss';
</style>
