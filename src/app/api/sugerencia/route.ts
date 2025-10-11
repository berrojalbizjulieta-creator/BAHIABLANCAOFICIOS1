
import { NextResponse } from 'next/server';

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
    // La funcionalidad de Genkit ha sido eliminada temporalmente para estabilizar la app.
    // Devolvemos un array vacío.
    return NextResponse.json({ suggestedTrades: [] });
  } catch (error) {
    console.error('Error in suggestion flow:', error);
    return NextResponse.json(
      { error: 'Failed to get suggestions.' },
      { status: 500 }
    );
  }
}
