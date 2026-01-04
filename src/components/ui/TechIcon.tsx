import {
    SiReact, SiNextdotjs, SiTypescript, SiJavascript,
    SiPython, SiSpring, SiSpringboot,
    SiTailwindcss, SiNodedotjs, SiPostgresql, SiMysql,
    SiDocker, SiGit, SiGithub,
    SiHuggingface, SiOpenai, SiPytorch, SiTensorflow
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa6';
import { BsTerminal } from 'react-icons/bs';
import { IconType } from 'react-icons';

interface Props {
    tag: string;
    className?: string;
}

const ICON_MAP: Record<string, IconType> = {
    // Frontend
    'React': SiReact,
    'Next.js': SiNextdotjs,
    'TypeScript': SiTypescript,
    'JavaScript': SiJavascript,
    'Tailwind': SiTailwindcss,
    'TailwindCSS': SiTailwindcss,

    // Backend
    'Node.js': SiNodedotjs,
    'Python': SiPython,
    'Java': FaJava,
    'Spring': SiSpring,
    'Spring Boot': SiSpringboot,

    // DB & Infra
    'PostgreSQL': SiPostgresql,
    'MySQL': SiMysql,
    'Docker': SiDocker,
    'AWS': FaAws,

    // AI & ML
    'AI': SiOpenai,
    'Machine Learning': SiTensorflow,
    'Hugging Face': SiHuggingface,
    'PyTorch': SiPytorch,
    'Prompt Engineering': BsTerminal,

    // Tools
    'Git': SiGit,
    'GitHub': SiGithub,
};

export default function TechIcon({ tag, className }: Props) {
    // Case-insensitive lookup attempt if direct match fails
    let Icon = ICON_MAP[tag];

    if (!Icon) {
        const normalize = (s: string) => s.toLowerCase().replace(/[\s\.]/g, '');
        const foundKey = Object.keys(ICON_MAP).find(k => normalize(k) === normalize(tag));
        if (foundKey) {
            Icon = ICON_MAP[foundKey];
        }
    }

    // Fallback: Just render text badge if no icon found
    if (!Icon) {
        return (
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium
            bg-neutral-100 text-neutral-700 border border-neutral-200
            dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700
            transition-colors">
                {tag}
            </span>
        );
    }

    return (
        <div className={`group/icon relative flex items-center justify-center p-1.5 rounded-md 
        bg-neutral-100 dark:bg-neutral-800 
        text-neutral-600 dark:text-neutral-400
        hover:bg-blue-100 dark:hover:bg-blue-900/30 
        hover:text-blue-600 dark:hover:text-blue-400 
        transition-colors duration-200 ${className}`}
            title={tag}
        >
            <Icon size={18} />
            {/* Tooltip on hover */}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 
        bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 
        text-[10px] rounded opacity-0 group-hover/icon:opacity-100 
        transition-opacity pointer-events-none whitespace-nowrap z-20">
                {tag}
            </span>
        </div>
    );
}
