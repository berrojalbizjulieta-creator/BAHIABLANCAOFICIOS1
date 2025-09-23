
import { suggestTradesFromPrompt } from '@/ai/flows/suggest-trades-from-prompt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required.' },
      { status: 400 }
    );
  }

  try {
    const result = await suggestTradesFromPrompt({ prompt: query });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in suggestion flow:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions.' },
      { status: 500 }
    );
  }
}
