import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET(request) {
  // ดึงค่า token จาก URL query
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Token not found" },
      { status: 400 }
    ).redirect("https://sso.bluesystem.co.th/");
  }

  try {
    const decodedToken = jwtDecode(token);

    const data = {
      name: decodedToken.name,
      email: decodedToken.unique_name,
      ipaddr: decodedToken.ipaddr,
    };

    // สร้าง response สำหรับ redirect
    const response = NextResponse.redirect(new URL("/", request.url));

    // ตั้งค่า cookie ใน response ที่สร้างขึ้น
    response.cookies.set("user-data", JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
}
