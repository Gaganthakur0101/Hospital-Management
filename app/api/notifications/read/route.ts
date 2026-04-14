import { NextRequest, NextResponse } from "next/server";

import { connect } from "@/lib/dbconfig";
import { getAuthUserFromRequest } from "@/lib/auth";
import Notification from "@/models/notificationModel";
import User from "@/models/userModel";

export async function PATCH(request: NextRequest) {
  await connect();

  try {
    const authUser = getAuthUserFromRequest(request);
    if (!authUser?.id) {
      return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
    }

    const user = await User.findById(authUser.id).select("_id");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await Notification.updateMany({ user: user._id, isRead: false }, { $set: { isRead: true } });

    return NextResponse.json({ message: "Notifications marked as read." }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
