
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Pause, Wind, ExternalLink, Volume2, VolumeX } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { calmingActivityEncouragement } from '@/ai/flows/calming-activity-encouragement';
import { cn } from '@/lib/utils';
import { getResourcesByType, ResourceTypeEnum } from '@/ai/resources';
import type { Resource } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import EncouragementDialog from './EncouragementDialog';
import type { Language } from '@/types';

type BreathingTechnique = 'default' | 'box' | '4-7-8';

const BreathingAnimation = ({ onComplete, technique, t, language }: { onComplete: () => void, technique: BreathingTechnique, t: (key: string) => string, language: Language }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [text, setText] = useState(t('breathing.getReady'));
  const [isMuted, setIsMuted] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  const breathingTechniques = {
    default: {
      name: t('breathing.default.name'),
      description: t('breathing.default.description'),
      cycle: [
        { text: t('breathing.breatheIn'), duration: 4000 },
        { text: t('breathing.hold'), duration: 7000 },
        { text: t('breathing.breatheOut'), duration: 8000 },
      ],
    },
    box: {
      name: t('breathing.box.name'),
      description: t('breathing.box.description'),
      cycle: [
        { text: t('breathing.breatheIn'), duration: 4000 },
        { text: t('breathing.hold'), duration: 4000 },
        { text: t('breathing.breatheOut'), duration: 4000 },
        { text: t('breathing.hold'), duration: 4000 },
      ],
    },
    '4-7-8': {
      name: t('breathing.4-7-8.name'),
      description: t('breathing.4-7-8.description'),
      cycle: [
        { text: t('breathing.breatheIn'), duration: 4000 },
        { text: t('breathing.hold'), duration: 7000 },
        { text: t('breathing.breatheOut'), duration: 8000 },
      ],
    },
  };
  
  const { cycle } = breathingTechniques[technique];

   // Effect to select a friendly voice based on the current language
  useEffect(() => {
    const getVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Filter for voices matching the current app language
            const languageVoices = voices.filter(v => v.lang.startsWith(language));
            const englishVoices = voices.filter(v => v.lang.startsWith('en'));

            // Prioritize high-quality, "Google" voices if available for the selected language
            const highQualityLanguageVoices = languageVoices.filter(v => v.name.includes('Google'));
            
            // Fallback for English voices
            const friendlyEnglishVoices = englishVoices.filter(v => v.lang.startsWith('en') && v.name.includes('Google') && v.name.includes('Female'));
            const femaleEnglishVoices = englishVoices.filter(v => v.lang.startsWith('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Karen')));

            // Set the selected voice based on priority
            setSelectedVoice(
                highQualityLanguageVoices[0] ||
                languageVoices[0] ||
                friendlyEnglishVoices[0] ||
                femaleEnglishVoices[0] ||
                englishVoices[0] ||
                voices[0]
            );
        }
      }
    };
    
    getVoices();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
  }, [language]);

  // Effect for speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window && isBreathing && !isMuted) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      // Speak the new text
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.pitch = 1;
        utterance.rate = 1;
      }
      window.speechSynthesis.speak(utterance);
    }
  }, [text, isBreathing, isMuted, selectedVoice]);
  
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
     if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setText(t('breathing.greatJob'));
    onComplete();
  };

  useEffect(() => {
    setIsBreathing(false);
    clearTimeout(timerRef.current);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setText(t('breathing.getReady'));
  }, [technique, t]);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, []);

  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center h-96 relative">
       <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
      </Button>
      <div className="relative flex items-center justify-center w-48 h-48 mb-6">
        <div
          className={cn(
            'absolute w-full h-full bg-secondary rounded-full',
            isBreathing && text === t('breathing.breatheIn') && 'animate-[pulse_4s_ease-in-out_infinite]',
            isBreathing && text === t('breathing.breatheOut') && 'animate-[pulse_8s_ease-in-out_infinite_reverse]'
          )}
          style={{ animationDuration: isBreathing && text === t('breathing.breatheIn') ? `${cycle[0].duration}ms` : `${cycle.find(c => c.text === t('breathing.breatheOut'))?.duration || 8000}ms`}}
        ></div>
         <div className="absolute w-24 h-24 bg-primary/20 rounded-full"></div>
        <p className="z-10 text-2xl font-bold font-headline text-primary-foreground bg-primary p-4 rounded-full">
          {text}
        </p>
      </div>
      {!isBreathing ? (
        <Button onClick={startBreathingCycle} aria-label={t('breathing.start')}>
          <Play className="mr-2 h-4 w-4" /> {t('breathing.start')}
        </Button>
      ) : (
        <Button onClick={stopBreathingCycle} variant="secondary" aria-label={t('breathing.stop')}>
          <Pause className="mr-2 h-4 w-4" /> {t('breathing.stop')}
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
    const tracks = getResourcesByType([ResourceTypeEnum.Music]);
    setMusicTracks(tracks);
  }, []);

  function constructSearchUrl(item: Resource): string {
    return `https://open.spotify.com/search/${encodeURIComponent(item.link)}`;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {musicTracks.map((track) => (
        <a
          href={constructSearchUrl(track)}
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

const BreathingPage = ({onComplete, language}: {onComplete: (activity: string) => void, language: Language}) => {
  const [technique, setTechnique] = useState<BreathingTechnique>('default');
  const { t } = useLanguage();
  
  const breathingTechniques = {
    default: {
      name: t('breathing.default.name'),
      description: t('breathing.default.description'),
    },
    box: {
      name: t('breathing.box.name'),
      description: t('breathing.box.description'),
    },
    '4-7-8': {
      name: t('breathing.4-7-8.name'),
      description: t('breathing.4-7-8.description'),
    },
  };

  const selectedTechnique = breathingTechniques[technique];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('breathing.chooseTechnique')}</CardTitle>
              <CardDescription>{t('breathing.chooseDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={technique} onValueChange={(val) => setTechnique(val as BreathingTechnique)}>
                {Object.entries(breathingTechniques).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted has-[[data-state=checked]]:bg-secondary">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="font-medium cursor-pointer">
                            <span className='block'>{value.name}</span>
                            <span className="font-normal text-sm text-muted-foreground">{value.description}</span>
                        </Label>
                    </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <BreathingAnimation onComplete={() => onComplete(selectedTechnique.name)} technique={technique} t={t} language={language} />
        </div>

    </div>
  )

}


export default function CalmClient() {
  const [showDialog, setShowDialog] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleActivityCompletion = async (activityType: string) => {
    setIsLoading(true);
    setShowDialog(true);
    try {
      const result = await calmingActivityEncouragement({ activityType });
      setEncouragement(result.encouragementMessage);
    } catch (e) {
      setEncouragement(t('calm.defaultEncouragement'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="music" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="music" aria-label={t('calm.musicTab')}>
            <Music className="mr-2 h-4 w-4" /> {t('calm.music')}
          </TabsTrigger>
          <TabsTrigger value="breathing" aria-label={t('calm.breathingTab')}>
            <Wind className="mr-2 h-4 w-4" /> {t('calm.breathing')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="music">
          <MusicPlayer onComplete={(activity) => handleActivityCompletion(activity)} />
        </TabsContent>
        <TabsContent value="breathing">
           <BreathingPage onComplete={(activity) => handleActivityCompletion(activity)} language={language} />
        </TabsContent>
      </Tabs>
      
      <EncouragementDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        isLoading={isLoading}
        encouragement={encouragement}
        t={t}
      />
    </>
  );
}
