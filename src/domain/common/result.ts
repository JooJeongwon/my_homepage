/**
 * Domain-level Result Pattern Implementation
 * Hexagonal Architecture 환경에서 예외(Exception)를 throw하지 않고
 * 성공(Success)과 실패(Failure) 상태를 명시적인 타입으로 처리하도록 돕는 유틸리티입니다.
 */

export type Result<T, E = Error> = Success<T, E> | Failure<T, E>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Success<T, E> {
    readonly isSuccess = true as const;
    readonly isFailure = false as const;

    constructor(public readonly value: T) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getOrElse(fallback: T): T {
        return this.value;
    }
}

export class Failure<T, E> {
    readonly isSuccess = false as const;
    readonly isFailure = true as const;

    constructor(public readonly error: E) {}

    getOrElse(fallback: T): T {
        return fallback;
    }
}

export const Result = {
    ok<T, E = Error>(value: T): Result<T, E> {
        return new Success<T, E>(value);
    },

    fail<T, E = Error>(error: E): Result<T, E> {
        return new Failure<T, E>(error);
    },

    async wrapAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
        try {
            const data = await fn();
            return Result.ok(data);
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            return Result.fail(err);
        }
    },

    wrapSync<T>(fn: () => T): Result<T, Error> {
        try {
            const data = fn();
            return Result.ok(data);
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            return Result.fail(err);
        }
    }
};
