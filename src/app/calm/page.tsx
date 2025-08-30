import CalmClient from "./CalmClient";

export default function CalmPage() {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold font-headline">Calming Activities</h1>
                <p className="text-lg text-muted-foreground mt-2">Find a moment of peace with our curated activities.</p>
            </header>
            <CalmClient />
        </div>
    )
}
