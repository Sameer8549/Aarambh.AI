
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { calmingActivityEncouragement } from '@/ai/flows/calming-activity-encouragement';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

type JournalEntry = {
  id: string;
  text: string;
  createdAt: Timestamp;
};

export default function JournalClient() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoadingEntries(true);
      const q = query(
        collection(db, 'users', user.uid, 'entries'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userEntries: JournalEntry[] = [];
        querySnapshot.forEach((doc) => {
          userEntries.push({ id: doc.id, ...doc.data() } as JournalEntry);
        });
        setEntries(userEntries);
        setIsLoadingEntries(false);
      }, (error) => {
          console.error("Error fetching journal entries: ", error);
          toast({
            title: t('journal.toast.error.title'),
            description: t('journal.toast.error.fetch'),
            variant: 'destructive',
          });
          setIsLoadingEntries(false);
      });

      return () => unsubscribe();
    } else {
      setEntries([]);
      setIsLoadingEntries(false);
    }
  }, [user, t, toast]);


  const handleJournalSubmit = async () => {
    if (!entry.trim()) {
      toast({
        title: t('journal.toast.empty.title'),
        description: t('journal.toast.empty.description'),
        variant: 'destructive',
      });
      return;
    }
    if (!user) {
        toast({
            title: t('journal.toast.auth.title'),
            description: t('journal.toast.auth.description'),
            variant: 'destructive',
        });
        return;
    }


    setIsLoading(true);
    try {
        await addDoc(collection(db, 'users', user.uid, 'entries'), {
            text: entry,
            createdAt: serverTimestamp(),
        });
        
      const result = await calmingActivityEncouragement({
        activityType: 'gratitude journaling',
      });

      toast({
        title: t('journal.toast.saved.title'),
        description: result.encouragementMessage,
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
  };
  
  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'Just now';
    return timestamp.toDate().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
   const formatTime = (timestamp: Timestamp | null) => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleTimeString()
  }


  return (
    <div className="space-y-6">
      <Card>
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
              placeholder={user ? t('journal.placeholder') : t('journal.placeholderAuth')}
              className="min-h-[200px] text-base"
              disabled={isLoading || !user}
              aria-label={t('journal.ariaLabel')}
            />
            <Button
              onClick={handleJournalSubmit}
              disabled={isLoading || !user}
              className="w-full sm:w-auto"
              aria-label={t('journal.reflectAriaLabel')}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('journal.reflect')}
            </Button>
             {!user && (
                <p className="text-sm text-muted-foreground">{t('journal.authPrompt')}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {user && isLoadingEntries && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {user && !isLoadingEntries && entries.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">{t('journal.pastEntries')}</h2>
            {entries.map((pastEntry) => (
                <Card key={pastEntry.id}>
                    <CardHeader>
                        <CardTitle className='text-lg'>
                           {formatDate(pastEntry.createdAt)}
                        </CardTitle>
                        <CardDescription>
                           {formatTime(pastEntry.createdAt)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{pastEntry.text}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
       {user && !isLoadingEntries && entries.length === 0 && (
         <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
                {t('journal.noEntries')}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
