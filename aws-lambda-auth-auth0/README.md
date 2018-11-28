# Configure Auth0

1. Create an Auth0 API
  - Could create different scopes if needed

2. Create an Auth0 application - Machine to Machine type - which is allowed authorized to request JWT access tokens for the previously created Auth0 API.
 - For the 'Grant type 'password' not allowed ...":
   > Allow "Grant type 'password'" for logging in with this Auth0 Application. This is in Auth0 application's advanced settings -> Grand Types -> Check 'Password'
 - For the 'Authorization server not configured with default connection.'
    > This is in Auth0 Tenant Settings -> Settings -> API Authorization Settings -> Set it to 'Username-Password-Authentication'
 - Create user(s) in Users section with the necessary connection "Username-Password-Authentication"
