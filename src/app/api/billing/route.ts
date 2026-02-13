import { NextResponse } from 'next/server';

// POST /api/billing/checkout - create Stripe checkout session
export async function POST(request: Request) {
    const body = await request.json();
    const { planId, billing } = body;

    if (!planId || !['pro', 'premium'].includes(planId)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // TODO: Create Stripe checkout session
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   payment_method_types: ['card'],
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing?success=true`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing?canceled=true`,
    // });

    return NextResponse.json({
        url: '/dashboard/billing?success=true', // Mock redirect
        sessionId: 'mock_session_' + Date.now(),
        plan: planId,
        billing: billing || 'monthly',
    });
}

// GET /api/billing - get current subscription status
export async function GET() {
    return NextResponse.json({
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        usage: {
            habits: { used: 3, limit: 5 },
            goals: { used: 2, limit: 2 },
            partners: { used: 0, limit: 0 },
        },
    });
}
