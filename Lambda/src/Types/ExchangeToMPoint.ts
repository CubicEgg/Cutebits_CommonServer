//--------------------------------------------
//
//	ExchangeToMPoint
//
//--------------------------------------------

import { createSign, constants } from 'crypto';



export class MPointCode 
{
    transaction_id: string;
    register_date : string;
    phone: string;
    amount: number;
}

export class MPointResponse {

    public code : number;
    public message : string;
    public data : MPointUser;
    public mPointCode : MPointCode;
}

export class MPointUser {
    
    public balance: number;
    public phone: string;
}



export async function ExchangeToMPoint( _id : string,
                                        _amount : number,
                                        _strNowTime : string,
                                        _phoneNumber : string,
                                        _mpoint_AppID : string,
                                        _mpoint_AppSecret : string,
                                        _mpoint_Domain : string ) : Promise<MPointResponse> {
    
    var response : MPointResponse  = new MPointResponse();

    const transactionId = `CE_${_id.toString().padStart(8, '0')}_${_amount}_${_strNowTime.replace(/[^0-9]/g, "")}`;

    const dataToSign    = {

        app_id : _mpoint_AppID,
        app_secret : _mpoint_AppSecret,
        transaction_id : transactionId,
        phone : _phoneNumber
    };

    const dataJson  = JSON.stringify( dataToSign );

    // Signing with RSA-SHA256
    const privateKey    = process.env.MPOINT_PRIVATE_KEY;

    if ( !privateKey ) {

        console.error( "MPOINT_PRIVATE_KEY environment variable not set." );
        response.code       = 500;
        response.message    = "Server configuration error: missing private key.";
        
        return response;
    }

    // The private key is passed as a single line with spaces from AWS Lambda env vars.
    // We need to reformat it into a valid PEM string with newlines.
    const keyHeader     = "-----BEGIN RSA PRIVATE KEY-----";
    const keyFooter     = "-----END RSA PRIVATE KEY-----";
    const keyBody       = privateKey.replace( keyHeader, "" ).replace( keyFooter, "" ).replace( /\s/g, "" );
    const formattedPrivateKey   = `${keyHeader}\n${keyBody}\n${keyFooter}`;

    // Use the explicit algorithm from the documentation for clarity
    const sign = createSign( 'RSA-SHA256' );
    sign.update( dataJson );
    sign.end();
    const signature     = sign.sign({ key: formattedPrivateKey, padding: constants.RSA_PKCS1_PADDING }, 'base64');

    const requestBody   = {

        app_id: _mpoint_AppID,
        signature: signature,
        data: {
            transaction_id: transactionId,
            phone: _phoneNumber,
            amount: _amount
        }
    };

    console.log("Request body:", JSON.stringify(requestBody));

    const endpoint  = `${_mpoint_Domain}/api/v1/point-transaction/create-point-transaction`;
    const headers   = {
        'Content-Type': 'application/json'
    };

    try {

        console.log( "Calling MPoint API with endpoint:", endpoint );

        const fetchResponse = await fetch( endpoint, {

            method: 'POST',
            headers: headers,
            body: JSON.stringify( requestBody )
        });

        console.log( "MPoint API response status:", fetchResponse.status );

        const responseText = await fetchResponse.text();
        console.log("MPoint API response text:", responseText);

        if ( fetchResponse.ok ) {

            const jsonResponse  = JSON.parse( responseText );
            response            = jsonResponse;

            if ( response.code == 0 ) {

                response.mPointCode                 = new MPointCode();
                response.mPointCode.transaction_id  = transactionId;
                response.mPointCode.phone           = _phoneNumber;
                response.mPointCode.amount          = _amount;
            }
        }
        else {

            console.error( "MPoint API Error:", responseText );
            response.code       = fetchResponse.status;
            response.message    = `MPoint API returned an error: ${responseText}`;
        }
    }
    catch ( error ) {

        console.error( "Failed to call MPoint API:", error );
        response.code       = 500;
        response.message    = "Failed to communicate with MPoint API.";
    }
    
    console.log( "Exiting ExchangeMPoint" );

    return response;
};