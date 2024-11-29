'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios'

const formatTextToHTML = (text: string) => {
    // Step 1: Normalize newlines and clean unnecessary spaces
    let formattedText = text.replace(/\n+/g, ' ').trim();
    formattedText = formattedText.replace(/\</g, '\n');

    // Step 2: Format headings (marked with **...**)
    formattedText = formattedText.replace(/\*\*(.+?)\*\*/g, '<h3>$1</h3>');
    formattedText = formattedText.replace(/\*/g, '');

    // Step 3: Format bullet points (marked with * )
    formattedText = formattedText.replace(/\* (.+?)(?=(\n|$))/g, '<li>$1</li>');
    formattedText = formattedText.replace(/<li>/, '<ul><li>').replace(/<\/li>(?!<\/ul>)/g, '</li></ul>');

    // Step 4: Add paragraphs for plain text outside of lists and headings
    const sections = formattedText.split(/<\/h3>/).map((section: string) => {
        if (section.includes('<ul>')) return section; // Skip lists
        return section.replace(/([^<]+)(?=(<|$))/g, '<p>$1</p>\n\n\n'); // Wrap plain text in <p> tags
    });

    // Step 5: Rejoin the formatted sections
   // formattedText = sections.join('</h3>');

    // Step 6: Remove any redundant tags
    formattedText = formattedText.replace(/<p>\s*<\/p>/g, '\n'); // Remove empty <p> tags
    formattedText = formattedText.replace(/<\/ul>\s*<ul>/g, '\n'); // Merge consecutive lists
    formattedText = formattedText.replace(/<\./g, '\n'); // Merge consecutive lists

    return formattedText;
};




export default function SymptomsPage() {
    const [age, setAge] = useState('')
    const [symptoms, setSymptoms] = useState('')
    const [messages, setMessages] = useState('')


    const getResults = async () => {

        const data = {
            symptoms, age
        }


        await axios.post('/api/analyze-symptoms', data).then((resuult: any) => {
            console.log(resuult.data.text)
            setMessages(resuult.data.text)
        })

    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Symptoms Check AI</CardTitle>
                    <CardDescription>
                        Describe your symptoms and get AI-powered health insights. Note: This is not a substitute for professional medical advice.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label htmlFor="symptoms" className="text-sm font-medium">Your symptoms</label>
                        <Textarea
                            id="symptoms"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Describe your symptoms in detail..."
                            className="min-h-[150px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="age" className="text-sm font-medium">Age</label>
                        <Input
                            id="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="Enter your age"
                        />
                    </div>
                    <Button onClick={() => getResults()} className="w-full">
                        Analyze Symptoms
                    </Button>
                </CardContent>
            </Card>

            {messages.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert">
                            <div className="prose dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: formatTextToHTML(messages) }}
                             />

                        </div>

                    </CardContent>
                </Card>
            )}
        </div>
    )
}

