'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, Wind, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { calmingActivityEncouragement } from '@/ai/flows/calming-activity-encouragement';
import { cn } from '@/lib/utils';

const musicTracks = [
  {
    name: 'Flute',
    url: 'https://storage.googleapis.com/studiogpt-pro-1d623.appspot.com/6c2b184a-7140-4917-a006-213906421455.mp3',
    dataAiHint: 'indian flute',
  },
  {
    name: 'Sitar',
    url: 'https://storage.googleapis.com/studiogpt-pro-1d623.appspot.com/83c16283-176f-4e55-829d-64903332a677.mp3',
    dataAiHint: 'sitar music',
  },
  {
    name: 'Veena',
    url: 'https://storage.googleapis.com/studiogpt-pro-1d623.appspot.com/a9c1c4f1-1e9a-4c22-8356-8292c3a50275.mp3',
    dataAiHint: 'veena music',
  },
  {
    name: 'Lo-fi',
    url: 'https://storage.googleapis.com/studiogpt-pro-1d623.appspot.com/495d9ac8-0955-4089-9b97-1566373b885e.mp3',
    dataAiHint: 'lofi beat',
  },
];

const BreathingAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [text, setText] = useState('Get Ready...');

  const cycle = [
    { text: 'Breathe In', duration: 4000 },
    { text: 'Hold', duration: 7000 },
    { text: 'Breathe Out', duration: 8000 },
  ];
  const timerRef = useRef<NodeJS.Timeout>();
  
  const startBreathingCycle = () => {
    setIsBreathing(true);
    let i = 0;
    const runCycle = () => {
      setText(cycle[i].text);
      timerRef.current = setTimeout(() => {
        i = (i + 1) % cycle.length;
        runCycle();
      }, cycle[i].duration);
    };
    runCycle();
  };

  const stopBreathingCycle = () => {
    setIsBreathing(false);
    clearTimeout(timerRef.current);
    setText('Great job! You can stop when you are ready.');
    onComplete();
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center h-96">
      <div className="relative flex items-center justify-center w-48 h-48 mb-6">
        <div
          className={cn(
            'absolute w-full h-full bg-secondary rounded-full',
            isBreathing && text === 'Breathe In' && 'animate-[pulse_4s_ease-in-out_infinite]',
            isBreathing && text === 'Breathe Out' && 'animate-[pulse_8s_ease-in-out_infinite_reverse]'
          )}
          style={{ animationName: isBreathing ? 'pulse' : 'none' }}
        ></div>
         <div className="absolute w-24 h-24 bg-primary/20 rounded-full"></div>
        <p className="z-10 text-2xl font-bold font-headline text-primary-foreground bg-primary p-4 rounded-full">
          {text}
        </p>
      </div>
      {!isBreathing ? (
        <Button onClick={startBreathingCycle} aria-label="Start breathing exercise">
          <Play className="mr-2 h-4 w-4" /> Start Breathing
        </Button>
      ) : (
        <Button onClick={stopBreathingCycle} variant="secondary" aria-label="Stop breathing exercise">
          <Pause className="mr-2 h-4 w-4" /> Stop
        </Button>
      )}
       <style>{`
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 0.7; }
            50% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.7; }
          }
      `}</style>
    </Card>
  );
};


const MusicPlayer = ({ onComplete }: { onComplete: (activity: string) => void }) => {
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusicTrack = (track: typeof musicTracks[0]) => {
    if (playing === track.name) {
      audioRef.current?.pause();
      setPlaying(null);
      onComplete(track.name);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(track.url);
      audioRef.current.play();
      setPlaying(track.name);
    }
  };
  
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    }
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {musicTracks.map((track) => (
        <Card key={track.name} className="flex items-center justify-between p-4" data-ai-hint={track.dataAiHint}>
          <div className="flex items-center gap-4">
            <Music className="h-6 w-6 text-primary" />
            <p className="font-semibold">{track.name}</p>
          </div>
          <Button size="icon" variant={playing === track.name ? "secondary" : "ghost"} onClick={() => toggleMusicTrack(track)} aria-label={playing === track.name ? `Pause ${track.name}` : `Play ${track.name}`}>
            {playing === track.name ? <Pause /> : <Play />}
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default function CalmClient() {
  const [showDialog, setShowDialog] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleActivityCompletion = async (activityType: string) => {
    setIsLoading(true);
    setShowDialog(true);
    try {
      const result = await calmingActivityEncouragement({ activityType });
      setEncouragement(result.encouragementMessage);
    } catch (e) {
      setEncouragement('Great job on taking time for yourself!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="music" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="music">
            <Music className="mr-2 h-4 w-4" /> Music
          </TabsTrigger>
          <TabsTrigger value="breathing">
            <Wind className="mr-2 h-4 w-4" /> Breathing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="music">
          <MusicPlayer onComplete={(activity) => handleActivityCompletion(activity)} />
        </TabsContent>
        <TabsContent value="breathing">
          <BreathingAnimation onComplete={() => handleActivityCompletion('breathing')} />
        </TabsContent>
      </Tabs>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity Complete!</DialogTitle>
            <DialogDescription className="pt-4 text-center text-lg">
              {isLoading ? (
                <div className="flex justify-center items-center h-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                </div>
              ) : (
                encouragement
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
