
'use client';
import { useLanguage } from "@/contexts/LanguageContext";
import JournalClient from "./JournalClient";

export default function JournalPage() {
    const { t } = useLanguage();
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">{t('journal.title')}</h1>
                <p className="text-md md:text-lg text-muted-foreground mt-2">{t('journal.subtitle')}</p>
            </header>
            <JournalClient />
        </div>
    )
}
