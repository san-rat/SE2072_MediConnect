# ✅ CORS Fix Applied - Deployment Instructions

## 🔧 What Was Fixed

**Problem**: The CORS configuration was using `allowedOriginPatterns` for exact URLs when `allowCredentials(true)` was set. Spring Security requires specific origins (via `allowedOrigins()`) for exact URLs when credentials are enabled.

**Solution**: Split the configuration into:
- **ALLOWED_ORIGINS**: Exact URLs (localhost ports + production Vercel URL)
- **ALLOWED_ORIGIN_PATTERNS**: Wildcard patterns for dynamic subdomains

## 📝 Changes Made

### `CorsConfig.java`
1. Split origins into two lists:
   - `ALLOWED_ORIGINS` - exact URLs including `https://mediconnect-iota.vercel.app`
   - `ALLOWED_ORIGIN_PATTERNS` - wildcards for dynamic Vercel preview URLs
2. Updated `addCorsMappings()` to use both `.allowedOrigins()` and `.allowedOriginPatterns()`
3. Updated `buildCorsConfiguration()` to set both origins and patterns

## 🚀 Deploy to Railway

### Option 1: Git Push (Recommended)
```bash
git add src/main/java/com/mediconnect/config/CorsConfig.java
git commit -m "fix: CORS configuration for Vercel production"
git push origin main
```

Railway will automatically detect the changes and redeploy.

### Option 2: Manual Railway CLI
```bash
railway up
```

## 🧪 Testing After Deployment

### 1. Wait for Railway deployment to complete
Check Railway dashboard for "Deployed" status.

### 2. Test with curl (from terminal)
```bash
curl -X OPTIONS https://se2072mediconnect-production.up.railway.app/api/auth/register/patient \
  -H "Origin: https://mediconnect-iota.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

**Expected Response Headers**:
```
Access-Control-Allow-Origin: https://mediconnect-iota.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, ...
Access-Control-Allow-Credentials: true
```

### 3. Test from Frontend
Open `https://mediconnect-iota.vercel.app` and try registering a patient.

**Expected**: Registration succeeds, no CORS errors in console.

## 📊 Monitoring

### Check Railway Logs
```bash
railway logs
```

You should now see:
- `OPTIONS /api/auth/register/patient` → 200 OK
- `POST /api/auth/register/patient` → 200 OK (or appropriate status)

## ❓ If It Still Fails

### 1. Verify Railway Environment
Make sure Railway picked up the new build. Check deployment logs for:
```
BUILD SUCCESS
```

### 2. Clear Browser Cache
Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### 3. Check for Typos
Ensure the Vercel URL is **exactly**:
```
https://mediconnect-iota.vercel.app
```
No trailing slash, no www, exact match.

### 4. Railway Cache Issue
If Railway cached the old build:
```bash
railway down
railway up --detach
```

## 🎯 Why This Fix Works

### Before (❌ Broken)
- Used `allowedOriginPatterns` for exact URLs
- Spring Security rejected preflight because patterns ≠ origins when credentials enabled
- Browser blocked request before it reached backend

### After (✅ Fixed)
- Uses `allowedOrigins` for exact URLs
- Uses `allowedOriginPatterns` for wildcards
- Spring Security properly handles both cases
- Preflight passes, POST request reaches backend

## 📋 Key Configuration Points

### SecurityConfig.java (Already Correct ✅)
```java
.cors(cors -> cors.configurationSource(corsConfigurationSource))
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
```

### CorsConfig.java (Now Fixed ✅)
```java
// Exact origins
config.setAllowedOrigins(ALLOWED_ORIGINS);
// Wildcard patterns
config.setAllowedOriginPatterns(ALLOWED_ORIGIN_PATTERNS);
// Credentials enabled
config.setAllowCredentials(true);
```

## ✅ Verification Checklist

- [ ] Changes committed to git
- [ ] Pushed to Railway
- [ ] Railway deployment successful
- [ ] curl preflight test passes
- [ ] Browser registration works
- [ ] No CORS errors in console
- [ ] Railway logs show POST requests

---

**Next Step**: Push these changes to Railway and test from your Vercel frontend!
