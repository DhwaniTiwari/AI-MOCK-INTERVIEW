import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin";

export async function GET(){
    return Response.json({ success: true, data: 'THANK YOU'},{status:200});
}

export async function POST(request: Request){
    console.log('Received interview generation request');
    console.log('Environment variables check:');
    console.log('GOOGLE_GENERATIVE_AI_API_KEY present:', !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    
    const { type, role, level, techstack, amount, userid } = await request.json();
    console.log('Request data:', { type, role, level, techstack, amount, userid });

    // Validate required fields
    if (!userid) {
        console.error('Missing userid in request');
        return Response.json({ 
            success: false, 
            error: 'User ID is required' 
        }, { status: 400 });
    }

    if (!type || !role || !level || !techstack || !amount) {
        console.error('Missing required fields:', { type, role, level, techstack, amount });
        return Response.json({ 
            success: false, 
            error: 'All fields are required' 
        }, { status: 400 });
    }

    try {
        console.log('Generating questions with AI...');
        const { text : questions } = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
        });
        console.log('Generated questions:', questions);

        // Validate questions format
        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questions);
            if (!Array.isArray(parsedQuestions)) {
                throw new Error('Questions must be an array');
            }
        } catch (parseError) {
            console.error('Error parsing questions:', parseError);
            return Response.json({ 
                success: false, 
                error: 'Failed to parse generated questions',
                details: parseError
            }, { status: 500 });
        }

        const interview = {
            role, 
            type, 
            level,
            techstack: techstack.split(','),
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString()
        };
        console.log('Prepared interview object:', interview);

        console.log('Attempting to save to Firestore...');
        const interviewRef = await db.collection("interviews").add(interview);
        console.log('Successfully saved interview with ID:', interviewRef.id);

        return Response.json({
            success: true,
            interviewId: interviewRef.id,
            data: interview
        }, {status:200});
    }catch (error){
        console.error('Error generating interview:', error);
        
        let errorMessage = 'Failed to generate interview';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return Response.json({ 
            success: false, 
            error: errorMessage,
            details: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}