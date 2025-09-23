import { NextResponse } from 'next/server';
import { suggestTradesFromPrompt } from '@/ai/flows/suggest-trades-from-prompt';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const prompt = url.searchParams.get('q') || '';

  if (!prompt) {
    return NextResponse.json({ suggestedTrades: [] });
  }

  try {
    const response = await suggestTradesFromPrompt({ prompt });
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in suggestion API route:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions from AI' },
      { status: 500 }
    );
  }
}
