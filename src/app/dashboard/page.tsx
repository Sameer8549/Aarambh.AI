
'use client';

import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import {
  BarChart,
  LineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AnonymousInsight } from '@/types';
import { format, subDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const stressTopicsConfig = {
  mentions: { label: 'Mentions' },
  Exams: { label: 'Exams', color: 'hsl(var(--chart-1))' },
  Family: { label: 'Family', color: 'hsl(var(--chart-2))' },
  Relationships: { label: 'Relationships', color: 'hsl(var(--chart-3))' },
  Future: { label: 'Future', color: 'hsl(var(--chart-4))' },
  Loneliness: { label: 'Loneliness', color: 'hsl(var(--chart-5))' },
  Gratitude: { label: 'Gratitude', color: 'hsl(var(--chart-1))' },
  Stress: { label: 'Stress', color: 'hsl(var(--chart-2))' },
  Confidence: { label: 'Confidence', color: 'hsl(var(--chart-3))' },
  Sleep: { label: 'Sleep', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

const moodTrendsConfig = {
  moodScore: {
    label: 'Mood Score',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const languageConfig = {
    en: { label: 'English', color: 'hsl(var(--chart-1))' },
    hi: { label: 'Hindi', color: 'hsl(var(--chart-2))' },
    hinglish: { label: 'Hinglish', color: 'hsl(var(--chart-3))' },
    kn: { label: 'Kannada', color: 'hsl(var(--chart-4))' },
    ta: { label: 'Tamil', color: 'hsl(var(--chart-5))' },
    bn: { label: 'Bengali', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;


export default function DashboardPage() {
  const { t } = useLanguage();
  const [stressTopicsData, setStressTopicsData] = useState<any[]>([]);
  const [moodTrendsData, setMoodTrendsData] = useState<any[]>([]);
  const [languageData, setLanguageData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const insightsRef = collection(db, 'anonymous-insights');
    const sevenDaysAgo = Timestamp.fromDate(subDays(new Date(), 7));
    const q = query(insightsRef, where('timestamp', '>=', sevenDaysAgo));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const insights: AnonymousInsight[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        insights.push({
          id: doc.id,
          sentiment: data.sentiment,
          topics: data.topics,
          language: data.language,
          source: data.source,
          timestamp: data.timestamp.seconds,
        });
      });

      // Process data for Stress Topics Chart
      const topicCounts = insights.flatMap(i => i.topics).reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const formattedStressData = Object.entries(topicCounts)
        .map(([topic, mentions]) => ({ topic, mentions, fill: `var(--color-${topic})` }))
        .sort((a, b) => b.mentions - a.mentions);
      setStressTopicsData(formattedStressData);

      // Process data for Language Usage Chart
      const langCounts = insights.reduce((acc, insight) => {
        acc[insight.language] = (acc[insight.language] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const formattedLangData = Object.entries(langCounts)
        .map(([name, value]) => ({ name, value, fill: `var(--color-${name.toLowerCase()})` }))
        .sort((a, b) => b.value - a.value);
      setLanguageData(formattedLangData);
      
      // Process data for Mood Trends Chart
       const sentimentToScore = { 'Positive': 5, 'Neutral': 3, 'Negative': 1 };
       const trendDataByDay = insights.reduce((acc, insight) => {
         const day = format(new Date(insight.timestamp * 1000), 'MMM d');
         if (!acc[day]) {
           acc[day] = { scores: [], count: 0 };
         }
         acc[day].scores.push(sentimentToScore[insight.sentiment]);
         acc[day].count += 1;
         return acc;
       }, {} as Record<string, { scores: number[], count: number }>);
 
       const formattedTrendData = Object.entries(trendDataByDay).map(([day, data]) => ({
         month: day,
         moodScore: data.scores.reduce((a, b) => a + b, 0) / data.count,
       })).sort((a,b) => new Date(a.month) > new Date(b.month) ? 1 : -1);
       setMoodTrendsData(formattedTrendData);


      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          {t('dashboard.title')}
        </h1>
        <p className="text-md md:text-lg text-muted-foreground mt-2">
          {t('dashboard.subtitle')}
        </p>
      </header>

      <Alert variant="default" className="bg-secondary/50">
        <ShieldCheck className="h-5 w-5" />
        <AlertTitle className="font-bold">{t('dashboard.privacyTitle')}</AlertTitle>
        <AlertDescription>
         {t('dashboard.privacyDescription')}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              {t('dashboard.stressTopicsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-[350px] w-full" />
            ) : (
                <ChartContainer config={stressTopicsConfig} className="min-h-[350px] w-full">
                <BarChart accessibilityLayer data={stressTopicsData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="topic"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    />
                    <YAxis label={{ value: t('dashboard.stressTopicsYLabel'), angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Bar dataKey="mentions" radius={4} />
                </BarChart>
                </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5" />
               {t('dashboard.moodTrendsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
            ) : (
                 <ChartContainer config={moodTrendsConfig} className="min-h-[300px] w-full">
                    <LineChart accessibilityLayer data={moodTrendsData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        />
                        <YAxis domain={[1, 5]} label={{ value: t('dashboard.moodTrendsYLabel'), angle: -90, position: 'insideLeft' }}/>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line
                        dataKey="moodScore"
                        type="monotone"
                        stroke="var(--color-moodScore)"
                        strokeWidth={2}
                        dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              {t('dashboard.languageUseTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="mx-auto aspect-square max-h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                </div>
            ) : (
                <ChartContainer
                    config={languageConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <RechartsPieChart>
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={languageData} dataKey="value" nameKey="name" innerRadius={60} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                        >
                        {languageData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </RechartsPieChart>
                </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
