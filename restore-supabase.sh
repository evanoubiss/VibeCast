#!/bin/bash
# Script to restore Supabase configuration after running SQL schema

echo "🔄 Restoring Supabase configuration..."

cd /Users/sylviane.lecomte/Documents/Github/VibeCast

if [ -f ".env.local.backup" ]; then
    mv .env.local.backup .env.local
    echo "✅ Supabase configuration restored!"
    echo "📋 Next steps:"
    echo "   1. Make sure you ran the SQL schema in Supabase"
    echo "   2. Make sure anonymous auth is enabled"
    echo "   3. Restart the dev server: npm run dev"
    echo ""
    echo "🔗 Quick links:"
    echo "   - SQL Editor: https://supabase.com/dashboard/project/ceuqmvwdbidzgnshgiuo/sql"
    echo "   - Auth Settings: https://supabase.com/dashboard/project/ceuqmvwdbidzgnshgiuo/auth/providers"
else
    echo "❌ No backup file found (.env.local.backup)"
fi


