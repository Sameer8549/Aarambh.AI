
'use client';
import { useLanguage } from "@/contexts/LanguageContext";
import CalmClient from "./CalmClient";

export default function CalmPage() {
    const { t } = useLanguage();
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold font-headline">{t('calm.title')}</h1>
                <p className="text-md md:text-lg text-muted-foreground mt-2">{t('calm.subtitle')}</p>
            </header>
            <CalmClient />
        </div>
    )
}
