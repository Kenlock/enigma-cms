import { expect } from 'chai';
import { default as gensig } from '../src/lib/utils/gensig';
import matchThePath,
{ returnPathKeys } from '../src/lib/utils/match_the_path';

describe('Signature Generator', function () {
  it('generates signatures correctly', function (done) {
    var obj = { a: 5, b: 4 }, regex = /#[\da-f]{6} #[\da-f]{6}/;
    expect(gensig(obj)).to.match(regex);
    done();
  });
});

describe('Router', function() {
  it('path matcher 1', function(done) {
    let actual = returnPathKeys('/profile/:id');
    expect(actual.keys).to.deep.equal(['id']);
    done();
  });

  it('path matcher 2', function(done) {
    let actual = matchThePath('/profile/bruh', { path: '/profile/:id' });
    expect(actual).to.deep.equal({
      path: '/profile/:id',
      url: '/profile/bruh',
      params: {
        id: 'bruh'
      }
    });
    done();
  });

  it('path matcher 3', function(done) {
    let actual = matchThePath('/post/what-up', {
      path: ['/post/:slug', '/posts/:slug']
    });
    expect(actual).to.deep.equal({
      path: '/post/:slug',
      url: '/post/what-up',
      params: {
        slug: 'what-up'
      }
    });
    done();
  });
});
