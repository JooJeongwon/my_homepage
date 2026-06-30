import { FilterPostsUseCase } from '@/application/use-cases/post/filter-posts.use-case';

export function getFilterPostsUseCase(): FilterPostsUseCase {
    return new FilterPostsUseCase();
}
