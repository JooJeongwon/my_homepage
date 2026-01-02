import GithubSlugger from 'github-slugger';

export type Heading = {
    id: string;
    text: string;
    level: number;
};

export function extractHeadings(content: string): Heading[] {
    const slugger = new GithubSlugger();
    // Match lines starting with #, ##, or ### followed by a space
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const headings: Heading[] = [];

    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        // Basic markup removal since we want plain text for the TOC
        const text = match[2]
            .trim()
            .replace(/\*\*/g, '')      // Remove bold
            .replace(/`/g, '')         // Remove code ticks
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // Remove links, keep text

        const id = slugger.slug(text);

        headings.push({ id, text, level });
    }

    return headings;
}
