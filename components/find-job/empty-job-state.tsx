import { Search } from 'lucide-react';

interface EmptyJobStateProps {
    message: string;
}

export function EmptyJobState({ message }: EmptyJobStateProps) {
    return (
        <div className="mt-16 flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16 px-4 text-center">
            <div className="rounded-full bg-muted p-4">
                <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-foreground">No jobs found</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
        </div>
    );
}
