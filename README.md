# zempie-nuxt

- 패키지 관리 툴 : yarn 사용

- 디자인 : 퍼블리싱 외주로 진행
  Element ui framework 사용 
  font는 리소스 제한으로 Notosans font-weight 400, 500, 700만 사용

- 환경변수 : env.sample 참고 ( 로컬 환경 기준으로 작성해두었습니다. 테스트 환경, 실서버 환경은 업로드된 서버에서 직접 확인해주세요 )


- 번역 : zempie google 계정 스프레트 시트와 연동되어있습니다. 업데이트되면 번역담당자에게 자동으로 슬랙메세지가 날라갑니다
  번역 담당자가 바뀐경우 수정해주시길 바랍니다
  scan 해주신 후 upload 하시면 자동으로 스프레드시트에 업로드 됩니다.
  추후 번역이 끝나면 download 하시면 해당 번역파일(.json)에 업데이트 됩니다. 

- 게임 플레이는 런처 실행 필요




# ZEMTOWN
https://zemtown.zempie.com/?token=

리소스 호출 : postMessage(JSON.stringify({type:'view'}))