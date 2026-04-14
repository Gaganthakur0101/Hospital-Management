import { NextRequest, NextResponse } from "next/server";

import { connect } from "@/lib/dbconfig";
import { getAuthUserFromRequest } from "@/lib/auth";
import Notification from "@/models/notificationModel";
import User from "@/models/userModel";

export async function GET(request: NextRequest) {
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

    const items = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(25)
      .populate("appointment", "appointmentDate scheduledTime status queueNumber");

    const unreadCount = await Notification.countDocuments({ user: user._id, isRead: false });

    return NextResponse.json({ notifications: items, unreadCount }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
