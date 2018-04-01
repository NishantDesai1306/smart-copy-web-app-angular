import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider } from "angular5-social-login";
import { Constants } from "../shared/constants.service";

export function getAuthServiceConfigs() {
    return new AuthServiceConfig([
        {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(Constants.FACEBOOK_APP_ID)
        }, {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(Constants.GOOGLE_CLIENT_ID)
        }
    ]);
}