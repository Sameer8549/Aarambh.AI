
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Book, Loader2, Phone, Youtube, FileText, Headphones, Dumbbell, AppWindow } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useLanguage } from '@/contexts/LanguageContext';
import { chatbotRespondMultilingually } from '@/ai/flows/multilingual-chatbot';
import type { ChatMessage, ResourceType } from '@/types';
import { cn } from '@/lib/utils';

const crisisKeywords = [
  'kill myself', 'suicide', 'want to die', 'end my life', 'hopeless', 'can\'t go on'
];

const resourceIcons: Record<ResourceType, React.ElementType> = {
  book: Book,
  video: Youtube,
  article: FileText,
  podcast: Headphones,
  helpline: Phone,
  music: Headphones,
  exercise: Dumbbell,
  app: AppWindow,
};


export default function ChatClient() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    setMessages([
        {
          id: uuidv4(),
          role: 'assistant',
          content: t('chat.initialMessage'),
        }
    ])
  }, [t]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (crisisKeywords.some(keyword => input.toLowerCase().includes(keyword))) {
      setShowCrisisModal(true);
      return;
    }

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input,
    };
    
    const currentConversation = [...messages, userMessage];
    setMessages(currentConversation);
    setInput('');
    setIsLoading(true);

    try {
      const conversationHistory = currentConversation.map(m => `${m.role}: ${m.content}`).join('\n');
      const response = await chatbotRespondMultilingually({
        language,
        message: input,
        conversationHistory: conversationHistory
      });
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.response,
        resources: response.resources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: t('chat.errorMessage'),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)] bg-card rounded-lg shadow-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-md rounded-2xl p-3 shadow-sm',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                 {message.resources && message.resources.length > 0 && (
                  <div className="space-y-2 mt-4">
                     <h4 className='font-bold text-sm flex items-center gap-2'><Book className='h-4 w-4'/> {t('chat.helpfulResources')}</h4>
                    {message.resources.map((res, index) => {
                      const Icon = resourceIcons[res.type] || Book;
                      return (
                        <Card key={index} className="bg-background/70">
                          <CardHeader className="p-4">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Icon className="h-4 w-4 text-primary" />
                              {res.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 text-sm">
                            <p>{res.description}</p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <a href={res.link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm">{t('chat.viewResource')}</Button>
                            </a>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                )}
                 {message.recommendations && message.recommendations.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {message.recommendations.map((rec, index) => (
                        <Card key={index} className="bg-background/70">
                          <CardHeader className="p-4">
                            <CardTitle className="text-base">{rec.title}</CardTitle>
                            <CardDescription>{rec.author}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 text-sm">
                            <p>{rec.summary}</p>
                          </CardContent>
                          <CardFooter className="p-4 pt-0">
                            <a href={rec.link} target="_blank" rel="noopener noreferrer">
                              <Button size="sm">{t('chat.viewResource')}</Button>
                            </a>
                          </CardFooter>
                        </Card>
                      )
                    )}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-2 justify-start">
               <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
               <div className="max-w-xs rounded-2xl p-3 shadow-sm bg-secondary text-secondary-foreground rounded-bl-none">
                <Loader2 className="h-5 w-5 animate-spin" />
               </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-card rounded-b-lg">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-1"
            disabled={isLoading}
            aria-label={t('chat.inputAriaLabel')}
          />
          <Button onClick={handleSendMessage} disabled={isLoading} aria-label={t('chat.sendAriaLabel')} className="px-3 sm:px-4">
            <Send className="h-5 w-5" />
            <span className="font-medium ml-2 hidden sm:inline">{t('chat.send')}</span>
          </Button>
        </div>
      </div>
      <CrisisAlertDialog open={showCrisisModal} onOpenChange={setShowCrisisModal} t={t} />
    </div>
  );
}


function CrisisAlertDialog({open, onOpenChange, t}: {open: boolean, onOpenChange: (open: boolean) => void, t: (key: string) => string}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('crisis.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('crisis.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='w-full flex-col sm:flex-col gap-2'>
           <AlertDialogAction asChild className='w-full'>
            <a href="tel:1800-599-0019" className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4"/> {t('crisis.callHelpline')}
            </a>
          </AlertDialogAction>
          <AlertDialogAction asChild variant="outline" className='w-full mt-0' onClick={() => onOpenChange(false)}>
            <Button>{t('crisis.continueChat')}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
