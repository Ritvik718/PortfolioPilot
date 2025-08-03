
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Loader2, Send, Bot, User } from 'lucide-react';
import type { ParsePortfolioOutput } from '@/ai/flows/parse-portfolio';
import { askPortfolioQuestion } from '@/app/actions';
import { ScrollArea } from '../ui/scroll-area';
import { CalculatedInsights } from '@/lib/calculations';
import { motion, AnimatePresence } from 'framer-motion';


type PortfolioChatProps = {
    portfolioData: {
        parsed: ParsePortfolioOutput;
        calculated: CalculatedInsights;
    } | null;
}

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

const messageVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};


export function PortfolioChat({ portfolioData }: PortfolioChatProps) {
    const [question, setQuestion] = React.useState('');
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [isPending, startTransition] = React.useTransition();
    const { toast } = useToast();
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const handleQuestionSubmit = async () => {
        if (!question.trim() || !portfolioData) return;

        const newMessages: Message[] = [...messages, { role: 'user', content: question }];
        setMessages(newMessages);
        setQuestion('');

        startTransition(async () => {
            const result = await askPortfolioQuestion({
                question,
                portfolioData: JSON.stringify(portfolioData)
            });

            if (result.error) {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error,
                });
                 setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't get an answer." }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: result.answer! }]);
            }
        });
    }

    const isChatDisabled = !portfolioData;

    return (
        <Card className="flex flex-col h-[500px]">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MessageCircle className="text-primary h-6 w-6" />
                    <CardTitle>AI Portfolio Q&amp;A</CardTitle>
                </div>
                <CardDescription>
                    {isChatDisabled 
                        ? "Analyze your portfolio to start chatting with the AI."
                        : "Ask a question about your portfolio."
                    }
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                     <div className="space-y-4">
                        <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div 
                                key={index} 
                                className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                                variants={messageVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {message.role === 'assistant' && (
                                    <div className="bg-primary text-primary-foreground p-2 rounded-full">
                                        <Bot size={20} />
                                    </div>
                                )}
                                <div className={`p-3 rounded-lg max-w-[80%] ${message.role === 'user' ? 'bg-muted' : 'bg-card border'}`}>
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                {message.role === 'user' && (
                                     <div className="bg-muted p-2 rounded-full">
                                        <User size={20} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                        </AnimatePresence>
                         {isPending && (
                            <motion.div 
                                className="flex items-start gap-3"
                                variants={messageVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                 <div className="bg-primary text-primary-foreground p-2 rounded-full">
                                    <Bot size={20} />
                                </div>
                                <div className="p-3 rounded-lg bg-card border">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            </motion.div>
                         )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="pt-4 border-t">
                <div className="flex w-full items-center space-x-2">
                    <Input 
                        id="question" 
                        placeholder="Why did my crypto holdings drop?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleQuestionSubmit()}
                        disabled={isChatDisabled || isPending}
                    />
                    <Button onClick={handleQuestionSubmit} disabled={isChatDisabled || isPending}>
                         {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
