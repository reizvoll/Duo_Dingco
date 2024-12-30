###### ![duodingco_logo](https://github.com/user-attachments/assets/2ee26b9b-8675-4f10-b600-4e36de5a48fa)
## Duo-Dingco
#### 곧 있으면 끝나는 React 7기, 기술 면접을 준비하고 퀴즈를 통해 지식을 공유하세요!

# 👨‍👩‍👧‍👦 Our Team
| 임지영      |    최한솔      |  이경민        |    권현준      |    박준석   |
| ------------ | ------------ | ------------ | ------------ | ------------ |

<br/>

### [📄 프로젝트 노션 바로가기](https://www.notion.so/teamsparta/Hot6-8eba862d4fc247a998acee4f796fdd5f)

<br/>

# 🔗 프로젝트 기능
### ✅ supabae를 활용한 로그인, 회원가입
 - 회원가입: 이메일, 비밀번호, 모든 필드가 채워지지 않으면 회원가입 불가
 - 로그인: 구글 소셜로그인 기능 제공으로 사용자 경험 개선

### ✅ 홈페이지
 - 로그인이 되지 않으면 다른 페이지로 이동 불가
 - 각 페이지로 이동할 수 있는 side bar, nav bar 제공

### ✅ 학습페이지
 - 올라온 게시물을 학습할 수 있는 페이지
 - 북마크 기능을 통해 마음에 드는 카드를 저장
 - 애니매이션 기능 추가로 사용자 경험 개선

### ✅ 퀴즈페이지
 - 올라온 게시물에 대해 퀴즈를 풀어볼 수 있는 페이지
 - 맞은문제, 틀린문제를 실시간으로 알려주는 기능
 - 퀴즈 완료 후 레벨, 경험치, 틀린문제를 확인할 수 있는 모달창 제공

### ✅ 문제 생성페이지
 - 게시물을 등록할 수 있는 페이지
 - 제목, 설명, 카드내용(단어, 뜻)인풋창 제공

### ✅ 오늘의 퀴즈 페이지
 - 가장 최근 게시물을 보여주는 페이지
 - 학습, 퀴즈페이지와 동일한 UI로 구성하여 사용자 경험 개선

### ✅ 마이 페이지
 - 내가 즐겨찾기한 목록 확인가능
 - 내가 작성한 카드 목록도 확인가능
 - 프로필(사진, 레벨, 경험치 등)확인가능

# 📡 Technologies & Tools
<div>
<img src="https://img.shields.io/badge/nextdotjs-000000?style=flat&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/typescript-3178C6?style=flat&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white" />
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/reactquery-FF4154?style=flat-square&logo=reactquery&logoColor=white"/>
<img src="https://img.shields.io/badge/supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white"/>
<img src="https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=Vercel&logoColor=white"/>
<img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/>
<img src="https://img.shields.io/badge/Github-181717?style=flat-square&logo=github&logoColor=white"/>
<img src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=Notion&logoColor=white"/>
<img src="https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=Slack&logoColor=white"/>
<img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=Figma&logoColor=white"/>
</div>

# 🍀 프로젝트 구조
```bash
📦src
 ┣ 📂app
 ┃ ┣ 📂(dashboard)
 ┃ ┃ ┣ 📂comment
 ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂create
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂hotlearning
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂learning
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂mypage
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂quiz
 ┃ ┃ ┃ ┣ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂update
 ┃ ┃ ┃ ┗ 📂[id]
 ┃ ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📜layout.tsx
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📂callback
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┣ 📂me
 ┃ ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┃ ┗ 📜route.ts
 ┃ ┃ ┣ 📂comment
 ┃ ┃ ┃ ┣ 📜bookmark.ts
 ┃ ┃ ┃ ┣ 📜fetchDataInfo.ts
 ┃ ┃ ┃ ┗ 📜postList.ts
 ┃ ┃ ┣ 📂post
 ┃ ┃ ┃ ┣ 📜deleting.ts
 ┃ ┃ ┃ ┣ 📜posting.ts
 ┃ ┃ ┃ ┗ 📜updating.ts
 ┃ ┃ ┗ 📂quiz
 ┃ ┃ ┃ ┗ 📜fetchDataQuiz.ts
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┣ 📜actions.ts
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┣ 📂signup
 ┃ ┃ ┃ ┣ 📜actions.ts
 ┃ ┃ ┃ ┗ 📜page.tsx
 ┃ ┃ ┗ 📜layout.tsx
 ┃ ┣ 📜global-error.tsx
 ┃ ┗ 📜layout.tsx
 ┣ 📂components
 ┃ ┣ 📂auth
 ┃ ┃ ┣ 📜LoginForm.tsx
 ┃ ┃ ┗ 📜LogoutHandler.ts
 ┃ ┣ 📂comment
 ┃ ┃ ┣ 📜CardInfo.tsx
 ┃ ┃ ┗ 📜CardSlide.tsx
 ┃ ┣ 📂error
 ┃ ┃ ┣ 📜ComponentBounday.tsx
 ┃ ┃ ┣ 📜ErrorBoundary.tsx
 ┃ ┃ ┗ 📜Loading.tsx
 ┃ ┣ 📂layout
 ┃ ┃ ┣ 📂hero
 ┃ ┃ ┃ ┣ 📜HeroButton.tsx
 ┃ ┃ ┃ ┗ 📜HeroSection.tsx
 ┃ ┃ ┣ 📂navigation
 ┃ ┃ ┃ ┣ 📜HeadNav.tsx
 ┃ ┃ ┃ ┣ 📜InsideSideNav.tsx
 ┃ ┃ ┃ ┣ 📜SideNav.tsx
 ┃ ┃ ┃ ┗ 📜SideNavWrapper.tsx
 ┃ ┃ ┣ 📂protected
 ┃ ┃ ┃ ┣ 📜ProtectedBookmarks.tsx
 ┃ ┃ ┃ ┗ 📜ProtectedLogin.tsx
 ┃ ┃ ┣ 📜Headers.tsx
 ┃ ┃ ┗ 📜Logout.tsx
 ┃ ┣ 📂mypage
 ┃ ┃ ┣ 📜BookmarkedCard.tsx
 ┃ ┃ ┣ 📜BookmarkedCardList.tsx
 ┃ ┃ ┣ 📜CreateCardList.tsx
 ┃ ┃ ┣ 📜MyPageModal.tsx
 ┃ ┃ ┣ 📜MyPageProfile.tsx
 ┃ ┃ ┣ 📜NicknameInput.tsx
 ┃ ┃ ┣ 📜ProfileImageUpload.tsx
 ┃ ┃ ┗ 📜ProfileLogic.tsx
 ┃ ┣ 📂posting
 ┃ ┃ ┣ 📜PostForm.tsx
 ┃ ┃ ┗ 📜PostUpdateForm.tsx
 ┃ ┗ 📂providers
 ┃ ┃ ┗ 📜RqProvider.tsx
 ┣ 📂hooks
 ┃ ┣ 📜useFetchUser.ts
 ┃ ┣ 📜usePost.ts
 ┃ ┣ 📜useProfileHandler.ts
 ┃ ┗ 📜useUpdate.ts
 ┣ 📂store
 ┃ ┣ 📜auth.ts
 ┃ ┗ 📜useModalStore.ts
 ┣ 📂styles
 ┃ ┗ 📜globals.css
 ┣ 📂supabase
 ┃ ┣ 📜middleware.ts
 ┃ ┣ 📜supabaseClient.ts
 ┃ ┗ 📜supabaseServer.ts
 ┣ 📂types
 ┃ ┣ 📜CardInfoProps.ts
 ┃ ┣ 📜commentTypes.ts
 ┃ ┣ 📜createCardListTypes.ts
 ┃ ┣ 📜mypageTypes.ts
 ┃ ┣ 📜NicknameInputProps.ts
 ┃ ┣ 📜PostCard.ts
 ┃ ┗ 📜user.ts
 ┣ 📂utils
 ┃ ┣ 📜quizAlert.ts
 ┃ ┣ 📜quizHelpers.ts
 ┃ ┗ 📜quizModal.ts
 ┗ 📜middleware.ts
