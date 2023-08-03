import { Helper } from '../../src/main/web-auth/Helper';
import { expect } from '@jest/globals';


test('Helper.CreateForm', () => {
    const form =  Helper.createForm("http://google.com", {
            key1 : "value1"},
        "POST");
    if(form !== undefined){
        expect(form.method).toBe('post');

    }
});

test('Helper.CreatePromise', () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "image/jpeg")
    const data = Helper.createPostPromise({
        key1 : "value1"},'http://google.com',false,'a' ,myHeaders)
    expect(data).not.toBe(null)

});

