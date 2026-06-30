import { FilterProjectsUseCase } from '@/application/use-cases/project/filter-projects.use-case';

export function getFilterProjectsUseCase(): FilterProjectsUseCase {
    return new FilterProjectsUseCase();
}
