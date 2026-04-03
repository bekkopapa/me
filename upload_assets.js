const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');

// Firebase Admin 초기화 (버킷 이름 확인 필요)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.firebasestorage.app` // 기본 버킷 형식
});

const bucket = admin.storage().bucket();

async function uploadFolder(dir, remotePath = '') {
  const files = fs.readdirSync(dir);
  const results = [];

  for (const fileName of files) {
    const localPath = path.join(dir, fileName);
    const stat = fs.statSync(localPath);

    if (stat.isDirectory()) {
      const subResults = await uploadFolder(localPath, path.join(remotePath, fileName));
      results.push(...subResults);
    } else {
      const destination = path.join(remotePath, fileName).replace(/\\/g, '/');
      console.log(`업로드 중: ${localPath} -> ${destination}`);
      
      await bucket.upload(localPath, {
        destination: destination,
        public: true, // 공개 읽기 권한 부여
        metadata: {
          cacheControl: 'public, max-age=31536000',
        }
      });

      // 공개 URL 생성 (Firebase Storage의 다운로드 URL 형식)
      const file = bucket.file(destination);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491' // 아주 먼 미래로 설정
      });

      results.push({
        originalName: fileName,
        newUrl: url,
        remotePath: destination
      });
    }
  }
  return results;
}

async function start() {
  try {
    console.log('이미지 및 비디오 업로드 시작...');
    const results = await uploadFolder('./imageDB');
    
    // 결과를 JSON 파일로 저장 (나중에 Firestore 매칭용)
    fs.writeFileSync('upload_results.json', JSON.stringify(results, null, 2));
    console.log('--------------------------------------------------');
    console.log('모든 파일 업로드 완료!');
    console.log('결과가 upload_results.json에 저장되었습니다.');
  } catch (err) {
    console.error('업로드 중 에러 발생:', err);
  }
  process.exit();
}

start();
