import { Github, Globe } from 'lucide-react'; // 아이콘
import Link from 'next/link';

// 나중에는 이것도 MDX나 DB로 빼겠지만, 일단은 배열로 관리 (하드코딩)
const PROJECTS = [
    {
        title: "AI 기반 데이팅 코칭 봇",
        description: "디지털콘텐츠기획 수업 과제로 진행한 AI 챗봇 서비스 기획. LLM을 활용해 연애 상담을 해주는 프로토타입.",
        tags: ["Planning", "AI", "Prompt Engineering"],
        links: {
            github: "https://github.com", // 본인 깃허브 링크로 수정
            demo: "https://jwjoo.com",
        }
    },
    {
        title: "유해 정보 필터링 서비스",
        description: "기계학습프로그래밍 기말 프로젝트. Hugging Face 모델을 튜닝하여 청소년에게 유해한 텍스트를 탐지 및 차단.",
        tags: ["Python", "Machine Learning", "Hugging Face"],
        links: {
            github: "https://github.com",
        }
    },
    {
        title: "ICMP Flooding 방어 실습",
        description: "정보보호개론 과제. IPTables를 활용하여 DDoS 공격을 탐지하고 패킷을 방어하는 보안 실습 리포트.",
        tags: ["Network Security", "Linux", "IPTables"],
        links: {
            demo: "https://jwjoo.com",
        }
    }
];

export default function ProjectsPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-8">Projects 🛠️</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {PROJECTS.map((project, index) => (
                    <article key={index} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 min-h-[60px]">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-auto">
                            {project.links.github && (
                                <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-black dark:text-slate-400 dark:hover:text-white transition-colors"
                                >
                                    <Github className="w-4 h-4" /> Code
                                </a>
                            )}
                            {project.links.demo && (
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-sm text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                >
                                    <Globe className="w-4 h-4" /> Demo
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}