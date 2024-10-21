import { NextResponse } from "next/server";

export function middleware(request) {
  // ดึง cookies จาก request
  const userData = request.cookies.get("user-data");

  // ดึง path ที่ user พยายามจะเข้าถึง
  const { pathname } = request.nextUrl;

  // สร้าง URL สำหรับ redirect ไปยัง SSO
  const ssoUrl = new URL("https://sso.bluesystem.co.th/");

  // เพิ่ม returnUrl เป็น query parameter (optional)
  // ssoUrl.searchParams.set("returnUrl", request.url);

  // ถ้าไม่มี user-data cookie ให้ redirect ไป SSO
  if (!userData) {
    console.log("No user-data found, redirecting to SSO");
    return NextResponse.redirect(ssoUrl);
  }

  try {
    // แปลงค่า cookie เป็น object
    const user = JSON.parse(userData.value);

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!user.email || !user.name) {
      console.log("Invalid user data in cookie");
      return NextResponse.redirect(ssoUrl);
    }

    // ถ้าผ่านการตรวจสอบทั้งหมด ให้ดำเนินการต่อ
    const response = NextResponse.next();

    // สามารถเพิ่มหรือแก้ไข headers ได้ถ้าต้องการ
    response.headers.set("x-user-name", user.name);

    return response;
  } catch (error) {
    console.error("Error parsing user data:", error);
    // ถ้าพบข้อผิดพลาดในการแปลงข้อมูล ให้ redirect ไป SSO
    return NextResponse.redirect(ssoUrl);
  }
}

// กำหนด paths ที่ต้องการให้ middleware ทำงาน
export const config = {
  matcher: [
    // ทำงานกับทุก paths ยกเว้น
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
