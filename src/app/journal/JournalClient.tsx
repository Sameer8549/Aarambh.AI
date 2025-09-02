
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
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching journal entries: ", error);
      setIsLoading(false);
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
          {isLoading ? (
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-card border-primary/20 overflow-hidden">
                        <Skeleton className="aspect-video w-full" />
                        <CardContent className="p-4">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-3/4 mt-2" />
                        </CardContent>
                        <CardFooter className='p-4 pt-0'>
                           <Skeleton className="h-3 w-1/2" />
                        </CardFooter>
                    </Card>
                ))}
             </div>
          ) : entries.length === 0 ? (
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
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
  const { toast } = useToast();
  const { t } = useLanguage();

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

    const entryToSave = entry;
    // Clear the input field immediately for a responsive feel
    setEntry('');

    // Perform saving and image generation in the background
    const processEntry = async () => {
      let imageUrl = '';
      try {
        // 1. Generate Image
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
        }

        // 2. Save to Firestore
        await addDoc(collection(db, 'journal-entries'), {
          entry: entryToSave,
          timestamp: Timestamp.now(),
          imageUrl: imageUrl,
        });

        toast({
          title: t('journal.toast.saved.title'),
          description: t('journal.toast.saved.description'),
        });
        
        // 3. Get encouragement (fire and forget)
        getAIEncouragement();

      } catch (error) {
        toast({
          title: t('journal.toast.error.title'),
          description: t('journal.toast.error.description'),
          variant: 'destructive',
        });
         // Restore the entry if saving fails, allowing the user to try again
         setEntry(entryToSave);
      }
    };
    
    // Start the background process without awaiting it
    processEntry();
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
                    aria-label={t('journal.ariaLabel')}
                />
                <Button
                    onClick={handleJournalSubmit}
                    className="w-full"
                    aria-label={t('journal.reflectAriaLabel')}
                >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('journal.reflect')}
                </Button>
                </div>
            </CardContent>
        </Card>
        
        <JournalFeed />
      </div>
  );
}
