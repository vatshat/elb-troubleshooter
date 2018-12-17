import HeaderValidator from '../../background/HeaderValidator'
import fs from "fs";
import path from "path";

expect.extend({
    toBeValidHeader(received, headerValidator) {
        const pass = headerValidator.validate(received);
        let errorMessage = (
            !pass 
            ? "Error message: " + headerValidator.ajv.errorsText(headerValidator.validate.errors)
            : undefined
        )

        if (pass) {
            return {
                message: () =>
                    `expected headers TO NOT BE valid according to schema from chrome 70 webRequest HttpHeaders object`,
                pass: true,
            };
        } else {
            return {
                message: () =>
                    ` ${errorMessage}
                    expected headers TO BE valid according to schema from chrome 70 webRequest HttpHeaders object`,
                pass: false,
            };
        }
    },
});

test('numeric ranges', () => {
    let headerValidator = new HeaderValidator()
    let mockHTTPFile = JSON.parse(fs.readFileSync(path.join(__dirname) + "\\..\\sandbox.json"))

    expect(mockHTTPFile.valid[5]).toBeValidHeader(headerValidator)

});