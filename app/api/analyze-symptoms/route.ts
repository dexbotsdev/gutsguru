import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai";


 
export async function POST(req: Request) {

    const reqBody = await req.json();


    const { symptoms, age } = reqBody


    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);


 
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: 'You are a helpful medical AI assistant. Provide a brief analysis of the symptoms described, potential causes, and general advice. Always recommend consulting a healthcare professional for accurate diagnosis and treatment.'
    });

    const prompt = `Patient age: ${age}. Symptoms: ${symptoms}`;

    console.log(prompt)


    const result =   await model.generateContent({
        contents: [{role: "user", parts: [{text: prompt}]}]
    })
 
    const response = await result.response;
    const textPrediction = response.text();

    console.log(textPrediction)

 
    return NextResponse.json({ text: `${textPrediction}` });

}

