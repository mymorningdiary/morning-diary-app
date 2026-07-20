<p align="center">
  <img src="./assets/images/img-text-logo.png" width="158" alt="아침일기 로고" />
</p>

# 아침일기

기상 직후 떠오르는 생각과 감정을 기록하고, 한 주의 감정 흐름을 분석한 AI 리포트 제공 다이어리 서비스

> 현재 앱 버전 `1.1.1`, OTA 호환성을 결정하는 runtime version `1.1.0`

## 주요 기능

- **온보딩과 인증**: 첫 방문 온보딩, 이메일 회원가입·OTP 인증·비밀번호 재설정, 카카오 로그인, iOS Apple 로그인
- **아침일기 작성**: 날짜 선택, 목표 글자 수 진행률, 입력 흐름에 반응하는 글쓰기 가이드, 첫 일기 완료 플로우
- **일기 관리**: 월별 캘린더, 주 단위 목록, 일기 상세 조회·수정·삭제
- **주간 리포트**: 한 주에 3회 이상 기록하면 일요일에 리포트 생성 가능, 감정 캘린더·핵심 키워드·무의식 인사이트·공감 문장 제공
- **개인 설정**: 글자 수 목표, 글쓰기 가이드 표시 여부, 푸시 알림과 알림 시간, 계정 관리
- **운영 기능**: Firebase Analytics·Crashlytics, 선택/강제 업데이트, development·preview·production 앱 분리, EAS Update

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| 앱 | React Native 0.81, React 19, Expo SDK 54, TypeScript |
| 라우팅 | Expo Router 6, React Navigation 7 |
| 서버 상태 | TanStack Query 5 |
| 클라이언트 상태 | Zustand 5, AsyncStorage, Expo SecureStore |
| API | Axios, access/refresh token interceptor |
| UI | React Native Reanimated, Gesture Handler, SVG, Expo Image, 커스텀 디자인 시스템 |
| 네이티브 연동 | Expo Notifications, Kakao SDK, Apple Authentication, Firebase Analytics·Crashlytics |
| 빌드·배포 | EAS Build, EAS Submit, EAS Update |
| 품질 도구 | ESLint, Prettier, Jest Expo preset, React Compiler |

## 프로젝트 구조

프로젝트는 Feature-Sliced Design의 계층 개념을 따른다. 상위 계층은 하위 계층을 조합하며, 화면과 도메인 로직을 분리한다.

```text
morning-diary-app/
├── assets/                 # 이미지, SVG 아이콘, 로컬 폰트
├── src/
│   ├── app/                # Expo Router 엔트리와 파일 기반 라우트
│   ├── pages/              # 화면 단위 UI와 화면 전용 상태 조합
│   ├── features/           # 사용자 행동 단위 기능
│   │   ├── auth/           # OTP·비밀번호 입력
│   │   ├── diary/          # 에디터·글쓰기 가이드·캘린더
│   │   ├── login/          # 이메일·카카오·Apple 로그인
│   │   ├── notification/   # 알림 권한·시간 설정
│   │   ├── onboarding/     # 첫 방문 상태
│   │   └── text-goal/      # 글자 수 목표 선택
│   ├── entities/           # 도메인별 API, Query hook, 타입
│   │   ├── auth/           # 인증·회원가입·로그아웃
│   │   ├── diary/          # 일기 CRUD
│   │   ├── home/           # 홈 월별 데이터
│   │   ├── report/         # 주간 리포트 생성·조회
│   │   ├── text-goal/      # 글자 수 목표
│   │   ├── user/           # 사용자와 설정
│   │   └── version/        # 앱 버전 정책
│   └── shared/             # API client, provider, 디자인 시스템, 공용 유틸
├── app.config.ts           # 앱 variant·네이티브 플러그인·OTA 설정
├── eas.json                # EAS 빌드·제출 프로필
├── babel.config.js         # 경로 별칭과 Expo Babel 설정
├── metro.config.js         # SVG transformer 설정
└── tsconfig.json           # strict TypeScript와 경로 별칭
```

계층 간 대표 데이터 흐름

```text
src/app route
  → pages 화면
    → features 사용자 행동
      → entities React Query hook
        → shared Axios client
          → REST API
```

서버 데이터는 TanStack Query로 캐시하고, 인증·온보딩·알림·글쓰기 가이드처럼 기기에 남아야 하는 상태는 Zustand persist로 관리한다. 인증 토큰은 네이티브에서 SecureStore, 웹에서 localStorage에 저장한다. 인증 API client는 동시에 발생한 `401` 응답을 하나의 refresh 요청으로 합친 뒤 원래 요청을 재시도한다.

## 라우팅

`src/app/_layout.tsx`에서 저장 상태가 복원될 때까지 스플래시를 유지하고, 방문 및 인증 상태에 따라 보호 라우트를 선택한다.

| 경로 | 역할 | 접근 조건 |
| --- | --- | --- |
| `/onboarding` | 첫 방문 온보딩 | 온보딩 미완료 |
| `/(login)` | 소셜·이메일 로그인 | 비로그인 |
| `/sign-up` | 이메일 회원가입 | 비로그인 |
| `/(reset-password)` | 비밀번호 재설정 | 비로그인 |
| `/(app)/(main)` | 홈·일기 목록·설정 탭 | 로그인 |
| `/(app)/diary-*` | 일기 작성·조회·수정 | 로그인 |
| `/(app)/report/[id]` | 주간 리포트 상세 | 로그인 |
| `/web-view` | 약관·개인정보처리방침 | 공통 |

앱 시작 시 서버의 버전 정책을 조회한다. 최소 지원 버전보다 낮으면 강제 업데이트 화면을, 최신 버전보다 낮으면 선택 업데이트 모달을 표시한다.

## 로컬 개발 환경

### 1. 사전 준비

- Node.js 20 LTS와 npm
- iOS 개발 시 Xcode와 CocoaPods
- Android 개발 시 Android Studio와 SDK
- EAS 작업 시 EAS CLI `16.17.4` 이상

Firebase, Kakao SDK 등 네이티브 모듈을 사용하므로 전체 기능 확인에는 **Expo Go가 아닌 development build** 필요

### 2. 의존성 설치

```bash
npm ci
```

### 3. 환경 변수 설정

루트에 `.env.local`을 생성한 뒤 다음 값을 설정한다.

```dotenv
APP_VARIANT=development
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_KAKAO_APP_KEY=your_kakao_native_app_key
```

| 변수 | 설명 |
| --- | --- |
| `APP_VARIANT` | `development`, `preview`, `production` 중 하나. 미지정 시 production 설정 사용 |
| `EXPO_PUBLIC_API_URL` | REST API base URL |
| `EXPO_PUBLIC_KAKAO_APP_KEY` | Kakao Native App Key |
| `GOOGLE_SERVICE_INFO_PLIST` | iOS Firebase 설정 파일 경로. 미지정 시 `./GoogleService-Info.plist` |
| `GOOGLE_SERVICES_JSON` | Android Firebase 설정 파일 경로. 미지정 시 `./google-services.json` |

네이티브 실행에 필요한 플랫폼별 Firebase 설정 파일

```text
GoogleService-Info.plist   # iOS
google-services.json      # Android
```

Git 제외 대상: `.env*.local`, Firebase 설정 파일, 스토어 제출용 서비스 계정 파일

실제 값이나 파일의 커밋 금지. EAS에서는 `GOOGLE_SERVICE_INFO_PLIST`, `GOOGLE_SERVICES_JSON`을 File 환경 변수로 등록 가능

### 4. 앱 실행

```bash
# development build 생성 및 실제 기기/시뮬레이터 실행
npm run ios
npm run android

# 이미 development build가 설치된 경우 Metro 시작
npm run start

# 웹 개발 서버 (네이티브 연동 기능 제한)
npm run web
```

`npm run ios`, `npm run android` 실행 시 `APP_VARIANT=development` 자동 적용

## 앱 Variant와 빌드

| Variant | 앱 이름 | Bundle ID / Package suffix | EAS channel | 용도 |
| --- | --- | --- | --- | --- |
| development | 아침일기 (Dev) | `.dev` | `development` | 로컬 개발, development client |
| preview | 아침일기 (Preview) | `.preview` | `preview` | 내부 테스트 |
| production | 아침일기 | 없음 | `production` | 스토어 배포 |

```bash
# development client
eas build --profile development --platform android
eas build --profile development --platform ios

# iOS simulator용 development client
eas build --profile development-simulator --platform ios

# 내부 테스트 빌드
eas build --profile preview --platform all

# 스토어 빌드 및 제출
eas build --profile production --platform all
eas submit --profile production --platform android
eas submit --profile production --platform ios

# 빌드 오류 시
set -a; source .env.local; set +a
```

JS·에셋만 변경한 경우 동일 runtime을 대상으로 OTA update 배포 가능. 네이티브 의존성이나 네이티브 설정 변경 시 `app.config.ts`의 `runtimeVersion` 변경 및 새 바이너리 빌드 필요

## 개발 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run start` | Expo 개발 서버 시작 |
| `npm run ios` | development variant iOS 네이티브 앱 실행 |
| `npm run android` | development variant Android 네이티브 앱 실행 |
| `npm run lint` | Expo ESLint 검사 |

## 변경 시 확인할 점

- 일기 mutation 후 홈·일기 목록 Query cache 동시 갱신 확인
- 주간 리포트의 **주 3회 기록**·**일요일** 조건, 날짜 경계, 서버 오류 코드 확인
- 인증 또는 저장 상태 변경 시 `isLoaded` 복원 전 라우트 노출 여부 확인
- 알림 변경 시 OS 권한, 로컬 토글, push token, 서버 설정 간 동기화 확인
- Apple 로그인은 iOS 전용, Kakao·Firebase 변경 시 네이티브 재빌드 필요 여부 확인
- preview·production 배포 전 앱 `version`, EAS remote build number, `runtimeVersion` 호환성 확인
