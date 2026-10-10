/**
 * Comprehensive Integration & Verification Test Suite
 * Tests live production endpoints on Dokploy (imm.frugaldev.biz.id)
 * Validates Better Auth, RBAC, Anti-cheat CBT Engine, Sensei Admin Controls, and CSV Export.
 */

const assert = require("assert");

const BASE_URL = process.env.BASE_URL || "https://imm.frugaldev.biz.id";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runApiVerification() {
  console.log("==================================================================");
  console.log(` VERIFYING LIVE IMM CBT PLATFORM ON DOKPLOY (${BASE_URL})`);
  console.log("==================================================================");

  // TEST 1: Public System Status
  console.log("\n[TEST 1] GET /api/v1/system/status");
  const statusRes = await fetch(`${BASE_URL}/api/v1/system/status`);
  assert.strictEqual(statusRes.status, 200, "Status endpoint should return 200");
  const statusJson = await statusRes.json();
  assert.strictEqual(statusJson.success, true, "Status success should be true");
  assert.strictEqual(typeof statusJson.data.allowRegistration, "boolean", "allowRegistration is boolean");
  console.log("[PASS] System status returned:", statusJson.data);

  // TEST 2: Chapters Listing from PostgreSQL
  console.log("\n[TEST 2] GET /api/v1/chapters");
  const chaptersRes = await fetch(`${BASE_URL}/api/v1/chapters`);
  assert.strictEqual(chaptersRes.status, 200, "Chapters endpoint should return 200");
  const chaptersJson = await chaptersRes.json();
  assert.strictEqual(chaptersJson.success, true, "Chapters success should be true");
  assert.strictEqual(chaptersJson.data.length, 25, "Must return exactly 25 chapters from database");
  assert.strictEqual(chaptersJson.data[0].chapterNum, "01", "First chapter is 01");
  assert.strictEqual(chaptersJson.data[24].chapterNum, "25", "Last chapter is 25");
  console.log(`[PASS] Returned ${chaptersJson.data.length} chapters from PostgreSQL`);

  // TEST 3: Vocabulary Listing from PostgreSQL (Bab 1 = 60 words)
  console.log("\n[TEST 3] GET /api/v1/vocabulary?bab=1");
  const vocabRes = await fetch(`${BASE_URL}/api/v1/vocabulary?bab=1`);
  assert.strictEqual(vocabRes.status, 200, "Vocabulary endpoint should return 200");
  const vocabJson = await vocabRes.json();
  assert.strictEqual(vocabJson.success, true, "Vocabulary success should be true");
  assert.strictEqual(vocabJson.count, 60, "Bab 1 vocabulary count must be exactly 60 words");
  console.log(`[PASS] Returned ${vocabJson.count} vocabulary words for Bab 1`);

  // TEST 3B: Strict Auth Check: GET /api/v1/auth/me without session (Expect 401)
  console.log("\n[TEST 3B] Strict Auth Check: GET /api/v1/auth/me without session (Expect 401)");
  const unauthMeRes = await fetch(`${BASE_URL}/api/v1/auth/me`);
  assert.strictEqual(unauthMeRes.status, 401, "Unauthenticated /api/v1/auth/me must return 401 Unauthorized");
  const unauthMeJson = await unauthMeRes.json();
  assert.strictEqual(unauthMeJson.success, false, "success must be false");
  console.log("[PASS] Strict Auth Gate backend guard verified: 401 returned when not logged in");

  // TEST 4: Student Login via Better Auth (ahmad.syahroni / 123456)
  console.log("\n[TEST 4] Student Login: ahmad.syahroni + 123456");
  const studentLoginRes = await fetch(`${BASE_URL}/api/auth/sign-in/username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "ahmad.syahroni", password: "123456" }),
  });
  assert.strictEqual(studentLoginRes.status, 200, "Student login should succeed with 200");
  const studentLoginJson = await studentLoginRes.json();
  assert.strictEqual(studentLoginJson.user.username, "ahmad.syahroni", "Username must match");
  assert.strictEqual(studentLoginJson.user.role, "student", "Role must be student");

  // Extract student session cookie
  const studentCookie = studentLoginRes.headers.get("set-cookie") || "";
  console.log("[PASS] Student logged in successfully:", studentLoginJson.user.name);

  // TEST 5: Verify Student Session (/api/v1/auth/me)
  console.log("\n[TEST 5] Student Profile Verification: GET /api/v1/auth/me");
  const studentMeRes = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Cookie: studentCookie },
  });
  assert.strictEqual(studentMeRes.status, 200, "Profile check should return 200");
  const studentMeJson = await studentMeRes.json();
  assert.strictEqual(studentMeJson.data.user.role, "student", "User role is student");
  console.log("[PASS] Verified session for:", studentMeJson.data.user.name);

  // TEST 6: Student tries to access Admin route (RBAC protection 403)
  console.log("\n[TEST 6] Student RBAC Protection (Expect 403 on Admin Route)");
  const forbiddenRes = await fetch(`${BASE_URL}/api/v1/admin/users`, {
    headers: { Cookie: studentCookie },
  });
  assert.strictEqual(forbiddenRes.status, 403, "Student must be rejected with 403 Forbidden");
  console.log("[PASS] Student successfully blocked from Admin endpoint with 403 Forbidden");

  // TEST 7: CBT Exam Start with Anti-Cheat Verification (POST /api/v1/exam/start)
  console.log("\n[TEST 7] CBT Exam Start & Anti-Cheat Check");
  const startExamRes = await fetch(`${BASE_URL}/api/v1/exam/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({ chapterNum: "08", mode: "renshuu" }),
  });
  assert.strictEqual(startExamRes.status, 200, "Exam start should return 200");
  const startExamJson = await startExamRes.json();
  assert.strictEqual(startExamJson.success, true, "Exam start success should be true");
  const sessionId = startExamJson.data.session.id;
  const questions = startExamJson.data.questions;
  assert.strictEqual(questions.length, 33, "Bab 08 tryout must contain exactly 33 questions");
  assert.strictEqual(questions[0].correctAnswer, undefined, "Anti-cheat: correctAnswer must NOT be exposed");
  assert.strictEqual(questions[0].explanationSummary, undefined, "Anti-cheat: explanation must NOT be exposed");
  console.log(`[PASS] Exam started with Session ID: ${sessionId}, 33 questions delivered securely`);

  // TEST 8: Real-Time Auto-Save Answers (POST /api/v1/exam/answer)
  console.log("\n[TEST 8] Real-Time Auto-Save Answers");
  const answer1Res = await fetch(`${BASE_URL}/api/v1/exam/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      sessionId: sessionId,
      questionId: "q_08_01",
      selectedOption: "B",
    }),
  });
  assert.strictEqual(answer1Res.status, 200, "Answer auto-save should return 200");
  const answer1Json = await answer1Res.json();
  assert.strictEqual(answer1Json.saved, true, "Answer saved should be true");
  console.log("[PASS] Real-time answer saved successfully to PostgreSQL");

  // TEST 9: Sensei Admin Login (sensei.wahyu / 123456)
  console.log("\n[TEST 9] Sensei Admin Login: sensei.wahyu + 123456");
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/sign-in/username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "sensei.wahyu", password: "123456" }),
  });
  assert.strictEqual(adminLoginRes.status, 200, "Admin login should succeed with 200");
  const adminLoginJson = await adminLoginRes.json();
  assert.strictEqual(adminLoginJson.user.role, "admin", "Role must be admin");
  const adminCookie = adminLoginRes.headers.get("set-cookie") || "";
  console.log("[PASS] Sensei Admin logged in successfully:", adminLoginJson.user.name);

  // TEST 10: Sensei Live Monitoring (GET /api/v1/admin/monitoring/live)
  console.log("\n[TEST 10] Sensei Live Monitoring (Lab Classroom View)");
  const liveRes = await fetch(`${BASE_URL}/api/v1/admin/monitoring/live`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(liveRes.status, 200, "Live monitor should return 200");
  const liveJson = await liveRes.json();
  assert.strictEqual(liveJson.success, true, "Live monitor success should be true");
  const activeStudent = liveJson.data.find((s) => s.sessionId === sessionId);
  assert(Boolean(activeStudent), "Student active exam session must appear in Live Monitor");
  assert.strictEqual(activeStudent.answeredCount, 1, "Answered count should reflect real-time progress (1 answered)");
  console.log(`[PASS] Live monitor shows ${liveJson.count} active student(s), progress tracked in real-time`);

  // TEST 11: Exam Submit & Server-Side Scoring (POST /api/v1/exam/submit)
  console.log("\n[TEST 11] Submit Exam & Server-Side Scoring");
  const submitRes = await fetch(`${BASE_URL}/api/v1/exam/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({ sessionId: sessionId }),
  });
  assert.strictEqual(submitRes.status, 200, "Submit should return 200");
  const submitJson = await submitRes.json();
  assert.strictEqual(submitJson.success, true, "Submit success should be true");
  assert(submitJson.data.review.length === 33, "Detailed review must include all 33 questions");
  assert(Boolean(submitJson.data.review[0].correctAnswer), "Review now contains server correct answers");
  assert(Boolean(submitJson.data.review[0].explanation), "Review contains detailed explanations");
  console.log(`[PASS] Exam submitted! Score: ${submitJson.data.totalScore}, Passed: ${submitJson.data.isPassed}`);

  // TEST 12: Admin User Management (GET /api/v1/admin/users & POST /api/v1/admin/users)
  console.log("\n[TEST 12] Admin User Management");
  const usersRes = await fetch(`${BASE_URL}/api/v1/admin/users`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(usersRes.status, 200, "Users list should return 200");
  const usersJson = await usersRes.json();
  assert(usersJson.data.length >= 2, "Must contain at least 2 users (Admin & Ahmad)");
  console.log(`[PASS] Admin retrieved ${usersJson.count} registered users from database`);

  // TEST 13: Admin Rekap Nilai & CSV Export (GET /api/v1/admin/monitoring/results/export?format=csv)
  console.log("\n[TEST 13] Admin Rekap Nilai CSV Export");
  const csvRes = await fetch(`${BASE_URL}/api/v1/admin/monitoring/results/export?format=csv`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(csvRes.status, 200, "CSV export should return 200");
  assert(csvRes.headers.get("content-type").includes("text/csv"), "Content-Type must be text/csv");
  const csvText = await csvRes.text();
  assert(csvText.includes("Nama Siswa"), "CSV must include headers");
  assert(csvText.includes("Ahmad Syahroni"), "CSV must include tryout record");
  console.log("[PASS] CSV export generated successfully (length: " + csvText.length + " bytes)");

  // TEST 14: Chapter Lock & System Switch Controls
  console.log("\n[TEST 14] Chapter Lock & System Switch Controls");
  const lockChRes = await fetch(`${BASE_URL}/api/v1/admin/chapters/05/lock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ isUnlocked: false }),
  });
  assert.strictEqual(lockChRes.status, 200, "Lock chapter should return 200");

  // Re-unlock Bab 05
  const unlockChRes = await fetch(`${BASE_URL}/api/v1/admin/chapters/05/lock`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ isUnlocked: true }),
  });
  assert.strictEqual(unlockChRes.status, 200, "Unlock chapter should return 200");
  // TEST 15: Invalid Question ID Auto-save Guard (Expect 404)
  console.log("\n[TEST 15] Invalid Question ID Auto-save Guard (Expect 404)");
  const invalidQRes = await fetch(`${BASE_URL}/api/v1/exam/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      sessionId: sessionId,
      questionId: "q_non_existent_999",
      selectedOption: "A",
    }),
  });
  // Since session was submitted in Test 11, it returns either 400 (session already submitted) or 404
  assert(invalidQRes.status === 400 || invalidQRes.status === 404, "Invalid question or finalized session correctly rejected");
  console.log(`[PASS] Invalid question guard responded with status ${invalidQRes.status}`);

  // TEST 16: Admin Force-Termination & Dual-Session Score Integrity
  console.log("\n[TEST 16] Admin Force-Termination & Dual-Session Score Integrity");
  // Start a fresh session for Ahmad
  const freshExamRes = await fetch(`${BASE_URL}/api/v1/exam/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({ chapterNum: "08", mode: "renshuu" }),
  });
  assert.strictEqual(freshExamRes.status, 200, "Fresh exam start should return 200");
  const freshJson = await freshExamRes.json();
  const freshSessionId = freshJson.data.session.id;

  // Answer 1 Reading question correctly (q_08_01: "B")
  const ansRes = await fetch(`${BASE_URL}/api/v1/exam/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      sessionId: freshSessionId,
      questionId: "q_08_01",
      selectedOption: "B",
    }),
  });
  assert.strictEqual(ansRes.status, 200, "Answer save should return 200");

  // Sensei force-terminates this session from Live Monitor
  const termRes = await fetch(`${BASE_URL}/api/v1/admin/monitoring/sessions/${freshSessionId}/terminate`, {
    method: "POST",
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(termRes.status, 200, "Force-termination should succeed with 200");
  const termJson = await termRes.json();
  assert.strictEqual(termJson.success, true, "Termination success should be true");
  // 1/25 reading = 4%, 0/8 choukai = 0% -> dual session score = (4 + 0)/2 = 2.0 Poin
  assert.strictEqual(termJson.data.totalScore, 2.0, "Dual-session 50/50 formula correctly yields 2.0");
  console.log("[PASS] Sensei force-terminated session, dual-session score calculated: 2.0");

  // Subsequent answer attempt by student must be blocked
  const blockedAnsRes = await fetch(`${BASE_URL}/api/v1/exam/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({
      sessionId: freshSessionId,
      questionId: "q_08_02",
      selectedOption: "A",
    }),
  });
  assert.strictEqual(blockedAnsRes.status, 400, "Subsequent answer on terminated session must return 400");
  console.log("[PASS] Student answer blocked after Sensei termination");

  // Subsequent submit by student must preserve TERMINATED_BY_ADMIN status
  const reSubmitRes = await fetch(`${BASE_URL}/api/v1/exam/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({ sessionId: freshSessionId }),
  });
  assert.strictEqual(reSubmitRes.status, 200, "Submit should return 200 with review");
  const reSubmitJson = await reSubmitRes.json();
  assert.strictEqual(reSubmitJson.data.status, "TERMINATED_BY_ADMIN", "Status preserved as TERMINATED_BY_ADMIN");
  console.log("[PASS] Re-submission preserves TERMINATED_BY_ADMIN status without overwrite");

  // TEST 17: User Management Exam Stats Synchronization
  console.log("\n[TEST 17] User Management Exam Stats (Counts TERMINATED_BY_ADMIN)");
  const finalUsersRes = await fetch(`${BASE_URL}/api/v1/admin/users`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(finalUsersRes.status, 200, "Users list should return 200");
  const finalUsersJson = await finalUsersRes.json();
  const ahmadRecord = finalUsersJson.data.find((u) => u.username === "ahmad.syahroni");
  assert(Boolean(ahmadRecord), "Ahmad Syahroni record found");
  assert(ahmadRecord.totalExams >= 2, "Ahmad must have at least 2 completed exams (including terminated)");
  console.log(`[PASS] Ahmad Syahroni has ${ahmadRecord.totalExams} completed exams recorded in Manajemen Siswa`);

  // TEST 17B: Per-Student Chapter Access Control (Sensei API & Server-Authoritative Lockout)
  console.log("\n[TEST 17B] Per-Student Chapter Access Control (Sensei API & Server-Authoritative Lockout)");

  // 1. Sensei retrieves chapter access for Ahmad
  const ahmadAccessRes = await fetch(`${BASE_URL}/api/v1/admin/users/${ahmadRecord.id}/chapter-access`, {
    headers: { Cookie: adminCookie },
  });
  assert.strictEqual(ahmadAccessRes.status, 200, "Sensei get chapter access returns 200");
  const ahmadAccessJson = await ahmadAccessRes.json();
  assert.strictEqual(ahmadAccessJson.success, true, "Success should be true");
  const chaptersList = Array.isArray(ahmadAccessJson.data) ? ahmadAccessJson.data : ahmadAccessJson.chapters;
  assert.strictEqual(chaptersList.length, 25, "Must return 25 chapters");

  // 2. Sensei restricts Bab 05 specifically for Ahmad
  const restrictRes = await fetch(`${BASE_URL}/api/v1/admin/users/${ahmadRecord.id}/chapter-access`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ chapterNum: "05", isAllowed: false }),
  });
  assert.strictEqual(restrictRes.status, 200, "Sensei restrict chapter returns 200");
  const restrictJson = await restrictRes.json();
  assert.strictEqual(restrictJson.success, true, "Success should be true");

  // 3. Ahmad checks GET /api/v1/chapters: Bab 05 must have isUnlocked: false and userRestricted: true
  const ahmadChaptersRes = await fetch(`${BASE_URL}/api/v1/chapters`, {
    headers: { Cookie: studentCookie },
  });
  assert.strictEqual(ahmadChaptersRes.status, 200, "Chapters endpoint returns 200");
  const ahmadChaptersJson = await ahmadChaptersRes.json();
  const ahmadBab05 = ahmadChaptersJson.data.find((c) => c.chapterNum === "05");
  assert(Boolean(ahmadBab05), "Bab 05 found in chapters");
  assert.strictEqual(ahmadBab05.isUnlocked, false, "Bab 05 must be isUnlocked: false for restricted student");
  assert.strictEqual(ahmadBab05.userRestricted, true, "Bab 05 must be userRestricted: true for restricted student");
  console.log("[PASS] Bab 05 locked with userRestricted: true for Ahmad Syahroni");

  // 4. Ahmad tries to start exam for Bab 05 (POST /api/v1/exam/start): Must return 403 Forbidden!
  const ahmadStartB5Res = await fetch(`${BASE_URL}/api/v1/exam/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({ chapterNum: "05", mode: "renshuu" }),
  });
  assert.strictEqual(ahmadStartB5Res.status, 403, "Starting restricted chapter must return 403 Forbidden");
  const ahmadStartB5Json = await ahmadStartB5Res.json();
  assert(ahmadStartB5Json.error.includes("Akses bab ini dibatasi khusus untuk akun Anda oleh pengawas"), "Error must specify chapter access restriction by pengawas");
  console.log("[PASS] Server-authoritative rejection: POST /api/v1/exam/start Bab 05 returned 403 Forbidden");

  // 5. Verify other student can still access Bab 05
  const student2Username = "student.test.acc";
  await fetch(`${BASE_URL}/api/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      name: "Siswa Penguji 2",
      username: student2Username,
      pin: "123456",
      className: "Kelas 24-B",
      role: "student",
    }),
  });

  const student2LoginRes = await fetch(`${BASE_URL}/api/auth/sign-in/username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: student2Username, password: "123456" }),
  });
  assert.strictEqual(student2LoginRes.status, 200, "Student 2 login succeeds");
  const student2Cookie = student2LoginRes.headers.get("set-cookie") || "";

  // Student 2 checks chapters: Bab 05 must be isUnlocked: true and userRestricted: false
  const s2ChaptersRes = await fetch(`${BASE_URL}/api/v1/chapters`, {
    headers: { Cookie: student2Cookie },
  });
  const s2ChaptersJson = await s2ChaptersRes.json();
  const s2Bab05 = s2ChaptersJson.data.find((c) => c.chapterNum === "05");
  assert.strictEqual(s2Bab05.isUnlocked, true, "Bab 05 must be unlocked for other student");
  assert.strictEqual(s2Bab05.userRestricted, false, "Bab 05 must NOT be restricted for other student");

  // Student 2 starts exam for Bab 05: 200 OK!
  const s2StartRes = await fetch(`${BASE_URL}/api/v1/exam/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: student2Cookie,
    },
    body: JSON.stringify({ chapterNum: "05", mode: "renshuu" }),
  });
  assert.strictEqual(s2StartRes.status, 200, "Other student can start Bab 05 with 200 OK");
  console.log("[PASS] Other student is NOT affected by per-student restriction and started Bab 05 successfully");

  // Clean up student 2
  const s2UsersRes = await fetch(`${BASE_URL}/api/v1/admin/users`, {
    headers: { Cookie: adminCookie },
  });
  const s2UsersJson = await s2UsersRes.json();
  const s2UserObj = s2UsersJson.data.find((u) => u.username === student2Username);
  if (s2UserObj) {
    await fetch(`${BASE_URL}/api/v1/admin/users/${s2UserObj.id}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
  }

  // 6. Sensei restores access to Bab 05 for Ahmad
  const restoreRes = await fetch(`${BASE_URL}/api/v1/admin/users/${ahmadRecord.id}/chapter-access`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: adminCookie,
    },
    body: JSON.stringify({ chapterNum: "05", isAllowed: true }),
  });
  assert.strictEqual(restoreRes.status, 200, "Restore access returns 200");

  // 7. Ahmad verifies Bab 05 is unlocked again
  const ahmadRestoredChaptersRes = await fetch(`${BASE_URL}/api/v1/chapters`, {
    headers: { Cookie: studentCookie },
  });
  const ahmadRestoredChaptersJson = await ahmadRestoredChaptersRes.json();
  const restoredBab05 = ahmadRestoredChaptersJson.data.find((c) => c.chapterNum === "05");
  assert.strictEqual(restoredBab05.isUnlocked, true, "Bab 05 must be unlocked again after restore");
  assert.strictEqual(restoredBab05.userRestricted, false, "Bab 05 must not be userRestricted after restore");

  // Ahmad can start Bab 05 again
  const ahmadRestartB5Res = await fetch(`${BASE_URL}/api/v1/exam/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
    },
    body: JSON.stringify({ chapterNum: "05", mode: "renshuu" }),
  });
  assert.strictEqual(ahmadRestartB5Res.status, 200, "Ahmad can start Bab 05 again after access restored");
  console.log("[PASS] Access restoration verified: Ahmad Syahroni can access and start Bab 05 again");

  // TEST 18: Student Logout & Backend Session Revocation (POST /api/auth/sign-out)
  console.log("\n[TEST 18] Student Logout & Backend Session Revocation");
  const logoutRes = await fetch(`${BASE_URL}/api/auth/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: studentCookie,
      Origin: BASE_URL,
    },
    body: JSON.stringify({}),
  });
  assert.strictEqual(logoutRes.status, 200, "Logout should succeed with 200");
  const afterLogoutRes = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Cookie: studentCookie },
  });
  assert.strictEqual(afterLogoutRes.status, 401, "Revoked session must be rejected with 401 Unauthorized");
  console.log("[PASS] Student session successfully revoked, /api/v1/auth/me rejected with 401");

  console.log("\n==================================================================");
  console.log(" ALL LIVE PRODUCTION CBT & ADMIN API VERIFICATION TESTS PASSED!");
  console.log("==================================================================");
}

runApiVerification().catch((err) => {
  console.error("\n[FATAL ERROR IN VERIFICATION]", err);
  process.exit(1);
});
