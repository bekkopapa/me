const oracledb = require('oracledb');
const admin = require('firebase-admin');
require('dotenv').config();

// Firebase Admin SDK 초기화
// 로컬 테스트 시에는 GOOGLE_APPLICATION_CREDENTIALS 환경 변수에 서비스 계정 키 JSON 경로를 설정하세요.
// 예: set GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccountKey.json"
admin.initializeApp();
const db = admin.firestore();

async function migrateData() {
  let connection;
  try {
    // Oracle DB 연결 설정 (기존 server.js 설정 활용)
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.CONNECT_STRING
    });

    console.log('Oracle DB 연결 성공. 마이그레이션 시작...');

    // 1. QUOTES 마이그레이션 예시
    console.log('1. Quotes 컬렉션 이관 중...');
    // Oracle DB에서 쿼리 실행. (실제 테이블명과 컬럼명에 맞게 조정 필요)
    try {
      const quotesResult = await connection.execute(`SELECT ID, TEXT, AUTHOR FROM QUOTES`);
      const quotesBatch = db.batch();
      if (quotesResult.rows && quotesResult.rows.length > 0) {
        quotesResult.rows.forEach(row => {
          // row[0]: ID, row[1]: TEXT, row[2]: AUTHOR
          const docId = row[0].toString();
          const docRef = db.collection('quotes').doc(docId);
          quotesBatch.set(docRef, { text: row[1], author: row[2] });
        });
        await quotesBatch.commit();
        console.log(` -> Quotes ${quotesResult.rows.length}건 마이그레이션 완료`);
      } else {
        console.log(' -> Quotes 테이블이 비어있거나 존재하지 않습니다.');
      }
    } catch (e) {
      console.log(' -> Quotes 테이블 조회 실패 (스키마를 확인하세요):', e.message);
    }

    // 2. BOARD 마이그레이션 예시
    console.log('2. Board 컬렉션 이관 중...');
    try {
      const boardResult = await connection.execute(`SELECT ID, TITLE, CONTENT, AUTHOR, CREATED_AT FROM BOARD`);
      const boardBatch = db.batch();
      if (boardResult.rows && boardResult.rows.length > 0) {
        boardResult.rows.forEach(row => {
          const docId = row[0].toString();
          const docRef = db.collection('board').doc(docId);
          boardBatch.set(docRef, { title: row[1], content: row[2], author: row[3], createdAt: row[4] });
        });
        await boardBatch.commit();
        console.log(` -> Board ${boardResult.rows.length}건 마이그레이션 완료`);
      } else {
        console.log(' -> Board 테이블이 비어있거나 존재하지 않습니다.');
      }
    } catch (e) {
      console.log(' -> Board 테이블 조회 실패:', e.message);
    }

    // 3. AI_GALLERY 마이그레이션 예시
    console.log('3. AI_Gallery 컬렉션 이관 중...');
    try {
      const galleryResult = await connection.execute(`SELECT ID, IMAGE_URL, TITLE, CREATED_AT FROM AI_GALLERY`);
      const galleryBatch = db.batch();
      if (galleryResult.rows && galleryResult.rows.length > 0) {
        galleryResult.rows.forEach(row => {
          const docId = row[0].toString();
          const docRef = db.collection('ai_gallery').doc(docId);
          galleryBatch.set(docRef, { imageUrl: row[1], title: row[2], createdAt: row[3] });
        });
        await galleryBatch.commit();
        console.log(` -> AI_Gallery ${galleryResult.rows.length}건 마이그레이션 완료`);
      } else {
        console.log(' -> AI_Gallery 테이블이 비어있거나 존재하지 않습니다.');
      }
    } catch (e) {
      console.log(' -> AI_Gallery 테이블 조회 실패:', e.message);
    }

    console.log('모든 데이터 마이그레이션 스크립트 실행 완료!');

  } catch (err) {
    console.error('DB 연결 또는 마이그레이션 중 에러 발생:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Oracle DB 연결 종료됨.');
      } catch (err) {
        console.error(err);
      }
    }
  }
}

migrateData();
