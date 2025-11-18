//--------------------------------------------
//
//  Entry
//
//--------------------------------------------

import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";



class InputParam {

    public type : string | null     = null;
}



export function FixJson( _input : string ) : string {

    var output : string     = _input.replace( /%7b/g, "{" );
    output                  = output.replace( /%7d/g, "}" );
    output                  = output.replace( /%22/g, "\"" );
    output                  = output.replace( /%3a/g, ":" );
    output                  = output.replace( /%2c/g, "," );
    output                  = output.replace( /%5b/g, "[" );
    output                  = output.replace( /%5d/g, "]" );

    return output;
}



export const handler = async function ( event: any, context: any ) {
    
    console.log( event );

    if ( event.body == null ) {

        return {

            statusCode: 200,
            headers: {},
            body: "Invalid param"
        };
    }

    console.log( event.body );
    
    //	convert Json to valuables.
    /*
    const json              = Buffer.from( event.body, 'base64' ).toString( 'utf-8' );
    
    console.log( json );
    */
    //var json                = FixJson( event.body );
    //console.log( json );
    const inputParam        = JSON.parse( json );
    var retVal              = "";

    console.log( inputParam );
    console.log( inputParam.type );
    
    if ( inputParam[ "type" ] != null ) {

        console.log( inputParam[ "type" ] );
             
        switch ( inputParam[ "type" ] ) {

            case "InternetCheck":
            {
                try {

                    const response          = await fetch("https://checkip.amazonaws.com");
                    var ipAddress : string  = await response.text();
                    retVal                  = ipAddress;

                    console.log( "ipAddress : " + ipAddress );
                }
                catch ( err ) {

                    console.error( "Internet connection error :", err );
                }

                break;
            }
        }
    }

    return {

        statusCode: 200,
        headers: {},
        body: retVal
    };
};
