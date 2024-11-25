import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const theatreDataPath = path.join(process.cwd(), 'src', 'data', 'theatreData.json');
    const theatreData = JSON.parse(await fs.readFile(theatreDataPath, 'utf8'));
    
    return NextResponse.json(theatreData);
  } catch (error) {
    console.error('Error fetching theatre data:', error);
    return NextResponse.json({ 
      error: 'Internal server error while fetching theatre data' 
    }, { status: 500 });
  }
}
