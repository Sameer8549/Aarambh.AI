'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { moderateJournalEntry } from '@/ai/flows/moderate-journal-entry';
import type { CommunityEntry } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

function CommunityFeed() {
  const [entries, setEntries] = useState<CommunityEntry[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const q = query(
      collection(db, 'community-journal'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newEntries: CommunityEntry[] = [];
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

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
        setTimeout(() => {
             if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
             }
        }, 100);
    }
  }, [entries]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6"/>
            {t('community.feedTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 pr-4" ref={scrollAreaRef}>
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
                    </Card>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}


export default function CommunityClient() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (!entry.trim()) return;

    setIsLoading(true);
    const moderationToast = toast({
      title: t('community.toast.moderating.title'),
      description: t('community.toast.moderating.description'),
    });

    try {
      const moderationResult = await moderateJournalEntry({ entry });

      if (moderationResult.isApproved) {
        await addDoc(collection(db, 'community-journal'), {
          entry,
          timestamp: Timestamp.now(),
        });
        moderationToast.update({
          id: moderationToast.id,
          title: t('community.toast.success.title'),
          description: t('community.toast.success.description'),
        });
        setEntry('');
      } else {
        moderationToast.update({
          id: moderationToast.id,
          title: t('community.toast.rejected.title'),
          description: moderationResult.reason || t('community.toast.rejected.description'),
          variant: 'destructive',
        });
      }
    } catch (e) {
      console.error(e);
      moderationToast.update({
        id: moderationToast.id,
        title: t('community.toast.error.title'),
        description: t('community.toast.error.description'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-headline">{t('community.title')}</h1>
        <p className="text-lg text-muted-foreground mt-2">{t('community.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="lg:sticky lg:top-8">
          <CardHeader>
            <CardTitle>{t('journal.newEntry')}</CardTitle>
            <CardDescription>{t('community.placeholder')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder={t('journal.prompt')}
                className="min-h-[150px] text-base"
                disabled={isLoading}
              />
              <Button onClick={handleShare} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {t('community.button')}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <CommunityFeed />

      </div>
    </div>
  );
}
