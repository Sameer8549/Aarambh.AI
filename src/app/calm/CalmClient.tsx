'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, Wind, Loader2, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { calmingActivityEncouragement } from '@/ai/flows/calming-activity-encouragement';
import { cn } from '@/lib/utils';
import { getResourcesByType, IndianResourceType } from '@/ai/resources';
import type { Resource } from '@/types';


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
  const [musicTracks, setMusicTracks] = useState<Resource[]>([]);

  useEffect(() => {
    const tracks = getResourcesByType([IndianResourceType.Music]);
    setMusicTracks(tracks);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {musicTracks.map((track) => (
        <a
          href={track.link}
          key={track.title}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onComplete(track.title)}
          className="block group"
        >
          <Card className="flex items-center justify-between p-4 group-hover:bg-secondary/50 transition-colors" data-ai-hint={track.keywords?.join(' ')}>
            <div className="flex items-center gap-4">
              <Music className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">{track.title}</p>
                <p className="text-sm text-muted-foreground">{track.description}</p>
              </div>
            </div>
            <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
          </Card>
        </a>
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
          <TabsTrigger value="music" aria-label="Music tab">
            <Music className="mr-2 h-4 w-4" /> Music
          </TabsTrigger>
          <TabsTrigger value="breathing" aria-label="Breathing tab">
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
            <DialogTitle>Great Job!</DialogTitle>
          </DialogHeader>
          <div className="pt-4 text-center text-lg">
            {isLoading ? (
              <div className="flex justify-center items-center h-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <p>{encouragement}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
