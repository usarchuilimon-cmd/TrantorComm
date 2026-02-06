
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://erzuccfcabkocmopxftk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_U_GosiZ6RbhQwMKlJiglhw_7Np-m7wj';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifyRLS() {
    console.log('🔒 Starting RLS Security Verification...');

    // 1. Create a designated "Attacker" user
    const email = `attacker_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`1. Creating Attacker User: ${email}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        console.error('❌ Auth Failed:', authError.message);
        return;
    }

    const userId = authData.user?.id;
    console.log(`✅ User created. ID: ${userId}`);

    // 2. Assign to Organization 1 (Demo Org)
    console.log('2. Inserting User Profile linked to ORG_1...');
    const { error: profileError } = await supabase.from('comm_users').insert({
        id: userId,
        organization_id: 'org_1',
        name: 'Attacker User',
        email: email,
        role: 'AGENT',
        status: 'online'
    });

    if (profileError) {
        console.error('❌ Profile Creation Failed (Possible RLS Insert Block):', profileError.message);
        return;
    }
    console.log('✅ Profile created in ORG_1.');

    // 3. Attempt to access ORG_1 Data (Should Succeed)
    console.log('3. Control Test: Fetching ORG_1 Contacts (Should find some)...');
    const { data: org1Data, error: org1Error } = await supabase
        .from('comm_contacts')
        .select('*')
        .eq('organization_id', 'org_1'); // Explicit filter

    if (org1Error) {
        console.error('❌ Failed to fetch OWN data:', org1Error.message);
    } else {
        console.log(`✅ Success. Found ${org1Data.length} contacts in ORG_1.`);
    }

    // 4. Attempt to access ORG_2 Data (The Attack)
    console.log('4. ATTACK: Attempting to fetch ORG_2 Contacts (Should contain "Luis Hernández")...');

    // Try to list ALL, hoping to see org_2
    const { data: allData, error: allError } = await supabase
        .from('comm_contacts')
        .select('*');

    // Check if any belong to org_2
    const stolenData = allData?.filter(c => c.organization_id === 'org_2') || [];

    if (stolenData.length > 0) {
        console.error(`🚨 SECURITY BREACH! Found ${stolenData.length} contacts from ORG_2!`);
        console.error('Stolen Data Sample:', stolenData[0]);
    } else {
        console.log('🛡️  Defense Successful: 0 contacts from ORG_2 found.');
    }

    // Try explicit query for org_2
    const { data: explicitData } = await supabase
        .from('comm_contacts')
        .select('*')
        .eq('organization_id', 'org_2');

    if (explicitData && explicitData.length > 0) {
        console.error(`🚨 Explicit Query Breach! Found ${explicitData.length} rows.`);
    } else {
        console.log('🛡️  Explicit Query for ORG_2 returned 0 rows.');
    }

    console.log('🏁 Verification Complete.');
}

verifyRLS();
