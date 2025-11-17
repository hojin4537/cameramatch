import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-lg font-bold text-white">
                C
              </div>
              <span className="text-xl font-semibold text-gray-900">CameraMatch</span>
            </div>
            <nav className="hidden gap-6 sm:flex">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                홈
              </Link>
              <Link href="/recommend/body/step1" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                바디 추천
              </Link>
              <Link href="/recommend/lens/step1" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                렌즈 추천
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
            내게 맞는 카메라 장비 찾기
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            촬영 스타일과 우선순위를 알려주시면<br />
            가장 적합한 후지필름 장비를 추천해드립니다
          </p>
        </div>

        {/* Recommendation Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Body Recommendation Card */}
          <Link
            href="/recommend/body/step1"
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                📷
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">바디 추천</h2>
                <p className="text-sm text-gray-500">카메라 바디 추천받기</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              용도, 사용 분야, 우선순위를 입력하면<br />
              최적의 후지필름 바디를 추천해드립니다
            </p>
            <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-700">
              시작하기
              <svg
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>

          {/* Lens Recommendation Card */}
          <Link
            href="/recommend/lens/step1"
            className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 transition-all hover:border-gray-300 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 text-2xl">
                🔍
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">렌즈 추천</h2>
                <p className="text-sm text-gray-500">렌즈 추천받기</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-gray-600">
              용도, 사용 분야, 우선순위를 입력하면<br />
              최적의 후지필름 렌즈를 추천해드립니다
            </p>
            <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-gray-700">
              시작하기
              <svg
                className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">CameraMatch란?</h3>
          <p className="text-sm text-gray-600">
            후지필름 X 시리즈 전용 카메라 장비 추천 서비스입니다.<br />
            사용자의 촬영 스타일, 예산, 우선순위를 분석하여<br />
            가장 적합한 바디와 렌즈를 추천해드립니다.
          </p>
        </div>
      </main>
    </div>
  );
}
