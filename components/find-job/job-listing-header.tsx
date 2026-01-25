interface JobListingHeaderProps {
    headline: string;
    subheading: string;
    totalCount: number;
}

export function JobListingHeader({
    headline,
    subheading,
    totalCount,
}: JobListingHeaderProps) {
    return (
        <header className="text-center">
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {headline}
            </h1>
            <p className="mt-4 text-md text-muted-foreground sm:text-lg">
                {subheading}
            </p>
            <div className="mt-6 inline-block rounded-full bg-muted px-4 py-2">
                <p className="text-sm font-medium text-foreground">
                    {totalCount} fresh jobs found
                </p>
            </div>
        </header>
    );
}
  