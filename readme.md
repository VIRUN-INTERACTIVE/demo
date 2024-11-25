리팩토링 폴더 구조

├── node_modules/       # 의존성 라이브러리 (자동 생성)
├── public/             # 정적 파일 제공 폴더
│   ├── index.html      # 메인 HTML 파일
│   ├── css/            # CSS 파일 폴더
│   │   └── styles.css  # (선택 사항) 스타일 파일
│   ├── js/             # 클라이언트 측 JavaScript 파일 폴더
│   │   └── app.js      # (선택 사항) 클라이언트 로직 파일
│   └── images/         # (선택 사항) 이미지 파일 폴더
│
├── uploads/            # 업로드된 파일 저장 폴더
│
├── src/                # 서버 측 코드 폴더
│   ├── routes/         # 라우터 관리 폴더
│   │   └── upload.js   # (예) 업로드 관련 라우터
│   ├── scripts/        # 유틸리티 스크립트 폴더
│   │   └── script.js   # (예) 작성하려는 스크립트 파일
│   └── server.js       # 메인 서버 파일
│
├── config/             # 설정 파일 폴더 (선택 사항)
│   └── config.yaml     # YAML 설정 파일
│
├── .gitignore          # Git에서 무시할 파일/폴더
├── package.json        # 프로젝트 의존성 및 스크립트 정의
└── package-lock.json   # 의존성 버전 고정 파일


package.json 참고해서, 필요한 노드 모듈 설치