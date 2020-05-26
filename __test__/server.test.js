const chai = require('chai');
const mocha = require('mocha');
const axios = require('axios');
const util = require('./testUtils');

const { expect } = chai;
const { describe, it } = mocha;

const sampleData = require('./fixtures/users.json');

describe('POST/ signup', async () => {
  const newUser = {
    name: '모근강화',
    email: 'hairgrow@gmail.com',
    mobile: '010-1010-0101',
    password: '1q2w3e4r',
  };

  it("throw error 400 when request body doesn't have any of email, name, password, mobile", async () => {
    const partialInfo = (person, omitIndex) => Object.keys(person).reduce((acc, key, i) => {
      if (i === omitIndex) return acc;
      acc[key] = person[key];
      return acc;
    }, {});

    const testSignup = (data) => new Promise((resolve) => {
      axios.post('http://localhost:5000/signup', data)
        .then((res) => resolve(res.data))
        .catch((err) => resolve(err.response));
    });

    const testCases = [];
    for (let i = 0; i < 4; i += 1) {
      const partialData = partialInfo(newUser, i);
      testCases.push(testSignup(partialData));
    }
    const results = await Promise.all(testCases);
    results.forEach((el) => {
      expect(el.data, 'error message should be INVALID INPUT').to.equal('INVALID INPUT');
      expect(el.status, 'error status code should be 400').eq(400);
    });
  });

  it('respond with 200 when signup is successful', async () => {
    const res1 = await axios.post(util.localUrl('signup'), newUser);
    expect(res1.data, 'response should include infos that has provided').have.deep.include(newUser);
  });

  it('respond with 400 when email is duplicate', async () => {
    const res2 = await new Promise((resolve) => {
      axios.post(util.localUrl('signup'), sampleData[0])
        .catch((err) => resolve(err.response));
    });
    expect(res2.status, 'it should respond with status code 400').to.eq(400);
    expect(res2.data, 'it should send message "duplicate"').to.eq('duplicate');
  });
});

describe('POST/ signin', () => {
  it('respond with 400 when either of input is absent', () => {
    expect().to.eq('');
  });
  it('respond with 400 when there is no corresponding user', () => {
    expect().to.eq('');
  });
  it('send accessToken through cookie and save it in a session', () => {
    expect().to.eq('');
  });
  it('send user info as response, except sensitive informations', () => {
    expect().to.eq('');
  });
});

describe('POST/ signout', () => {
  it('should destroy session and accessToken in a cookie', () => {
    expect().to.eq('');
  });
});

describe('GET/ users', () => {
  it('send message "TYPE IS NOT SPCIFIED" when type is missing in request body', () => {
    expect().to.eq('');
  });
  it('send message "UNAUTHORIZED REQUEST" when accessToken is absent on session or auth is not admin', () => {
    expect().to.eq('');
  });
  it('send auth, totalVacation, leftVacation, email, mobile, group as response', () => {
    expect().to.eq('');
  });
});

describe('POST/ users', () => {
  it('send message "TYPE IS NOT SPCIFIED" when type is missing in request body', () => {
    expect().to.eq('');
  });
});


describe('POST/ group', () => {

});

describe('POST/ vacation', () => {

});

describe('POST/ company', () => {

});
