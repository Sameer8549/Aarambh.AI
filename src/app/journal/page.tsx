import JournalClient from "./JournalClient";

export default function JournalPage() {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Gratitude Journal</h1>
                <p className="text-lg text-muted-foreground mt-2">Take a moment to reflect on what you're thankful for.</p>
            </header>
            <JournalClient />
        </div>
    )
}
