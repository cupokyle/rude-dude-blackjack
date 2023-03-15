export const suits = ['♠', '♣', '♦', '♥'];
export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function createDeck() {
  let deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, hidden: false });
    }
  }
  return shuffle(deck);
}

export function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function calculatePoints(hand) {
  let points = 0;
  let aces = 0;

  for (const card of hand) {
    let value = card.rank;
    if (value === 'A') {
      aces += 1;
      points += 11;
    } else if (['K', 'Q', 'J'].includes(value)) {
      points += 10;
    } else {
      points += parseInt(value, 10);
    }
  }

  while (points > 21 && aces > 0) {
    points -= 10;
    aces -= 1;
  }

  return points;
}
