
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { useLanguage } from '@/contexts/LanguageContext';
import { chatbotRespondMultilingually } from '@/ai/flows/multilingual-chatbot';
import type { ChatMessage, ResourceType, GenkitChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const crisisKeywords = [
    'kill myself', 'suicide', 'want to die', 'end my life', 'hopeless', 'can\'t go on', 'k.m.s', 'kms'
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


const ChatMessageContent = ({ content }: { content: string }) => {
    const parts = content.split(/(Insight:|Advice:|Disclaimer:)/).filter(part => part);

    return (
        <div className="text-sm whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (part.match(/Insight:|Advice:|Disclaimer:/)) {
                    return <strong key={index} className="block font-bold text-sm mt-3 mb-1">{part}</strong>;
                }
                if(part.startsWith('-')) {
                    return (
                        <ul key={index} className="list-none pl-0">
                            {part.split('\n-').map((item, i) => (
                                item.trim() && <li key={i} className="flex items-start gap-2 mb-2 before:content-['•'] before:inline-block before:mr-2 before:mt-1">{item.trim().replace(/^-/, '').trim()}</li>
                            ))}
                        </ul>
                    )
                }
                return <p key={index}>{part}</p>;
            })}
        </div>
    );
};


export default function ChatClient() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

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

    const genkitHistory: GenkitChatMessage[] = currentConversation
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        content: [{ text: m.content }]
      }));
    
    try {
      const response = await chatbotRespondMultilingually({
        language,
        message: input,
        conversationHistory: genkitHistory.slice(0, -1) // Exclude the current user message from history
      });
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.response,
        resources: response.resources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
       console.error("Chatbot Error:", error);
       setError(t('chat.errorMessage'));
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
                <Avatar className="h-8 w-8 self-start">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-2xl rounded-2xl p-3 shadow-sm flex flex-col',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                )}
              >
                <ChatMessageContent content={message.content} />
                 {message.resources && message.resources.length > 0 && (
                  <div className="mt-4">
                     <h4 className='font-bold text-sm flex items-center gap-2 mb-2'><Book className='h-4 w-4'/> {t('chat.helpfulResources')}</h4>
                     <Carousel
                        opts={{
                          align: "start",
                          loop: false,
                        }}
                        className="w-full max-w-sm sm:max-w-md md:max-w-lg"
                      >
                        <CarouselContent>
                          {message.resources.map((res, index) => {
                            const Icon = resourceIcons[res.type] || Book;
                            return (
                              <CarouselItem key={index} className="basis-4/5">
                                 <a href={res.link} target="_blank" rel="noopener noreferrer" className="h-full block">
                                  <Card className="bg-background/70 hover:bg-background h-full flex flex-col transition-all duration-300 ease-in-out hover:shadow-md">
                                    <CardHeader className="p-4">
                                      <CardTitle className="text-base flex items-center gap-2">
                                        <Icon className="h-5 w-5 text-primary" />
                                        <span className='truncate'>{res.title}</span>
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-sm flex-grow">
                                      <p className="line-clamp-3">{res.description}</p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Button size="sm" variant="link" className="p-0 h-auto text-primary">{t('chat.viewResource')}</Button>
                                    </CardFooter>
                                  </Card>
                                  </a>
                              </CarouselItem>
                            )
                          })}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4" />
                        <CarouselNext className="-right-4" />
                      </Carousel>
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
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>{t('chat.errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
          <AlertDialogAction asChild variant="secondary" className='w-full mt-0' onClick={() => onOpenChange(false)}>
            <Button>{t('crisis.continueChat')}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
