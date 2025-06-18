// src/lib/types.ts

// Tipos que eram privados dentro de ChatWindow.vue, agora são públicos e exportados.

export interface AutoScrollConfig {
    send: {
        new: boolean;
        newAfterScrollUp: boolean;
    };
    receive: {
        new: boolean;
        newAfterScrollUp: boolean;
    };
}

export interface TextFormattingConfig {
    disabled: boolean;
}

export interface LinkOptionsConfig {
    disabled: boolean;
    target: string;
    rel: string | null;
}

export interface UsernameOptionsConfig {
    minUsers: number;
    currentUser: boolean;
}

export interface RoomUser { // Assumi que esta interface também seria útil
    _id: string;
    username: string;
    avatar: string;
    status?: any;
}

export interface RoomType {
    roomId: string;
    roomName?: string;
    index?: number;
    users: RoomUser[];
    // Adicione outras propriedades da sala aqui
}

export interface MessageType {
    // Adicione propriedades da mensagem aqui
    _id: string;
    content: string;
    senderId: string;
    // etc...
}

export interface ActionType {
    name: string;
    title: string;
    onlyMe?: boolean;
}
