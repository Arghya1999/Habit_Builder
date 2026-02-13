import { NextResponse } from 'next/server';

// Razorpay plan IDs (set these in .env after creating plans in Razorpay Dashboard)
const RAZORPAY_PLANS: Record<string, Record<string, string>> = {
    pro: {
        monthly: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || 'plan_pro_monthly',
        yearly: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || 'plan_pro_yearly',
    },
    premium: {
        monthly: process.env.RAZORPAY_PREMIUM_MONTHLY_PLAN_ID || 'plan_premium_monthly',
        yearly: process.env.RAZORPAY_PREMIUM_YEARLY_PLAN_ID || 'plan_premium_yearly',
    },
};

// INR pricing in paise (1 INR = 100 paise)
const PRICING_INR = {
    pro: { monthly: 4900, yearly: 29 * 12 * 100 }, // ₹49/mo or ₹29/mo billed yearly
    premium: { monthly: 14900, yearly: 99 * 12 * 100 }, // ₹149/mo or ₹99/mo billed yearly
};

// POST /api/razorpay - create Razorpay order or subscription
export async function POST(request: Request) {
    const body = await request.json();
    const { planId, billing, action } = body;

    if (!planId || !['pro', 'premium'].includes(planId)) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const billingCycle = billing || 'monthly';

    if (action === 'subscription') {
        // TODO: Create Razorpay subscription
        // const Razorpay = require('razorpay');
        // const rzp = new Razorpay({
        //   key_id: process.env.RAZORPAY_KEY_ID,
        //   key_secret: process.env.RAZORPAY_KEY_SECRET,
        // });
        //
        // const subscription = await rzp.subscriptions.create({
        //   plan_id: RAZORPAY_PLANS[planId][billingCycle],
        //   total_count: billingCycle === 'monthly' ? 12 : 1,
        //   quantity: 1,
        //   customer_notify: 1,
        // });

        return NextResponse.json({
            subscriptionId: 'sub_mock_' + Date.now(),
            planId: RAZORPAY_PLANS[planId][billingCycle],
            amount: PRICING_INR[planId as keyof typeof PRICING_INR][billingCycle as keyof typeof PRICING_INR['pro']],
            currency: 'INR',
            billing: billingCycle,
        });
    }

    // Default: create one-time order (for single payment or first payment)
    // TODO: Create Razorpay order
    // const order = await rzp.orders.create({
    //   amount: PRICING_INR[planId][billingCycle],
    //   currency: 'INR',
    //   receipt: `receipt_${planId}_${Date.now()}`,
    //   payment_capture: 1,
    //   notes: { plan: planId, billing: billingCycle },
    // });

    const amount = PRICING_INR[planId as keyof typeof PRICING_INR][billingCycle as keyof typeof PRICING_INR['pro']];

    return NextResponse.json({
        orderId: 'order_mock_' + Date.now(),
        amount,
        currency: 'INR',
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
        name: 'RoutineForge',
        description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan - ${billingCycle}`,
        prefill: {
            // TODO: fill from authenticated user
            name: '',
            email: '',
            contact: '',
        },
        theme: {
            color: '#6C5CE7',
        },
    });
}

// POST /api/razorpay/verify - verify payment signature
export async function PUT(request: Request) {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // TODO: Verify signature
    // const crypto = require('crypto');
    // const generated = crypto
    //   .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    //   .update(razorpay_order_id + '|' + razorpay_payment_id)
    //   .digest('hex');
    //
    // if (generated !== razorpay_signature) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }
    //
    // // Update user plan in database
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { plan: 'PRO' }, // or 'PREMIUM'
    // });

    return NextResponse.json({
        verified: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
    });
}
