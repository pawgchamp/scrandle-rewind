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

            if( tweet1.rating > tweet2.rating ){
                winnerNumber = 1;
            } else {
                winnerNumber = 2;
            }
            
            html += `<li class="item-${number} winner-${winnerNumber}" id="${number}">`;

            [tweet1, tweet2].forEach((tweet) => {
                if( tweet ){
                    let img    = tweet.images[0];
                    let name   = tweet.short_desc;
                    let rating = tweet.rating + '%';

                    let priceFormatter = new Intl.NumberFormat('en-GB', {
                        style: 'currency',
                        currency: 'GBP',
                    });
                    let price = priceFormatter.format( tweet.price );

                    html += `
                    <figure >
                        <img src="${img}" alt="${name}" />
                        <figcaption>
                            <p class="rating">${rating}</p>
                            <p><span class="number">${number}.</span> ${name}: <strong>${price}</strong></p>
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
        content.innerHTML = "<p>❌ Error! Beansed it up, couldn't get either the FootyScran tweets in totality or the ones you were meant to see today. Soz.</p>";
        console.error(err);
    }
}

loadData();

document.querySelector('.date').addEventListener('change', function(e){
    let date = e.target.value;
    loadData( date );
});



document.querySelector( '.spoiler-checkbox' ).addEventListener( 'click', function(){
    document.body.classList.toggle( 'spoiler' );
});

let currentItem = 1;

document.addEventListener('keydown', function (event) {
  const ae = document.activeElement;
  if (
    ae.tagName === 'INPUT' ||
    ae.tagName === 'TEXTAREA' ||
    ae.isContentEditable
  )
    return;

  let target = null;
  const key = event.key;

  if (key >= '1' && key <= '9') {
    target = parseInt(key, 10);
  } else if (key === '0') {
    target = 10;
  } else if (key === 'ArrowRight') {
    console.log('v');
    // Always advance to the next item, even if the user hasn't scrolled yet
    if (currentItem < 10) {
      target = currentItem + 1;
    } else {
      return; // Already at item-10, do nothing
    }
  }

  if (target !== null) {
    const el = document.querySelector(`.item-${target}`);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    currentItem = target; 
  }
});

if( window.location.hash ){
    let skip = widnow.location.hash.replace( '#', '' );
    document.querySelector( `.item-${skip}` ).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
    
