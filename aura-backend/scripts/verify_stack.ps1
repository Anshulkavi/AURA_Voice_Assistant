Write-Host "🔍 Verifying Your Tech Stack"
Write-Host "============================"
Write-Host ""

Write-Host "📋 Checking your configuration files..."

# Check Vite config
if (Test-Path "vite.config.js") {
    Write-Host "✅ vite.config.js found - You're using Vite"
} else {
    Write-Host "❌ vite.config.js not found"
}

# Check Next.js config
if (Test-Path "next.config.js" -or Test-Path "next.config.mjs") {
    Write-Host "⚠️  Next.js config found - You might have mixed configs"
} else {
    Write-Host "✅ No Next.js config - Good for Vite project"
}

Write-Host ""
Write-Host "📋 Checking package.json scripts..."

# Check for "dev": "vite"
if (Get-Content "package.json" | Select-String '"dev":\s*"vite"') {
    Write-Host "✅ Using Vite dev server"
} else {
    Write-Host "❌ Not using Vite dev server"
}

# Check for "build": "vite build"
if (Get-Content "package.json" | Select-String '"build":\s*"vite build"') {
    Write-Host "✅ Using Vite build"
} else {
    Write-Host "❌ Not using Vite build"
}

Write-Host ""
Write-Host "📋 Checking for unnecessary Next.js dependencies..."

# Check for "next"
if (Get-Content "package.json" | Select-String '"next"') {
    Write-Host "❌ Found Next.js dependency (not needed for Vite)"
} else {
    Write-Host "✅ No Next.js dependency"
}

# Check for "next-themes"
if (Get-Content "package.json" | Select-String '"next-themes"') {
    Write-Host "❌ Found next-themes (use a Vite-compatible alternative)"
} else {
    Write-Host "✅ No next-themes dependency"
}

Write-Host ""
Write-Host "🎯 Your Actual Stack:"
Write-Host "   - ⚡ Vite (build tool)"
Write-Host "   - ⚛️  React (UI library)"
Write-Host "   - 🎨 Tailwind CSS (styling)"
Write-Host "   - 🧭 React Router (routing)"
Write-Host "   - 🐍 Flask (backend API)"

Write-Host ""
Write-Host "❌ You DON'T need:"
Write-Host "   - Next.js (you're using Vite)"
Write-Host "   - next-themes (use regular React state or context)"
Write-Host "   - Most @radix-ui packages (unless specifically needed)"
Write-Host "   - shadcn/ui (unless specifically needed)"

Write-Host ""
Write-Host "💡 Recommendation: Use the cleaned package.json to fix dependency conflicts"
