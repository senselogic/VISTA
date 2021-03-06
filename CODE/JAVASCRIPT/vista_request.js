// -- VARIABLES

var
    RequestsAreShown = ( window.location.hostname === "localhost" );

// -- FUNCTIONS

function HideRequests(
    )
{
    RequestsAreShown = false;
}

// ~~

function ShowRequests(
    )
{
    RequestsAreShown = true;
}

// ~~

function ShowRequest(
    request
    )
{
    if ( RequestsAreShown )
    {
        Print( request.status );
        Print( GetJsonText( request.response ) );

        if ( ErrorsAreShown
             && IsString( request.response )
             && request.response.startsWith( "<" ) )
        {
            PrintError( request.response );
        }
    }
}

// ~~

function SetRequestHeaders(
    request,
    request_header_map
    )
{
    var
        request_header_name;

    if ( request_header_map !== undefined )
    {
        for ( request_header_name in request_header_map )
        {
            if ( request_header_map.hasOwnProperty( request_header_name ) )
            {
                request.setRequestHeader( request_header_name, request_header_map[ request_header_name ] );
            }
        }
    }
}

// ~~

function SendRequest(
    request_url,
    request_method,
    request_body = null,
    request_header_map = {}
    )
{
    var
        request;

    request = new XMLHttpRequest();

    if ( RequestsAreShown )
    {
        Print( request_url );
        Print( request_method );
        Print( GetJsonText( request_body ) );
        Print( GetJsonText( request_header_map ) );
    }

    return new Promise(
        function (
            resolve,
            reject
            )
        {
            request.onreadystatechange
                = function (
                      )
                  {
                      if ( request.readyState == 4 )
                      {
                          if ( RequestsAreShown )
                          {
                              ShowRequest( request );
                          }

                          if ( request.status >= 300 )
                          {
                              PrintError( request_method + " " + request_url, request );

                              reject( request );
                          }
                          else
                          {
                              resolve( request );
                          }
                      }
                  };

            request.open( request_method, request_url, true );
            SetRequestHeaders( request, request_header_map );
            request.send( request_body );
        }
        );
}

// ~~

function SendTextRequest(
    request_url,
    request_method,
    request_body = null,
    request_header_map = {}
    )
{
    var
        request;

    request = new XMLHttpRequest();

    if ( RequestsAreShown )
    {
        Print( request_url );
        Print( request_method );
        Print( GetJsonText( request_body ) );
        Print( GetJsonText( request_header_map ) );
    }

    return new Promise(
        function (
            resolve,
            reject
            )
        {
            request.onreadystatechange
                = function (
                      )
                  {
                      if ( request.readyState == 4 )
                      {
                          if ( RequestsAreShown )
                          {
                              ShowRequest( request );
                          }

                          if ( request.status >= 300 )
                          {
                              PrintError( request_method + " " + request_url, request );

                              reject( request.response );
                          }
                          else
                          {
                              resolve( request.response );
                          }
                      }
                  };

            request.open( request_method, request_url, true );
            SetRequestHeaders( request, request_header_map );
            request.send( request_body );
        }
        );
}

// ~~

function SendJsonRequest(
    request_url,
    request_method,
    request_object = null,
    request_header_map = {}
    )
{
    var
        request,
        response_object;

    request = new XMLHttpRequest();

    if ( RequestsAreShown )
    {
        Print( request_url );
        Print( request_method );
        Print( GetJsonText( request_object ) );
        Print( GetJsonText( request_header_map ) );
    }

    return new Promise(
        function (
            resolve,
            reject
            )
        {
            request.onreadystatechange
                = function (
                      )
                  {
                      if ( request.readyState == 4 )
                      {
                          if ( RequestsAreShown )
                          {
                              ShowRequest( request );
                          }

                          if ( request.response === null
                               || request.response === "" )
                          {
                              response_object = {};
                          }
                          else
                          {
                              try
                              {
                                  response_object = GetJsonObject( request.response );
                              }
                              catch ( error )
                              {
                                  PrintError( error, request_method + " " + request_url, request );
                              }
                          }

                          if ( request.status >= 300 )
                          {
                              PrintError( request_method + " " + request_url, request );

                              reject( response_object );
                          }
                          else
                          {
                              resolve( response_object );
                          }
                      }
                  };

            request.open( request_method, request_url, true );
            request.setRequestHeader( "Content-type", "application/json; charset=UTF-8" );
            SetRequestHeaders( request, request_header_map );

            if ( request_object === null )
            {
                request.send( null );
            }
            else
            {
                request.send( GetJsonText( request_object ) );
            }
        }
        );
}
