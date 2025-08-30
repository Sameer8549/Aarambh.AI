
'use client';
import { useState } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '@/contexts/LanguageContext';

type JournalEntry = {
  id: string;
  text: string;
  date: Date;
};

export default function JournalClient() {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
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
      const result = await calmingActivityEncouragement({
        activityType: 'gratitude journaling',
      });
      toast({
        title: t('journal.toast.saved.title'),
        description: result.encouragementMessage,
      });
      
      const newEntry: JournalEntry = {
        id: uuidv4(),
        text: entry,
        date: new Date(),
      };
      setEntries([newEntry, ...entries]);
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
              placeholder={t('journal.placeholder')}
              className="min-h-[200px] text-base"
              disabled={isLoading}
              aria-label={t('journal.ariaLabel')}
            />
            <Button
              onClick={handleJournalSubmit}
              disabled={isLoading}
              className="w-full sm:w-auto"
              aria-label={t('journal.reflectAriaLabel')}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('journal.reflect')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold font-headline">{t('journal.pastEntries')}</h2>
            {entries.map((pastEntry) => (
                <Card key={pastEntry.id}>
                    <CardHeader>
                        <CardTitle className='text-lg'>
                            {pastEntry.date.toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </CardTitle>
                        <CardDescription>
                             {pastEntry.date.toLocaleTimeString()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{pastEntry.text}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
