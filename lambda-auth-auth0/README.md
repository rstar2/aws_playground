# Configure Auth0

1. Create an Auth0 API
  - Could create different scopes if needed

2. Create an Auth0 application - Machine to Machine type - which is allowed authorized to request JWT access tokens for the previously created Auth0 API.
    1. For authorizing from the local server - e.g our server with invoke the Auth0 API
        - For the 'Grant type 'password' not allowed ...":
          > Allow "Grant type 'password'" for logging in with this Auth0 Application. This is in Auth0 application's advanced settings -> Grand Types -> Check 'Password'
        - For the 'Authorization server not configured with default connection.'
           > This is in Auth0 Tenant Settings -> Settings -> API Authorization Settings -> Set it to 'Username-Password-Authentication'
        - Create user(s) in Users section with the necessary connection "Username-Password-Authentication"
    2. For authorizing from the browser/client - e.g. the browser will use the Auth0 Lock widget
        - then the add the proper callback URL
          > Add a server's auth callback URL that will be called by Auth0 when use the Auth0 Lock flow. This is in Auth0 application's settings -> Allowed Callback URLs - Add for instance 'http://localhost:3000' (if it's SPA app then any valid internal SPA route url 'http://localhost:3000/profile')
        - also add in the 'Allowed Web Origins' (because of CORS) our local's server origin - 'http://localhost:3000'
          > Add a server's origin that is allowed by Auth0 when use the Auth0 Lock flow. This is in Auth0 application's settings -> Allowed Web Origins - Add for instance 'http://localhost:3000'
    3. There are may other ways to authenticate with Auth0 - can implement the whole OAuth2 workflow (exchanging codes)

    4. For authorizing on behalf of the server - e.g the Auth0 app
     This means that proper access JWT token will be created but not connected with a specific user,
     meaning we can authorize the API endpoint (in this case the AWS API) so that only our server can use it (or give the access JWT to the browser webapp to use it - this is not secure as all users of the webapp will use the same JWT)

