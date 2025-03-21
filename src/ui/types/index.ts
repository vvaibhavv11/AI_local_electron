export const MessageType = {
    USER: 'user',
    AI: 'ai'
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

export type Token = number & {
    __token: never;
};

export type ModelSegmentType = "thought" | undefined;

export type ModelResponseChunk = {
    type: "segment" | undefined;
    segmentType: ModelSegmentType;
    text: string;
    tokens: Token[];
    segmentStartTime?: Date;
    segmentEndTime?: Date;
};

export type Message = {
    id: string;
    content: string;
    type: MessageType;
    isLoading: boolean;
    segmentType: ModelSegmentType;
}

export type aiResponse = {
    event: 'streaming',
    data: {
        response: string
    }
}
