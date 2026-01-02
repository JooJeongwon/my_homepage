# 영화 리뷰 및 시청 인증 서비스

> 한줄 요약: Spring Boot, FastAPI, PHP 등 다양한 언어(Polyglot)로 구현된 마이크로서비스들을 Docker 컨테이너로 오케스트레이션하고, Spring Cloud Gateway를 통해 단일 진입점을 구축한 MSA 기반 웹 플랫폼입니다.
> 

## 1. 프로젝트 배경 및 목표 (Background & Objectives)

모놀리식 아키텍처의 한계를 극복하고, 서비스별 특성에 맞는 최적의 언어를 선택하여 개발 생산성과 유지보수성을 높이는 것을 목표로 했습니다.

- **Polyglot Architecture:** 빠른 이미지 처리가 필요한 서비스는 Python, 레거시 환경을 가정한 서비스는 PHP, 핵심 비즈니스 로직은 Java로 구현하여 이기종 언어 간의 통합 운영 경험을 쌓았습니다.
- **Database per Service:** 서비스 간 결합도(Coupling)를 낮추기 위해 각 마이크로서비스가 독립적인 데이터베이스를 소유하는 패턴을 적용했습니다.

## 2. 시스템 아키텍처 및 기술 스택 (Architecture & Tech Stack)

### Infrastructure & DevOps

- **Containerization:** Docker, Docker Compose (네트워크 격리 및 볼륨 관리)
- **Networking:** Bridge Network를 통한 컨테이너 간 내부 통신, 포트 포워딩을 통한 외부 노출 제어

### Backend (Microservices)

- **Gateway Service (Edge Server):**
    - Stack: Java 17, Spring Cloud Gateway, Netty
    - Role: 라우팅, 로드밸런싱, 인증(Auth) 오프로딩, CORS 처리
- **Core Domain Services (Movie, Review, Badge API):**
    - Stack: Java 17, Spring Boot, Spring Data JPA
    - Role: 비즈니스 로직 처리, 배치 작업(Batch Processing) 수행
- **Verification Service:**
    - Stack: Python 3.9, FastAPI, SQLAlchemy
    - Role: 비동기 파일 업로드 처리, 이미지 관리, 관리자 승인 로직
- **User Service (Legacy Simulation):**
    - Stack: PHP 8.0 (Apache)
    - Role: 사용자 인증 및 세션 관리

### Data & Persistence

- **RDBMS:** MySQL 8.0 (서비스별 독립 스키마: `user-mysql`, `review-mysql` 등)
- **NoSQL:** Redis (분산 세션 저장소 및 캐싱)

## 3. 핵심 기술적 도전 및 해결 과정 (Technical Challenges & Solutions)

### 3.1. API Gateway를 활용한 라우팅 최적화 및 보안 강화

- **Challenge:** 프론트엔드에서 각기 다른 포트(8000, 8080, 8089 등)를 사용하는 여러 마이크로서비스를 직접 호출할 경우, CORS 문제와 보안 취약점이 발생했습니다.
- **Solution:** **Spring Cloud Gateway**를 도입하여 모든 요청을 `9000`번 포트로 단일화했습니다.
    - **RewritePath 필터:** `/api/verification/**`으로 들어온 요청을 내부 서비스인 `http://verificationapi:8000/api/**`로 매핑하면서 경로를 재작성하여, 내부 토폴로지를 외부에 숨겼습니다.
    - **Global CORS:** Gateway 레벨에서 `Access-Control-Allow-Origin` 등을 중앙 집중적으로 관리하여 서비스별 중복 설정을 제거했습니다.

### 3.2. Polyglot 환경에서의 서비스 간 통신 및 데이터 무결성

- **Challenge:** Java 기반의 `Review Service`가 Python 기반의 `Verification Service`의 데이터를 참조해야 했고, HTTP 통신 간 인증이 필요했습니다.
- **Solution:** RESTful API 통신과 **헤더 기반의 보안 핸드쉐이크**를 구현했습니다.
    - Gateway를 거치지 않는 내부 서비스 간 통신(Inter-service communication) 시, `X-API-KEY` 헤더에 환경 변수로 주입된 `INTERNAL_API_KEY`를 실어 보내어 신뢰할 수 있는 트래픽임을 검증했습니다.
    - 데이터베이스를 직접 공유(Shared DB)하지 않고, 반드시 API를 통해서만 데이터를 주고받는 'API Composition' 패턴을 준수했습니다.

### 3.3. 비동기 배치 처리를 통한 대용량 데이터 분석 (Eventual Consistency)

- **Challenge:** 사용자의 모든 활동(리뷰, 시청 인증)을 실시간으로 분석하여 '칭호(Badge)'를 부여하는 것은 DB에 과도한 부하를 줄 수 있었습니다.
- **Solution:** **Spring Scheduler**와 **@Async**를 활용한 비동기 배치 시스템을 구축했습니다.
    - 트래픽이 적은 새벽 4시(`cron = "0 0 4 * * *"`)에 배치가 실행되도록 스케줄링했습니다.
    - `Verification API`와 `Movie API`로부터 필요한 데이터를 수집(Aggregation)한 후, 메모리 상에서 로직을 수행하고 결과만 DB에 저장함으로써 트랜잭션 범위를 최적화했습니다.

### 3.4. Python FastAPI를 활용한 고성능 파일 처리

- **Challenge:** 이미지 업로드는 I/O Blocking이 빈번한 작업으로, 동기식 처리 시 스레드 점유율이 높아지는 문제가 있었습니다.
- **Solution:** Python의 **FastAPI(ASGI)**를 도입하여 비동기(`async def`) 방식으로 파일을 처리했습니다.
    - `shutil.copyfileobj`를 사용하여 메모리 사용량을 최소화하며 디스크에 스트림 방식으로 파일을 저장했습니다.
    - 업로드된 파일은 Docker Volume(`verification-uploads`)에 영구 저장하여 컨테이너가 재시작되어도 데이터가 유실되지 않도록 설계했습니다.

## 4. 트러블 슈팅 (Troubleshooting)

- **문제:** Docker Compose 환경에서 컨테이너 실행 순서 문제로 인해, DB가 구동되기 전에 API 서버가 시작되어 연결 오류(Connection Refused) 발생.
- **해결:** `depends_on` 옵션을 사용하여 서비스 의존성을 정의하고, 애플리케이션 레벨(JPA/SQLAlchemy)에서 DB 접속 재시도 로직을 보강하거나 `restart: on-failure` 정책을 적용하여 안정성을 확보했습니다.
- **문제:** 이미지 파일명 중복으로 인한 덮어쓰기 문제.
- **해결:** 파일 저장 시 `userId_movieId_filename` 형식의 네이밍 컨벤션을 적용하여 충돌 가능성을 최소화했습니다.

## 5. 프로젝트 성과 및 배운 점 (Outcomes & Insights)

- **MSA의 복잡성 이해:** 서비스 분리로 인해 배포 유연성은 얻었으나, 트랜잭션 관리와 로깅 통합의 어려움을 체감했습니다. 이를 해결하기 위해 추후 Kafka와 같은 메시지 큐 도입을 고려하게 되었습니다.
- **컨테이너 오케스트레이션:** Docker Compose를 통해 'Infrastructure as Code(IaC)'의 기초를 다졌으며, 향후 Kubernetes 환경으로의 마이그레이션을 고려한 무상태(Stateless) 아키텍처 설계를 지향했습니다.
- **언어별 장단점 파악:** 파일/데이터 처리에는 Python이, 정적 타입과 구조적인 아키텍처가 필요한 도메인 로직에는 Java Spring이 적합함을 실제 개발을 통해 확인했습니다.