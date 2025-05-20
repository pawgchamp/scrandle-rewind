function getDateToday(){
    let now   = new Date();
    let year  = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let day   = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

async function loadData() {
    const content = document.querySelector( "#content" );

    try {
        const [tweetsJson, daysJson] = await Promise.all([
            fetch("js/tweets.json"),
            fetch("js/days.json"),
        ]);
        let tweets = await tweetsJson.json();
        let days   = await daysJson.json();

        let today = getDateToday();
        let pairs = days[today] || [];

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
            
            html += `<li class="item-${number} winner-${winnerNumber}">`;

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
                    <figure>
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



document.querySelector( '.spoiler-checkbox' ).addEventListener( 'click', function(){
    document.body.classList.toggle( 'spoiler' );
});


document.addEventListener('keydown', function (event) {
  // Only respond if not typing in an input or textarea
  if (
    document.activeElement.tagName === 'INPUT' ||
    document.activeElement.tagName === 'TEXTAREA' ||
    document.activeElement.isContentEditable
  ) {
    return;
  }

  // Map number row keys to class names
  const key = event.key;
  let className = null;

  if (key >= '1' && key <= '9') {
    className = `item-${key}`;
  } else if (key === '0') {
    className = 'item-10';
  }

  if (className) {
    const el = document.querySelector(`.${className}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});