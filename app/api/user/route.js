import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const userData = cookieStore.get("user-data");

  if (!userData) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = JSON.parse(userData.value);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
  }
}