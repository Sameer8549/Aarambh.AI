'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { calmingActivityEncouragement } from '@/ai/flows/calming-activity-encouragement';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function JournalClient() {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleJournalSubmit = async () => {
    if (!entry.trim()) {
      toast({
        title: 'Empty Entry',
        description: 'Please write something before reflecting.',
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
        title: 'Reflection Saved',
        description: result.encouragementMessage,
      });
      setEntry('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not save reflection. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <label htmlFor="journal-entry" className="font-medium">
            Today, I am grateful for...
          </label>
          <Textarea
            id="journal-entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write about three things that went well today, or anything that brings you joy."
            className="min-h-[250px] text-base"
            disabled={isLoading}
            aria-label="Journal entry textarea"
          />
          <Button onClick={handleJournalSubmit} disabled={isLoading} className="w-full sm:w-auto" aria-label="Reflect on journal entry">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reflect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
