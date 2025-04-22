'use server';

import { db } from "@/firebase/admin";
import { CreateFeedbackParams, Feedback } from "@/types";

export async function createFeedback(params: CreateFeedbackParams): Promise<Feedback> {
    const { interviewId, userId, messages } = params;
    
    const feedback = await db.collection('feedback').add({
        interviewId,
        userId,
        messages,
        createdAt: new Date(),
    });

    return {
        id: feedback.id,
        interviewId,
        userId,
        messages,
        createdAt: new Date().toISOString(),
    };
} 