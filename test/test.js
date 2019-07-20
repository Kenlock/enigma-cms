import React from 'react';
import { expect } from 'chai';
import Enzyme, { render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import { GeneratedForm, CodeEditor } from '../src/client/reusables';
import { default as camelcaseConvert }
  from '../src/client/utils/camelcase_convert';
import { default as gensig } from '../src/lib/utils/gensig';
import { default as formGenUtils } from '../src/client/utils/form_from_obj';
import { loget, loset } from '../src/client/utils/lofuncs.js';

describe('Reusable UI Components - Generated Form', function() {
  it('renders one parameter correctly', function(done) {
    var parameters = {
      username: {
        label: 'Username',
        type: 'text'
      }
    };
    const wrapper = render(<GeneratedForm params={parameters}
      title="Find User" method="post" formAction="" />);
    expect(wrapper.find('h2')).to.have.lengthOf(1);
    expect(wrapper.find('h2').text()).to.equal('Find User');
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(1);
    expect(wrapper.find('label[for="username"]')).to.have.lengthOf(1);
    expect(wrapper.find('label[for="username"]').text()).to.equal('Username');
    done();
  });

  it('renders recursively without error', function(done) {
    var parameters = {
      guestList: {
        type: '[object]',
        shape: {
          firstName: {
            type: 'text'
          },
          lastName: {
            type: 'text'
          },
          age: {
            type: 'number'
          },
          contactInformation: {
            type: 'object',
            shape: {
              phone: {
                type: 'text'
              },
              email: {
                type: 'text'
              }
            }
          }
        },
        value: [{
          firstName: 'John',
          lastName: 'Doe',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      }
    };
    const wrapper = render(<GeneratedForm params={parameters}
      title="Event Summary" method="post" formAction="" />);
    expect(wrapper.text().indexOf('Contact Information'))
      .to.be.greaterThan(-1);
    expect(wrapper.text().indexOf('Phone'))
      .to.be.greaterThan(-1);
    expect(wrapper.find('input[type="text"]')).to.have.lengthOf(4);
    expect(wrapper.find('input[type="number"]')).to.have.lengthOf(1);
    done();
  });
});

describe('Reusable UI Components - Code Editor', function() {
  it('renders correctly with existing value', function(done) {
    const wrapper = render(<CodeEditor grammar="html" name="post-body"
      id="post-body" value="<h1>Hello World!</h1>" />);
    expect(wrapper.find('textarea').text()).to.equal('<h1>Hello World!</h1>');
    done();
  });
});

describe('Camel Case String Conversion', function() {
  it('one word', function(done) {
    expect(camelcaseConvert('monkey')).to.equal('Monkey');
    done();
  });

  it('two words', function(done) {
    expect(camelcaseConvert('codeMonkey')).to.equal('Code Monkey');
    done();
  });

  it('three words', function(done) {
    expect(camelcaseConvert('threeLeggedDog'))
      .to.equal('Three Legged Dog');
    done();
  });
});

describe('Signature Generator', function () {
  it('generates signatures correctly', function (done) {
    var obj = { a: 5, b: 4 }, regex = /#[\da-f]{6} #[\da-f]{6}/;
    expect(gensig(obj)).to.match(regex);
    done();
  });
});

describe('Form from Obj', function() {
  it('Key Util Functions', function(done) {
    var obj = {
        'a': 2,
        'b': {
          'c': [1,3]
        },
        'd': ['e', { 'f': 'g' }]
      }, expected =
      ['a', 'b', 'b.c', 'b.c.0', 'b.c.1', 'd', 'd.0', 'd.1', 'd.1.f'], exp =
      ['a', 'b.c.0', 'b.c.1', 'd.0', 'd.1.f'],
      e = { 'a': 2, 'b.c.0': 1, 'b.c.1': 3, 'd.0': 'e', 'd.1.f': 'g' };
    expect(formGenUtils.outputKeys(obj, true)).to.deep.equal(expected);
    expect(formGenUtils.outputKeys(obj, false)).to.deep.equal(exp);
    expect(formGenUtils.mapKeysToValues(obj)).to.deep.equal(e)
    done();
  });

  it('Form from JSON gen fucntion', function(done) {
    var parameters = {
        guestList: {
          type: '[object]',
          shape: {
            firstName: {
              type: 'text'
            },
            lastName: {
              type: 'text'
            },
            age: {
              type: 'number'
            },
            contactInformation: {
              type: 'object',
              shape: {
                phone: {
                  type: 'text'
                },
                email: {
                  type: 'text'
                }
              }
            }
          }
        }
      }, values = {
        guestList: [{
          firstName: 'John',
          lastName: 'Doe',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      };
    expect(formGenUtils.formFromObj(parameters, values)).to.deep.equal([
      {
        component: 'FormObjectInputLabel',
        innerText: 'Guest List'
      },
      {
        component: 'FormSubmitButton',
        innerText: 'Add',
        attributes: { onClick: 'handleArrayAdd guestList' }
      },
      {
        component: 'FormLabel',
        innerText: 'First Name',
        attributes: { htmlFor: 'guestList.0.firstName' }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 'John',
          id: 'guestList.0.firstName',
          invalid: false,
          name: 'guestList.0.firstName',
          onChange: 'handleChange guestList.0.firstName',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormLabel',
        innerText: 'Last Name',
        attributes: { htmlFor: 'guestList.0.lastName' }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 'Doe',
          id: 'guestList.0.lastName',
          invalid: false,
          name: 'guestList.0.lastName',
          onChange: 'handleChange guestList.0.lastName',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormLabel',
        innerText: 'Age',
        attributes: {
          htmlFor: 'guestList.0.age'
        }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 50,
          id: 'guestList.0.age',
          invalid: false,
          name: 'guestList.0.age',
          onChange: 'handleChange guestList.0.age',
          type: 'number',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormObjectInputLabel',
        innerText: 'Contact Information'
      },
      {
        component: 'FormLabel',
        innerText: 'Phone',
        attributes: {
          htmlFor: 'guestList.0.contactInformation.phone'
        }
      },
      {
        component: 'FormInput',
        attributes: {
          value: '123-456-7890',
          invalid: false,
          id: 'guestList.0.contactInformation.phone',
          name: 'guestList.0.contactInformation.phone',
          onChange: 'handleChange guestList.0.contactInformation.phone',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormLabel',
        innerText: 'Email',
        attributes: {
          htmlFor: 'guestList.0.contactInformation.email'
        }
      },
      {
        component: 'FormInput',
        attributes: {
          value: 'john@johndoe.net',
          invalid: false,
          id: 'guestList.0.contactInformation.email',
          name: 'guestList.0.contactInformation.email',
          onChange: 'handleChange guestList.0.contactInformation.email',
          type: 'text',
          required: false,
          hidden: false,
          noValidate: true
        }
      },
      {
        component: 'FormSubmitButton',
        attributes: {
          onClick: 'handleArrayRemove guestList 0'
        },
        innerText: 'Remove'
      }
    ]);
    done();
  });

  it('Validation function', function(done) {
    var parameters = {
        guestList: {
          type: '[object]',
          shape: {
            firstName: {
              type: 'text',
              required: true
            },
            lastName: {
              type: 'text',
              required: true
            },
            age: {
              type: 'number'
            },
            contactInformation: {
              type: 'object',
              shape: {
                phone: {
                  type: 'text'
                },
                email: {
                  type: 'text'
                }
              }
            }
          }
        }
      }, valuesValid = {
        guestList: [{
          firstName: 'John',
          lastName: 'Doe',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      }, valuesInvalid = {
        guestList: [{
          firstName: 'John',
          lastName: '',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }, {
          firstName: '',
          lastName: '',
          age: 50,
          contactInformation: {
            phone: '123-456-7890',
            email: 'john@johndoe.net'
          }
        }]
      };
    expect(formGenUtils.validateForm(parameters, valuesValid)).to.be.true;
    expect(formGenUtils.validateForm(parameters,
      valuesInvalid)).to.have.members(['guestList.0.lastName',
      'guestList.1.firstName',
      'guestList.1.lastName']);
    done();
  });
});

describe('loget and loset functions', function() {
  it('loget works', function(done) {
    var object = {
      homies: [
        { name: 'Jack', hobbies: ['art', 'music'] }
      ]
    };
    expect(loget(object, 'homies.0.name')).to.equal('Jack');
    expect(loget(object, 'homies.0.hobbies')).to.deep.equal(['art', 'music']);
    expect(loget(object, 'homies.0.girlfriend')).to.be.undefined;
    done();
  });

  it('loset works', function(done) {
    var object = {
      homies: [
        { name: 'Jack', hobbies: ['art', 'music'] }
      ]
    }
    loset(object, 'homies.0.name', 'John');
    expect(loget(object, 'homies.0.name')).to.equal('John');
    done();
  });
});

describe('Num Key to Shape Key function', function() {
  it('works', function(done) {
    var actual = formGenUtils.numKeyToShapeKey('groups.1.leader.name'),
      expected = 'groups.shape.leader.shape.name';
    expect(actual).to.equal(expected);
    done();
  });
});
