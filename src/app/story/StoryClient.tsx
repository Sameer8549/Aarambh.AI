
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, Wand, Play, Pause, CircleStop } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateStory } from '@/ai/flows/story-generation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const CustomAudioPlayer = ({ audioUrl, onPlaybackEnd }: { audioUrl: string; onPlaybackEnd: () => void }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        const setAudioData = () => {
            setDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        }

        const setAudioTime = () => setCurrentTime(audio.currentTime);

        const handlePlaybackEnd = () => {
          setIsPlaying(false);
          onPlaybackEnd();
        }

        audio.addEventListener('loadeddata', () => {
            setAudioData();
            setIsReady(true);
        });
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handlePlaybackEnd);


        return () => {
            audio.pause();
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handlePlaybackEnd);
            audioRef.current = null;
        };
    }, [audioUrl, onPlaybackEnd]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <Card className="bg-secondary/50">
            <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
                 <div className="flex items-center justify-center w-full max-w-xs h-16">
                   <AnimatePresence mode="wait">
                    {isPlaying ? (
                         <motion.div 
                            key="playing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-center gap-1 w-full h-full"
                         >
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-primary rounded-full"
                                    style={{
                                        animation: `waveform 1.5s ease-in-out infinite alternate`,
                                        animationDelay: `${i * 0.15}s`,
                                    }}
                                ></motion.div>
                            ))}
                        </motion.div>
                    ) : (
                         <motion.div 
                            key="paused"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-muted-foreground font-medium"
                         >
                            {isReady ? "Ready to play" : "Loading audio..."}
                        </motion.div>
                    )}
                   </AnimatePresence>
                 </div>
                 <div className="w-full">
                    <div className="relative h-2 w-full bg-muted rounded-full">
                        <motion.div 
                            className="absolute h-2 left-0 top-0 bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1, ease: 'linear' }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                 </div>

                <Button
                    onClick={togglePlayPause}
                    disabled={!isReady}
                    size="lg"
                    className="rounded-full w-16 h-16"
                >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>
            </CardContent>
             <style>{`
                @keyframes waveform {
                    0% { height: 10%; }
                    100% { height: 100%; }
                }
            `}</style>
        </Card>
    );
};


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

          <AnimatePresence>
            {generatedAudioUrl && (
                <motion.div
                    key="audio-player"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-6"
                >
                    <CustomAudioPlayer 
                        audioUrl={generatedAudioUrl}
                        onPlaybackEnd={() => console.log("Playback finished")}
                    />
                </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
