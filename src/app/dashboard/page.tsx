
'use client';

import { BarChart, LineChart, PieChart, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabel,
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data simulating aggregated insights from BigQuery
const stressTopicsData = [
  { topic: 'Exams', mentions: 450, fill: 'hsl(var(--chart-1))' },
  { topic: 'Family', mentions: 300, fill: 'hsl(var(--chart-2))' },
  { topic: 'Relationships', mentions: 200, fill: 'hsl(var(--chart-3))' },
  { topic: 'Future', mentions: 278, fill: 'hsl(var(--chart-4))' },
  { topic: 'Loneliness', mentions: 189, fill: 'hsl(var(--chart-5))' },
];

const moodTrendsData = [
  { month: 'Jan', moodScore: 3.5 },
  { month: 'Feb', moodScore: 3.2 },
  { month: 'Mar', moodScore: 2.8 }, // Exam stress dip
  { month: 'Apr', moodScore: 2.9 },
  { month: 'May', moodScore: 3.8 }, // Holidays
  { month: 'Jun', moodScore: 3.6 },
];

const languageData = [
  { name: 'English', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Hinglish', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Hindi', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: 'Kannada', value: 100, fill: 'hsl(var(--chart-4))' },
];

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
              <BarChart className="h-5 w-5" />
              {t('dashboard.stressTopicsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={stressTopicsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis label={{ value: t('dashboard.stressTopicsYLabel'), angle: -90, position: 'insideLeft' }} />
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))'
                    }}
                />
                <Bar dataKey="mentions" radius={[4, 4, 0, 0]}>
                   {stressTopicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
               {t('dashboard.moodTrendsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={moodTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[1, 5]} label={{ value: t('dashboard.moodTrendsYLabel'), angle: -90, position: 'insideLeft' }}/>
                <Tooltip
                     contentStyle={{
                        background: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))'
                    }}
                 />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="moodScore"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              {t('dashboard.languageUseTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                     contentStyle={{
                        background: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))'
                    }}
                />
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={110}
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend iconSize={12} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
