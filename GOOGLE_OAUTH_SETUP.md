# Google OAuth Setup Guide for Vaccine Village

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: "Vaccine Village"
4. Click "Create"

## Step 2: Configure OAuth Consent Screen

1. In the left menu, go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Click **Create**
4. Fill in the required fields:
   - App name: `Vaccine Village`
   - User support email: [Your email]
   - Developer contact: [Your email]
5. Click **Save and Continue**
6. **Scopes**: Click "Add or Remove Scopes"
   - Select: `userinfo.email`, `userinfo.profile`, `openid`
   - Click **Update** → **Save and Continue**
7. **Test users**: Add your Gmail address for testing
8. Click **Save and Continue**

## Step 3: Create OAuth 2.0 Client IDs

### A. Web Client ID (Required)

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Vaccine Village Web`
5. **Authorized JavaScript origins**: Add:
   - `http://localhost:19006`
   - `https://localhost:19006`
6. **Authorized redirect URIs**: Add:
   - `http://localhost:19006/`
   - `https://auth.expo.io/@YOUR_EXPO_USERNAME/vaccine-village`
7. Click **Create**
8. **SAVE THE CLIENT ID** - you'll need this!

### B. iOS Client ID (Required for iOS devices)

1. Click **Create Credentials** → **OAuth client ID**
2. Application type: **iOS**
3. Name: `Vaccine Village iOS`
4. Bundle ID: `com.vaccinevillage.app`
5. Click **Create**
6. **SAVE THE CLIENT ID**

### C. Android Client ID (Required for Android devices)

1. First, get your SHA-1 fingerprint:
   ```bash
   # For Expo Go development, use Expo's debug keystore SHA-1:
   # SHA-1: E5:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
   ```
   
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Android**
4. Name: `Vaccine Village Android`
5. Package name: `com.vaccinevillage.app`
6. SHA-1 certificate fingerprint: `E5:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
7. Click **Create**
8. **SAVE THE CLIENT ID**

## Step 4: Add Credentials to Replit

After creating all three client IDs, you'll need to add them as secrets in Replit:

1. In Replit, go to the **Secrets** tab (lock icon in the left sidebar)
2. Add the following secrets:
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: [Your Web Client ID]
   - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`: [Your iOS Client ID]
   - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`: [Your Android Client ID]

**Important**: The `EXPO_PUBLIC_` prefix makes these accessible in the Expo app.

## Step 5: Testing

Once you've added all three client IDs as secrets:
1. The app will automatically detect them
2. You can test on:
   - **Web**: Should work immediately at localhost
   - **iOS**: Scan QR code with Expo Go app
   - **Android**: Scan QR code with Expo Go app

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Double-check your redirect URIs in Google Console
- Make sure `https://auth.expo.io/@YOUR_EXPO_USERNAME/vaccine-village` matches your Expo username

### "Developer Error" on Android
- Verify SHA-1 fingerprint matches exactly
- Use Expo's debug SHA-1 for Expo Go testing

### iOS not working
- Verify bundle identifier is exactly `com.vaccinevillage.app`
- Make sure you added the iOS Client ID secret

---

**Ready to continue?** Once you've added the three client IDs as Replit secrets, the app will be ready to use Google authentication!
