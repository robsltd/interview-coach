import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // In a real application, you would parse the request body
    // const { transcript, emotions } = await req.json();

    // Here, we're just simulating a delay and returning mock feedback
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockFeedback = "Great job maintaining a confident tone. Your facial expressions showed high engagement. Consider elaborating more on your role in the project's success.";

    return NextResponse.json({ feedback: mockFeedback });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}