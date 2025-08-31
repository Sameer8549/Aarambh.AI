
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateVideo } from '@/ai/flows/video-generation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function GeneratePage() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGeneration = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedVideoUrl(null);

    try {
      const result = await generateVideo({ prompt });
      setGeneratedVideoUrl(result.videoUrl);
    } catch (e: any) {
      console.error(e);
      setError(e.message || t('generate.errorDescription'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-headline">{t('generate.title')}</h1>
        <p className="text-lg text-muted-foreground mt-2">{t('generate.subtitle')}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{t('generate.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('generate.promptPlaceholder')}
              className="flex-1 text-base"
              disabled={isLoading}
              aria-label="Video prompt"
            />
            <Button onClick={handleGeneration} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Video className="mr-2 h-4 w-4" />
              )}
              {t('generate.buttonText')}
            </Button>
          </div>

          {isLoading && (
            <Alert>
              <Loader2 className="h-5 w-5 animate-spin" />
              <AlertTitle>{t('generate.generatingTitle')}</AlertTitle>
              <AlertDescription>{t('generate.generatingDescription')}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>{t('generate.errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {generatedVideoUrl && (
            <div className="mt-6">
              <Card>
                <CardContent className="p-4">
                  <video
                    controls
                    src={generatedVideoUrl}
                    className="w-full rounded-lg"
                    aria-label="Generated video"
                  >
                    Your browser does not support the video tag.
                  </video>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
