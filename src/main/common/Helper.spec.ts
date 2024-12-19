import { Helper } from './Helper';
import { expect } from '@jest/globals';


test('Helper.CreateForm', () => {
    const form = Helper.createForm("http://google.com", {
        key1: "value1"
    },
        "POST");
    if (form !== undefined) {
        expect(form.method).toBe('post');

    }
});

test('Helper.CreatePromise', () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "image/jpeg")
    const data = Helper.createHttpPromise({
        key1: "value1"
    }, 'http://google.com', false, "POST", 'a', myHeaders)
    expect(data).not.toBe(null)

});

test('setAcceptLanguageHeader', () => {
    const locale = 'en-gb'
    Helper.setAcceptLanguageHeader(locale);
    expect(window.localeSettings).toBe(locale);
});

