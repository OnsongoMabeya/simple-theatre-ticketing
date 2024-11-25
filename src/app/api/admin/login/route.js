import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Read admin credentials
    const credentialsPath = path.join(process.cwd(), 'src', 'data', 'adminCredentials.json');
    const credentialsData = await fs.readFile(credentialsPath, 'utf8');
    const credentials = JSON.parse(credentialsData);

    // Verify credentials
    if (username === credentials.username && password === credentials.password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
