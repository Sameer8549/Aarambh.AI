
'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { calmingActivityEncouragement } from '@/ai/flows/calming-activity-encouragement';
import { generateImage } from '@/ai/flows/image-generation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { JournalEntry } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';


function JournalFeed() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(
      collection(db, 'journal-entries'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newEntries: JournalEntry[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newEntries.push({
          id: doc.id,
          entry: data.entry,
          timestamp: data.timestamp.seconds,
          imageUrl: data.imageUrl,
        });
      });
      setEntries(newEntries);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6"/>
            {t('journal.feedTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4" ref={scrollAreaRef}>
          {entries.length === 0 ? (
            <div className='flex items-center justify-center h-full text-muted-foreground'>
                <p>{t('journal.noEntries')}</p>
            </div>
          ) : (
             <div className="space-y-4">
             <AnimatePresence>
                {entries.map((item, index) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                    <Card className="bg-card border-primary/20 overflow-hidden">
                        {item.imageUrl && (
                            <div className="relative aspect-video">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.entry.substring(0, 50)}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="abstract art"
                                />
                            </div>
                        )}
                        <CardContent className="p-4 text-sm text-secondary-foreground">
                            <p>"{item.entry}"</p>
                        </CardContent>
                        <CardFooter className='p-4 pt-0'>
                            <p className='text-xs text-muted-foreground'>
                                {format(new Date(item.timestamp * 1000), 'PPP')}
                            </p>
                        </CardFooter>
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


export default function JournalClient() {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const getAIEncouragement = async () => {
    try {
        const result = await calmingActivityEncouragement({
            activityType: 'gratitude journaling',
        });
        toast({
            title: t('journal.toast.encouragement.title'),
            description: result.encouragementMessage,
        });
    } catch (e) {
        console.error("Failed to get AI encouragement:", e);
    }
  }

  const handleJournalSubmit = async () => {
    if (!entry.trim()) {
      toast({
        title: t('journal.toast.empty.title'),
        description: t('journal.toast.empty.description'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const entryToSave = entry;
    setEntry(''); // Clear the input field immediately
    
    // Generate image first
    setIsGeneratingImage(true);
    let imageUrl = '';
    try {
        const imageResult = await generateImage({ prompt: entryToSave });
        imageUrl = imageResult.imageUrl;
    } catch(e) {
        console.error("Failed to generate image:", e);
        toast({
            title: t('journal.toast.imageError.title'),
            description: t('journal.toast.imageError.description'),
            variant: 'destructive',
        });
    } finally {
        setIsGeneratingImage(false);
    }

    try {
      await addDoc(collection(db, 'journal-entries'), {
        entry: entryToSave,
        timestamp: Timestamp.now(),
        imageUrl: imageUrl,
      });

      toast({
        title: t('journal.toast.saved.title'),
        description: t('journal.toast.saved.description'),
      });
      
      // Asynchronously get encouragement
      getAIEncouragement();

    } catch (error) {
      toast({
        title: t('journal.toast.error.title'),
        description: t('journal.toast.error.description'),
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="lg:sticky lg:top-8">
            <CardHeader>
                <CardTitle>{t('journal.newEntry')}</CardTitle>
                <CardDescription>
                {t('journal.prompt')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                <Textarea
                    id="journal-entry"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    placeholder={t('journal.placeholder')}
                    className="min-h-[200px] text-base"
                    disabled={isLoading}
                    aria-label={t('journal.ariaLabel')}
                />
                 {isGeneratingImage && (
                    <div className='flex flex-col items-center gap-2 text-sm text-muted-foreground'>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p>{t('journal.generatingImage')}</p>
                        <Skeleton className="h-32 w-full rounded-lg" />
                    </div>
                )}
                <Button
                    onClick={handleJournalSubmit}
                    disabled={isLoading}
                    className="w-full"
                    aria-label={t('journal.reflectAriaLabel')}
                >
                    {(isLoading || isGeneratingImage) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? t('journal.saving') : (isGeneratingImage ? t('journal.generating') : t('journal.reflect'))}
                </Button>
                </div>
            </CardContent>
        </Card>
        
        <JournalFeed />
      </div>
  );
}
