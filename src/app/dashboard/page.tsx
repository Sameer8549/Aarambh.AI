
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

// Mock data simulating aggregated insights from BigQuery
const stressTopicsData = [
  { topic: 'Exams', mentions: 450, fill: 'var(--color-exams)' },
  { topic: 'Family', mentions: 300, fill: 'var(--color-family)' },
  { topic: 'Relationships', mentions: 200, fill: 'var(--color-relationships)' },
  { topic: 'Future', mentions: 278, fill: 'var(--color-future)' },
  { topic: 'Loneliness', mentions: 189, fill: 'var(--color-loneliness)' },
];

const stressTopicsConfig = {
  mentions: {
    label: 'Mentions',
  },
  exams: {
    label: 'Exams',
    color: 'hsl(var(--chart-1))',
  },
  family: {
    label: 'Family',
    color: 'hsl(var(--chart-2))',
  },
  relationships: {
    label: 'Relationships',
    color: 'hsl(var(--chart-3))',
  },
  future: {
    label: 'Future',
    color: 'hsl(var(--chart-4))',
  },
  loneliness: {
    label: 'Loneliness',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

const moodTrendsData = [
  { month: 'Jan', moodScore: 3.5 },
  { month: 'Feb', moodScore: 3.2 },
  { month: 'Mar', moodScore: 2.8 }, // Exam stress dip
  { month: 'Apr', moodScore: 2.9 },
  { month: 'May', moodScore: 3.8 }, // Holidays
  { month: 'Jun', moodScore: 3.6 },
];

const moodTrendsConfig = {
  moodScore: {
    label: 'Mood Score',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const languageData = [
  { name: 'English', value: 400, fill: 'var(--color-english)' },
  { name: 'Hinglish', value: 300, fill: 'var(--color-hinglish)' },
  { name: 'Hindi', value: 200, fill: 'var(--color-hindi)' },
  { name: 'Kannada', value: 100, fill: 'var(--color-kannada)' },
];

const languageConfig = {
    english: { label: 'English', color: 'hsl(var(--chart-1))' },
    hinglish: { label: 'Hinglish', color: 'hsl(var(--chart-2))' },
    hindi: { label: 'Hindi', color: 'hsl(var(--chart-3))' },
    kannada: { label: 'Kannada', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;


export default function DashboardPage() {
  const { t } = useLanguage();

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
