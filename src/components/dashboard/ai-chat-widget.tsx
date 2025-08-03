'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BotMessageSquare, Send, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { askQuestion } from '@/app/actions';
import type { PortfolioData } from '@/lib/data';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type AIChatWidgetProps = {
  portfolioData: PortfolioData;
};

export function AIChatWidget({ portfolioData }: AIChatWidgetProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const question = input;
    setInput('');

    startTransition(async () => {
      const result = await askQuestion(question, portfolioData);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setMessages(newMessages); // Rollback optimistic update
      } else {
        setMessages([...newMessages, { role: 'assistant', content: result.answer as string }]);
      }
    });
  };

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-6 w-6" />
            <CardTitle>AI Financial Assistant</CardTitle>
        </div>
        <CardDescription>Ask anything about your portfolio.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.length === 0 && (
                 <div className="flex h-full items-center justify-center">
                    <div className="text-center text-muted-foreground p-4 rounded-lg bg-secondary">
                        <BotMessageSquare className="mx-auto h-12 w-12 mb-2" />
                        <p className="text-sm">e.g., "Why did my crypto holdings drop?"</p>
                    </div>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex gap-2',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isPending && (
                <div className="flex gap-2 justify-start">
                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center gap-2">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse" style={{ animationDelay: '200ms' }}>●</span>
                        <span className="animate-pulse" style={{ animationDelay: '400ms' }}>●</span>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
