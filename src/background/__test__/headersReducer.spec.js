import { preHeadersReducer } from '../reducers/headersReducer'
import ChromeWebRequestValidator from '../HeaderValidator'
import fs from "fs"
import path from "path"

describe('>>>REDUCER --- Test Header Reducers', () => {
    it('+++ should trigger correction action when CAPTURE_TOGGLE dispatched', () => {
        let state = {
            toggleCapture: false,
            selectedHeaders: [],
            preHeaderCount: 0,
        }

        state = preHeadersReducer(
            state,  { type: "CAPTURE_TOGGLE", captureToggle: true }
        )

        expect(state.toggleCapture).toEqual(true)
    });
});

describe('>>>CAPTURER --- Test capturer application logic', () => {
    expect.extend({
        toBeValidHeader(received, headerValidator) {
            const pass = headerValidator.validate(received);
            let errorMessage = (
                !pass ?
                "Error message: " + headerValidator.ajv.errorsText(headerValidator.validate.errors) :
                undefined
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

    it('+++ should validate that all required keys with the correct format of values are present when provided mock JSON', () => {        
        let mockHTTPFile = JSON.parse(fs.readFileSync(path.join(__dirname) + "\\mockChromeWebRequest.json"))
        let headerValidator = new ChromeWebRequestValidator()

        for ( let sampleHeaders in mockHTTPFile ) {
                        
            mockHTTPFile[sampleHeaders].map((mockHTTP) => {
                if (sampleHeaders == "valid")
                    expect(mockHTTP).toBeValidHeader(headerValidator)
                else
                    expect(mockHTTP).not.toBeValidHeader(headerValidator)
            });
        }
    });

});

describe('>>>STORE --- Integration test', () => {
    it('+++ should setup mock store when mock request dispatched via an action', () => {});
    it('+++ should pass the mock store into content Provider and assert table component via snapshot ', () => {});
});