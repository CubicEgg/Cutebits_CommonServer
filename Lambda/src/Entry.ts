//--------------------------------------------
//
//  Entry
//
//--------------------------------------------

import { ExchangeToMPoint, MPointResponse } from "./Types/ExchangeToMPoint";



export const handler = async function ( event: any ) {
    
    console.log( "event : " + event );

    if ( event.body == null ) {

        return {

            statusCode: 200,
            headers: {},
            body: "Invalid param"
        };
    }

    const inputParam        = JSON.parse( event.body );
    
    var retVal              = "";

    if ( inputParam[ "type" ] != null ) {

        console.log( inputParam[ "type" ] );
             
        switch ( inputParam[ "type" ] ) {

            case "ExchangeMPoint":
            {
                try {

                    const mPoint : MPointResponse   = await ExchangeToMPoint( inputParam[ "id" ],
                                                                              inputParam[ "amount" ],
                                                                              inputParam[ "strNowTime" ],
                                                                              inputParam[ "phoneNumber" ],
                                                                              inputParam[ "mpoint_AppID" ],
                                                                              inputParam[ "mpoint_AppSecret" ],
                                                                              inputParam[ "mpoint_Domain" ] );
                    
                    retVal      = JSON.stringify( mPoint );
                }
                catch ( err ) {

                    console.error( "ExchangeMPoint error :", err );
                }

                break;
            }
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
