'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Job {
    id: number | string;
    title: string;
    company?: string;
    location?: string;
    type?: string;        // ← from Jooble
    source?: string;
    updated?: string;     // ← from Jooble
    snippet?: string;     // ← from Jooble
    link: string;         // ← from Jooble
}

interface JobCardProps {
    job: Job;
}

export function JobCard({ job }: JobCardProps) {
    // 🔹 normalize API data → UI-friendly variables
    const company = job.company || 'Unknown company';
    const location = job.location || 'India';
    const jobType = job.type || 'Not specified';
    const postedDate = job.updated
        ? new Date(job.updated).toLocaleDateString()
        : 'Recently';

    const description = (job.snippet || '')
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/#+/g, '')
        .replace(/\r?\n|\r/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return (
        <article className="group rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                        {job.title}
                    </h2>
                    <p className="mt-1 text-base font-medium text-muted-foreground">
                        {company}
                    </p>
                </div>
                <Button
                    asChild
                    className="w-full sm:w-auto"
                    rel="noopener noreferrer"
                >
                    <a href={job.link} target="_blank">
                        Apply
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </div>

            {/* Meta Information */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{location}</span>
                <span>•</span>
                <span>{jobType}</span>
                <span>•</span>
                <span className="text-xs">{postedDate}</span>
            </div>

            {/* Description */}
            <p className="mt-4 line-clamp-3--- text-sm text-foreground/80">
                {description}
            </p>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {job.source || 'Jooble'}
                </span>
            </div>
        </article>
    );
}
