
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateStory } from '@/ai/flows/story-generation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function StoryClient() {
  const { t, language } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneration = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedAudioUrl(null);

    try {
      const result = await generateStory({ prompt, language });
      setGeneratedAudioUrl(result.audioUrl);
    } catch (e: any) {
      console.error(e);
      // Handle the specific quota error message from the flow
      if (e.message === 'quotaExceeded') {
        setError(t('story.errorQuota'));
      } else {
        setError(e.message || t('story.errorDescription'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">{t('story.title')}</h1>
        <p className="text-lg text-muted-foreground mt-2">{t('story.subtitle')}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand className="h-6 w-6" />
            {t('story.cardTitle')}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
             <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('story.promptPlaceholder')}
              className="flex-1 text-base min-h-[100px]"
              disabled={isLoading}
              aria-label="Story prompt"
            />
            <Button onClick={handleGeneration} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {t('story.buttonText')}
            </Button>
          </div>

          {isLoading && (
            <Alert>
              <Loader2 className="h-5 w-5 animate-spin" />
              <AlertTitle>{t('story.generatingTitle')}</AlertTitle>
              <AlertDescription>{t('story.generatingDescription')}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t('story.errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {generatedAudioUrl && (
            <div className="mt-6">
              <Card>
                <CardContent className="p-4">
                  <audio
                    controls
                    src={generatedAudioUrl}
                    className="w-full"
                    aria-label="Generated audio story"
                  >
                    Your browser does not support the audio tag.
                  </audio>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
