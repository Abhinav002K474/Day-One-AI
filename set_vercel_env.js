const { execSync } = require('child_process');

function runSafe(cmd, opts = {}) {
    try {
        console.log("Running:", cmd);
        execSync(cmd, { stdio: 'ignore', ...opts });
    } catch(e) {
        // ignore errors like 'Environment variable not found'
    }
}

try {
  console.log("Adding SUPABASE_URL...");
  runSafe('npx vercel env rm SUPABASE_URL production -y > NUL 2>&1');
  runSafe('npx vercel env rm SUPABASE_URL preview -y > NUL 2>&1');
  runSafe('npx vercel env rm SUPABASE_URL development -y > NUL 2>&1');
  
  runSafe('npx vercel env add SUPABASE_URL production', { input: Buffer.from("https://eycjxtarsicpfzbzynew.supabase.co") });
  runSafe('npx vercel env add SUPABASE_URL preview', { input: Buffer.from("https://eycjxtarsicpfzbzynew.supabase.co") });
  runSafe('npx vercel env add SUPABASE_URL development', { input: Buffer.from("https://eycjxtarsicpfzbzynew.supabase.co") });

  console.log("Adding SUPABASE_KEY...");
  const sbKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Y2p4dGFyc2ljcGZ6Ynp5bmV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA0NjYwMiwiZXhwIjoyMDg2NjIyNjAyfQ.N_pxZPswn6DNUJn6c28tlFGQFOTgz5JTPhu-2uDnoMQ";
  runSafe('npx vercel env rm SUPABASE_KEY production -y > NUL 2>&1');
  runSafe('npx vercel env rm SUPABASE_KEY preview -y > NUL 2>&1');
  runSafe('npx vercel env rm SUPABASE_KEY development -y > NUL 2>&1');

  runSafe('npx vercel env add SUPABASE_KEY production', { input: Buffer.from(sbKey) });
  runSafe('npx vercel env add SUPABASE_KEY preview', { input: Buffer.from(sbKey) });
  runSafe('npx vercel env add SUPABASE_KEY development', { input: Buffer.from(sbKey) });

  console.log("Triggering Vercel Deploy...");
  runSafe('npx vercel deploy --prod --yes', { stdio: 'inherit' });
  console.log("Done!");
} catch (e) {
  console.error(e.message);
}
