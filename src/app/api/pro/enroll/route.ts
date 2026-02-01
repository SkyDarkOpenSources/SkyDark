import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { addProMember } from '../../../../../lib/actions/pro.action';

export async function POST() {
  try {
    const user = await currentUser();
    const email = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ success: false, error: 'No email' }, { status: 400 });
    }

    const res = await addProMember(email);
    if (res.success) return NextResponse.json({ success: true });
    return NextResponse.json({ success: false, error: res.error }, { status: 500 });
  } catch (error) {
    console.error('Enroll error', error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
