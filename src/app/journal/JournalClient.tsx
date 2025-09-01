
'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { calmingActivityEncouragement } from '@/ai/flows/calming-activity-encouragement';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, BookOpen } from 'lucide-react';
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
import type { CommunityEntry as JournalEntry } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';


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
        <ScrollArea className="h-96 pr-4" ref={scrollAreaRef}>
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
                    <Card className="bg-secondary/50 border-primary/20">
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
  const { toast } = useToast();
  const { t } = useLanguage();

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
    try {
      // Save entry to Firestore
      await addDoc(collection(db, 'journal-entries'), {
        entry,
        timestamp: Timestamp.now(),
      });

      toast({
        title: t('journal.toast.saved.title'),
        description: t('journal.toast.saved.description'),
      });
      
      setEntry('');

    } catch (error) {
      toast({
        title: t('journal.toast.error.title'),
        description: t('journal.toast.error.description'),
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }

    // Get AI encouragement asynchronously without blocking the UI
    try {
        const result = await calmingActivityEncouragement({
            activityType: 'gratitude journaling',
        });
        toast({
            title: t('journal.toast.encouragement.title'),
            description: result.encouragementMessage,
        });
    } catch (e) {
        // Silently fail or show a less intrusive notification if needed
        console.error("Failed to get AI encouragement:", e);
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
                <Button
                    onClick={handleJournalSubmit}
                    disabled={isLoading}
                    className="w-full"
                    aria-label={t('journal.reflectAriaLabel')}
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('journal.reflect')}
                </Button>
                </div>
            </CardContent>
        </Card>
        
        <JournalFeed />
      </div>
  );
}

