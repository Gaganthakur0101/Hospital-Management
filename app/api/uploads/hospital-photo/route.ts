import { NextRequest, NextResponse } from "next/server";

import { connect } from "@/lib/dbconfig";
import { getAuthUserFromRequest } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  await connect();

  const authUser = getAuthUserFromRequest(request);
  if (!authUser?.id) {
    return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
  }

  const user = await User.findById(authUser.id);
  if (!user || user.role !== "doctor") {
    return NextResponse.json({ error: "Only doctors can upload hospital photos." }, { status: 403 });
  }

  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Add env variables first." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "hospital-management/hospitals",
      resource_type: "image",
    });

    return NextResponse.json({ imageUrl: result.secure_url }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
