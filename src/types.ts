// src/types.ts
export interface CodeExample {
    input: string;
    output: string;
    explanation?: string;
}

export interface StarterCode {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
}

export interface CodeQuestion {
    id: string;
    title: string;
    description: string;
    examples: CodeExample[];
    starterCode: StarterCode;
    constraints?: string[];
}

export interface User {
    id: number | string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: 'interviewer' | 'candidate' | string;
}

export interface Interview {
    id: number | string;
    title: string;
    description?: string | null;
    ownerId: number | string;
    candidateId?: string | null;
    interviewerIds?: string[];
    startTime: number | bigint;
    endTime?: number | bigint | null;
    status?: string;
    meetingCode?: string | null;
    streamCallId?: string | null;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
