# WorkHardTravelHardApp

리엑트 네이티브 (데이터 인풋)

library

expo install @react-native-async-storage/async-storage

--build an app.
expo build:android
expo build:ios

Physical location of building process happens at React Native server. It does not build on your machine.

check the building process at the expo site.

--publis to web site
npm i gh-pages

add following to package.json
"deploy": "gh-pages -d web-build",
"predeploy": "expo build:web"

npm run deploy

other method ->
git init
git remote add origin github_url
yarn add -D gh-pages

https://expo.dev/@hmchung2/worktravel
