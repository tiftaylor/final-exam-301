'use strict';

const cheerio = require('cheerio');

/*
--------------------------------------------------------------------------
Write a function named templatingWithJQuery that uses jQuery to:
 - Get the html template from the DOM
 - Copy the contents
 - Fill it with the Star Wars People
 - Append it to the DOM.

Remember, in this test, $ is jQuery, just as it is in a normal web app
--------------------------------------------------------------------------
*/

const starWars = {
  page: 1,
  planet: 'home',
  force: ['light', 'dark'],
  keyPlayers: {
    page: 2,
    force: {
      light: [
        {
          "name": "Luke Skywalker",
          "height": "172",
          "eye_color": "blue"
        },
        {
          "name": "C-3PO",
          "height": "167",
          "eye_color": "yellow"
        },
        {
          "name": "R2-D2",
          "height": "96",
          "eye_color": "red"
        }
      ]
    }
  }
}

let $ = createSnippetWithJQuery(`
<main>
  <section id="template">
    <h2></h2>
    <h3></h3>
    <p></p>
  </section>
</main>
`);

const templatingWithJQuery = () => {

  const lightArray = starWars.keyPlayers.force.light;

  for (let i = 0; i < lightArray.length; i++){
    
    const $clonedSection = $('section:first-child').clone();

    $clonedSection.find('h2').text(lightArray[i].name);
    $clonedSection.find('h3').text(lightArray[i].height);
    $clonedSection.find('p').text(lightArray[i].eye_color);

    $('main').append($clonedSection);

  }

};

///////////////////////////////////////////////////
// TESTS
//////////////////////////////////////////////////

describe('Testing challenge', () => {
  it('It should append the star wars people to the DOM', () => {
    templatingWithJQuery();
    expect($('section h2').eq(1).text()).toStrictEqual('Luke Skywalker');
    expect($('section h3').eq(2).text()).toStrictEqual('167');
    expect($('section p').eq(3).text()).toStrictEqual('red');
  })
});

function createSnippetWithJQuery(html) {
  return cheerio.load(html);
};
