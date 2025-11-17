# CameraMatch - 카메라 장비 추천 검색엔진

사용자의 촬영 스타일, 보유 장비, 예산, 우선순위를 기반으로 가장 적합한 카메라 장비를 추천하는 웹 서비스입니다.

## 기능

- **질문 기반 입력**: 촬영 분야, 예산, 보유 장비 입력
- **우선순위 설정**: 화질, 휴대성, 보케, 저조도 성능 등 8가지 기준에 가중치 부여
- **스마트 추천**: 가중치 기반 스코어 계산으로 최적의 장비 추천
- **조합 평가**: 보유 장비와의 호환성 및 시너지 분석

## 기술 스택

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend/DB**: Firebase (Firestore)
- **배포**: Vercel (권장)

## 시작하기

### 1. 프로젝트 클론 및 의존성 설치

```bash
npm install
```

### 2. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 활성화
3. 프로젝트 설정에서 웹 앱 추가
4. 환경 변수 설정

### 3. 환경 변수 설정

`.env.local.example`을 복사하여 `.env.local` 파일을 생성하고 Firebase 설정값을 입력하세요:

```bash
cp .env.local.example .env.local
```

`.env.local` 파일에 Firebase 설정값을 입력:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 시드 데이터 업로드

Firestore에 초기 장비 데이터를 업로드합니다:

```bash
# tsx 설치 (아직 설치하지 않은 경우)
npm install -D tsx

# 시드 데이터 업로드
npx tsx scripts/upload-seed.ts
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
camera_recommend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 홈 화면
│   ├── recommend/         # 추천 플로우
│   │   ├── step1/         # 촬영 분야 + 예산
│   │   ├── step2/         # 보유 장비 입력
│   │   ├── step3/         # 우선순위 설정
│   │   └── result/        # 결과 화면
│   └── layout.tsx
├── components/
│   ├── ui/                # 재사용 UI 컴포넌트
│   ├── questionnaire/     # 질문 입력 컴포넌트
│   └── recommendation/    # 추천 결과 컴포넌트
├── lib/
│   ├── firebase.ts        # Firebase 초기화
│   ├── db.ts              # Firestore 데이터 접근
│   ├── recommendation.ts  # 추천 엔진 로직
│   └── types.ts           # TypeScript 타입 정의
├── data/
│   └── seed.ts            # 초기 장비 데이터
└── scripts/
    └── upload-seed.ts     # 시드 데이터 업로드 스크립트
```

## 주요 기능 설명

### 추천 엔진

`lib/recommendation.ts`에 구현된 추천 엔진은 다음을 수행합니다:

1. **스코어 계산**: 각 장비의 성능 점수를 사용자 우선순위 가중치로 계산
2. **필터링**: 예산 범위, 마운트 호환성 필터링
3. **조합 평가**: 보유 장비와의 호환성 및 초점거리 겹침 분석

### 데이터 모델

- **Camera**: 카메라 바디 정보 (브랜드, 마운트, 센서, ISO 성능, 무게, 가격 등)
- **Lens**: 렌즈 정보 (초점거리, 조리개, 보케 점수, 화질 점수 등)
- **UserInput**: 사용자 입력 (촬영 분야, 예산, 보유 장비)
- **PriorityWeights**: 우선순위 가중치 (0-5점)

## 배포

### Vercel 배포 (권장)

1. GitHub에 프로젝트 푸시
2. [Vercel](https://vercel.com)에 로그인 후 "New Project" 클릭
3. GitHub 저장소 선택
4. 환경 변수 설정:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. "Deploy" 클릭

### Firebase Hosting 배포

```bash
# Firebase CLI 설치 (이미 설치되어 있으면 생략)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firebase 프로젝트 초기화
firebase init hosting

# 빌드
npm run build

# 배포
firebase deploy
```

### 배포 전 체크리스트

- [ ] Firebase 프로젝트 생성 및 Firestore 활성화
- [ ] 환경 변수 설정 완료
- [ ] 시드 데이터 업로드 완료 (`npm run upload-seed`)
- [ ] 로컬에서 빌드 테스트 (`npm run build`)
- [ ] Firestore 보안 규칙 설정 (개발 단계에서는 모든 읽기 허용 가능)

## 향후 계획

- [ ] 사용자 인증 및 결과 저장
- [ ] 장비 비교 기능
- [ ] 북마크 기능
- [ ] 사용자 프로필 (선호 우선순위 저장)
- [ ] 더 많은 장비 데이터 추가
- [ ] 추천 알고리즘 개선

## 라이선스

MIT
