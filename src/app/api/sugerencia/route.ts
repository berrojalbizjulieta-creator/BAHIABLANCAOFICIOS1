
import { NextResponse } from 'next/server';
import { getSuggestions } from '@/ai/suggestion-flow';
import { CATEGORIES } from '@/lib/data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required.' },
      { status: 400 }
    );
  }

  try {
    const categoryNames = CATEGORIES.map(c => c.name);
    const suggestedTrades = await getSuggestions(query, categoryNames);
    
    return NextResponse.json({ suggestedTrades });

  } catch (error) {
    console.error('Error in suggestion flow:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions.' },
      { status: 500 }
    );
  }
}
