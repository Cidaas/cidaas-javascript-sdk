import { TokenClaim, TokenHeader } from "../token-service/TokenService.model";

export class JwtHelper {
	static decodeTokenHeader(token: string): TokenHeader {
		if (token === null) {
      return null;
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
    }

    const decoded = this.urlBase64Decode(parts[0]);
    if (!decoded) {
      throw new Error('Cannot decode the token.');
    }

    return JSON.parse(decoded) as TokenHeader;

	}

	static decodeToken(token: string): TokenClaim {
		if (token === null) {
			return null;
		}

		const parts = token.split('.');
		if (parts.length !== 3) {
			throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
		}

		const decoded = this.urlBase64Decode(parts[1]);
		if (!decoded) {
			throw new Error('Cannot decode the token.');
		}

		return JSON.parse(decoded) as TokenClaim;
	}

	static urlBase64Decode(str: string): string {
		let output = str.replace(/-/g, '+').replace(/_/g, '/');
		switch (output.length % 4) {
			case 0: {
				break;
			}
			case 2: {
				output += '==';
				break;
			}
			case 3: {
				output += '=';
				break;
			}
			default: {
				throw new Error('Illegal base64url string!');
			}
		}
		return this.b64DecodeUnicode(output);
	}
	
	static b64DecodeUnicode(str: string): string {
		return decodeURIComponent(
			Array.prototype.map
				.call(this.b64decode(str), (c: string) => {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);
	}

	// credits for decoder goes to https://github.com/atk
	static b64decode(str: string): string {
		const chars =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
			let output: string = '';
	
			str = String(str).replace(/=+$/, '');
	
			if (str.length % 4 === 1) {
				throw new Error(
					"'atob' failed: The string to be decoded is not correctly encoded."
				);
			}
	
			for (
				// initialize result and counters
				let bc = 0, bs: number, bufferAsNumber: number, bufferAsString: string, idx = 0;
				// get next character
				(bufferAsString = str.charAt(idx++));
				// character found in table? initialize bit storage and add its ascii value;
				~bufferAsNumber &&
					((bs = bc % 4 ? bs * 64 + bufferAsNumber : bufferAsNumber),
						// and if not first of each 4 characters,
						// convert the first 8 bits to one ascii character
						bc++ % 4)
					? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
					: 0
			) {
				// try to find character in table (0-63, not found => -1)
				bufferAsNumber = chars.indexOf(bufferAsString);
			}
			return output;
	}
}

