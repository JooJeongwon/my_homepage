import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { CodeBlock } from './CodeBlock';

interface MdxRendererProps {
    source: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    components?: Record<string, React.ComponentType<any>>;
}

const defaultComponents = {
    pre: CodeBlock,
};

/**
 * 일관된 MDX 렌더링 설정 및 타이포그래피(Tailwind Typography) 스타일을 캡슐화한 공통 컴포넌트
 */
export function MdxRenderer({ source, components }: MdxRendererProps) {
    return (
        <div
            className="prose dark:prose-invert max-w-none break-words
                /* 기본 헤딩 및 본문 타이포그래피 톤 통일 */
                prose-headings:font-bold prose-headings:text-neutral-800 dark:prose-headings:text-neutral-200
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6
                prose-p:text-neutral-800 dark:prose-p:text-neutral-200 prose-p:leading-relaxed
                prose-li:text-neutral-800 dark:prose-li:text-neutral-200
                prose-a:text-neutral-600 dark:prose-a:text-neutral-400 prose-a:no-underline hover:prose-a:text-neutral-900 dark:hover:prose-a:text-neutral-100 prose-a:transition-colors
                prose-hr:border-neutral-200 dark:prose-hr:border-neutral-800
                
                /* 코드 블록(pre) 스타일링 */
                prose-pre:bg-white dark:prose-pre:bg-neutral-900/50
                prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-neutral-800
                prose-pre:rounded-2xl
                prose-pre:text-neutral-800 dark:prose-pre:text-neutral-200
                
                /* 인라인 코드(code) 스타일링 */
                prose-code:text-neutral-800 dark:prose-code:text-neutral-200
                prose-code:bg-neutral-100 dark:prose-code:bg-neutral-800
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                prose-code:before:content-none prose-code:after:content-none
                prose-code:font-normal
                prose-code:border prose-code:border-neutral-200 dark:prose-code:border-neutral-700
                
                /* 코드 블록(pre) 내부 code 태그 중복 배경 제거 */
                [&_pre_code]:!bg-transparent [&_pre_code]:!p-0 [&_pre_code]:!border-0 [&_pre_code]:!text-inherit"
        >
            <MDXRemote
                source={source}
                options={{
                    mdxOptions: {
                        rehypePlugins: [rehypeHighlight, rehypeSlug],
                    },
                }}
                components={{
                    ...defaultComponents,
                    ...components,
                }}
            />
        </div>
    );
}
