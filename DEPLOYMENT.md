# 배포 가이드

## 사전 준비

### 1. Firebase 프로젝트 설정

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성
3. Firestore Database 생성
   - 프로덕션 모드로 시작 (나중에 보안 규칙 설정)
   - 위치 선택 (asia-northeast3 권장)
4. 프로젝트 설정 > 일반 > 웹 앱 추가
5. Firebase SDK 설정값 복사

### 2. Firestore 보안 규칙 (개발용)

개발 단계에서는 다음 규칙을 사용할 수 있습니다:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if false; // 시드 데이터는 수동 업로드
    }
  }
}
```

프로덕션에서는 더 엄격한 규칙을 설정하세요.

### 3. 시드 데이터 업로드

로컬에서 시드 데이터를 업로드합니다:

```bash
# 환경 변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Firebase 설정값 입력

# 시드 데이터 업로드
npm run upload-seed
```

## Vercel 배포

### 1. GitHub 저장소 생성 및 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Vercel 배포

1. [Vercel](https://vercel.com) 접속 및 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. 프로젝트 설정:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. 환경 변수 추가:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
6. "Deploy" 클릭

### 3. 배포 후 확인

- 배포된 URL에서 앱 동작 확인
- Firestore 데이터 접근 확인
- 각 단계별 플로우 테스트

## Firebase Hosting 배포

### 1. Firebase CLI 설치 및 로그인

```bash
npm install -g firebase-tools
firebase login
```

### 2. Firebase 프로젝트 초기화

```bash
firebase init hosting
```

선택 사항:
- Use an existing project: 기존 Firebase 프로젝트 선택
- What do you want to use as your public directory?: `out`
- Configure as a single-page app: `No`
- Set up automatic builds and deploys with GitHub: 선택사항

### 3. Next.js 빌드 설정

`next.config.ts`에 output 설정 추가:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
};
```

### 4. 빌드 및 배포

```bash
npm run build
firebase deploy
```

## 트러블슈팅

### Firestore 접근 오류

- Firebase 프로젝트 ID 확인
- Firestore 보안 규칙 확인
- 환경 변수 올바르게 설정되었는지 확인

### 빌드 오류

- `npm install` 재실행
- `.next` 폴더 삭제 후 재빌드
- TypeScript 타입 오류 확인

### 데이터 로딩 안 됨

- Firestore에 시드 데이터가 업로드되었는지 확인
- 브라우저 콘솔에서 에러 확인
- Firebase 콘솔에서 데이터 확인

