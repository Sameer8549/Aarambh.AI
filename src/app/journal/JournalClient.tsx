
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
import { useLanguage } from '@/contexts/LanguageContext';

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
    </div>
  );
}
