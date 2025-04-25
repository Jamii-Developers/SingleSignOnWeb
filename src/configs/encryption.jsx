import CryptoJS from 'crypto-js';

const Lock =( type, value, key )=>{

    if( type === "encrypt"){
        return CryptoJS.AES.encrypt( JSON.stringify( value ), key).toString( );
    }

    if( type === "decrypt"){
        const bytes = CryptoJS.AES.decrypt( value, key );
      	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      	return decryptedData;
    }

}

export default Lock;

