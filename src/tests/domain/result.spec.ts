import { describe, it, expect } from 'vitest';
import { Result } from '@/domain/common/result';

describe('Result Pattern', () => {
    it('Success 인스턴스는 value를 올바르게 유지하고 getOrElse에서 해당 값을 반환해야 한다.', () => {
        const result = Result.ok<number>(42);
        
        expect(result.isSuccess).toBe(true);
        expect(result.isFailure).toBe(false);
        if (result.isSuccess) {
            expect(result.value).toBe(42);
        }
        expect(result.getOrElse(0)).toBe(42);
    });

    it('Failure 인스턴스는 error를 올바르게 유지하고 getOrElse에서 fallback 값을 반환해야 한다.', () => {
        const result = Result.fail<number>(new Error('Test Error'));

        expect(result.isSuccess).toBe(false);
        expect(result.isFailure).toBe(true);
        if (result.isFailure) {
            expect(result.error.message).toBe('Test Error');
        }
        expect(result.getOrElse(100)).toBe(100);
    });

    it('wrapAsync는 비동기 함수 성공 시 Success를 반환해야 한다.', async () => {
        const result = await Result.wrapAsync(async () => 'Hello World');
        
        expect(result.isSuccess).toBe(true);
        expect(result.getOrElse('')).toBe('Hello World');
    });

    it('wrapAsync는 비동기 함수 예외 발생 시 Failure를 반환해야 한다.', async () => {
        const result = await Result.wrapAsync(async () => {
            throw new Error('Async Failure');
        });

        expect(result.isFailure).toBe(true);
        if (result.isFailure) {
            expect(result.error.message).toBe('Async Failure');
        }
    });
});
