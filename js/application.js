function getDateString( date ){
    // If no date is given, calculate today's in the tweets.json format
    if( date ){
        return date;
    } else {
        let now   = new Date();
        let year  = now.getFullYear();
        let month = String(now.getMonth() + 1).padStart(2, "0");
        let day   = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
}

async function loadData( date ) {
    const content = document.querySelector( "#content" );

    try {
        const [tweetsJson, daysJson] = await Promise.all([
            fetch("js/tweets.json"),
            fetch("js/days.json"),
        ]);
        let tweets = await tweetsJson.json();
        let days   = await daysJson.json();

        let day   = getDateString( date );
        let pairs = days[day] || [];

        let tweetMap = {};
        tweets.forEach( (tweet) => {
            tweetMap[tweet.id] = tweet;
        });

        let number = 1;

        let html = "";
        pairs.forEach( ( pair ) => {
            const [id1, id2] = pair;
            const tweet1 = tweetMap[id1];
            const tweet2 = tweetMap[id2];

            console.log( 'Tweet 1 URL:', tweet1.url );
            console.log( 'Tweet 2 URL:', tweet2.url );

            if( tweet1.rating > tweet2.rating ){
                winnerNumber = 1;
            } else {
                winnerNumber = 2;
            }
            
            html += `<li class="item-${number} winner-${winnerNumber}" id="${number}">`;

            [tweet1, tweet2].forEach((tweet) => {
                if( tweet ){
                    let img      = tweet.images[0];
                    let title    = tweet.title;
                    let subtitle = tweet.subtitle;
                    let rating   = tweet.rating + '%';
                    let club_name  = tweet.club_name; // barf
                    let country  = tweet.country;

                    let priceFormatter = new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                    });
                    let price = priceFormatter.format( tweet.price );

                    html += `
                    <figure>
                        <img src="${img}" alt="${name}" />
                        <figcaption>
                            <p class="rating">${rating}</p>
                            <section class="label">
                                <p class="number">${number}</p>
                                <p class="title">${title}</p>
                                <p class="subtitle">${subtitle} •︎ ${club_name}, ${country}</p>
                                <p class="price">${price}</p>
                            </section>
                        </figcaption>
                    </figure>
                    `;
                }
            });
            html += `</li>`;

            number++;
        });

        content.innerHTML = html;
    } catch (err) {
        content.innerHTML = "<p>❌ Error! Beansed it up, something went wrong. Yell at me about it, please.</p>";
        console.error(err);
    }

    if( window.location.hash ){
        let skip = window.location.hash.replace( '#', '' );
        console.log( 'Hash given:', skip );
        
        requestAnimationFrame(() => {
            const targetElement = document.querySelector( `.item-${skip}` );
            if (targetElement) { // Add a check just in case
                console.log( 'Target element was found, scrolling it into view.' );
                 targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                console.warn(`Could not find element .item-${skip} to scroll into view.`);
            }
        });
    }
}

loadData();

const dateSelect = document.querySelector( '.date' );
let lastDate     = dateSelect.value;
dateSelect.addEventListener('change', function(e){
    const selectedDate = dateSelect.options[dateSelect.selectedIndex].value;
    lastDate           = selectedDate;
    
    loadData( selectedDate );
});

document.querySelector( '.spoiler-checkbox' ).addEventListener( 'click', function(){
    document.body.classList.toggle( 'spoiler' );
});

let currentItem = 1;

document.addEventListener("keydown", function (event) {
  const ae   = document.activeElement;
  let target = null;
  const key  = event.key;
    
  const modifierPressed = event.ctrlKey || event.altKey || event.metaKey;

  if( key >= "1" && key <= "9" ){
    if( ! modifierPressed ){
      target = parseInt(key, 10);
    }
  } else if( key === "0" ){
    if( ! modifierPressed ){
      target = 10;
    }
  } else if( key === "ArrowRight" ){
    if( currentItem < 10 ){
      target = currentItem + 1;
    }
  }

  if( target !== null ){
    const el = document.querySelector(`.item-${target}`);
    if( el ){
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      currentItem = target;
    }
  }
}); 
