import { NextResponse } from 'next/server';
import { syncExistingUsers } from '../../../../lib/utils/sync-users';

export async function GET() {
  try {
    const result = await syncExistingUsers();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: result.message, errors: result.errors },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in sync endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}