casinoGameLoaded().then(() => {
	console.log("TT - Casino | Blackjack");

	if (!settings.pages.casino.global || !settings.pages.casino.blackjack) {
		return;
	}

	doc.find(".startGame").addEventListener("click", () => {
		if (doc.find(".bet-confirm").style.display !== "block") {
			setTimeout(Main, 3000);
		}
	});

	// bet confirm
	doc.find(".bet-confirm .yes").addEventListener("click", () => {
		setTimeout(Main, 3000);
	});

	// remove action when chosen option
	for (let li of doc.findAll(".d-buttons-wrap li")) {
		li.addEventListener("click", () => {
			if (doc.find(".tt-blackjack-action")) doc.find(".tt-blackjack-action").remove();
			//Runs Main again if there are still hidden cards
			setTimeout(() => {if (doc.find(".card-back")) Main()}, 3000)
		});
	}
});

function Main() {
	let playerCards = doc.findAll(".player-cards .inplace");
	let playerCardValue = doc.find(".player-cards .total").textContent.replace(/[()]/g,'');
	let dealerCardValue = doc.find(".dealer-cards .total").textContent.replace(/[()]/g,'');

	if (playerCardValue.length > 2) { //If player has ace the string in play this will say "x or y" and thus return true
		var aceInPlay = true;
		playerCardValue = playerCardValue.split("or")[0]
	} else {
		var aceInPlay = false; //Note this is also returned if player has ace that can only be 1, which is what we want
	}
	if (playerCards.length == 2) {
		let typeCards = []
		for (let card of playerCards){
			let name_of_card = card.classList[0];
			let value_of_card = name_of_card.split("-")[2];

			if (isNaN(parseInt(value_of_card)) && value_of_card !== "A") value_of_card = 10;
			typeCards.push(parseInt(value_of_card));
		}

		if (typeCards[0] == typeCards[1]){
			var hasPair = true;
		} 	
	} else{
		var hasPair = false;
	}

	if (aceInPlay && !hasPair){
		var action = getAceAction(parseInt(playerCardValue), dealerCardValue);
	} else if (hasPair){
		var action = getPairAction(parseInt(playerCardValue), dealerCardValue);
	} else {
		var action = getAction(parseInt(playerCardValue), dealerCardValue);
	}

	//let player_cards = getCards("player");
	//let dealer_card = getCards("dealer");

	console.log("player:", playerCardValue,  "ace in play:", aceInPlay, "pair:", hasPair);
	console.log("dealer:", dealerCardValue);

	//let action = getAction(player_cards, dealer_card);

	const action_options = {
		S: "Stand",
		SP: "Split",
		D: "Double Down",
		H: "Hit",
		R: "Surrender",
	};

	// display action
	/* console.log(action_options[action]);
	let span = doc.new("span");
	span.setClass("tt-blackjack-action");
	span.style.display = "block";
	span.innerText = action_options[action];

	doc.find(".player-cards").appendChild(span);
 */}

function getCards(type) {
	let cards = doc.findAll(`.${type}-cards .inplace:not(.card-back)`);
	let type_cards = [];
	getPlayerCards()
	getDealerCard()
	getCardCount()

	for (let card of cards) {
		let name_of_card = card.classList[0];
		let value_of_card = name_of_card.split("-")[2];

		if (isNaN(parseInt(value_of_card)) && value_of_card !== "A") value_of_card = 10;

		type_cards.push(value_of_card);
	}

	if (type_cards.length === 1) {
		return `${type_cards[0]}`;
	} else {
		if (type_cards[0] === type_cards[1]) {
			return `${type_cards[0]}, ${type_cards[1]}`;
		} else if (type_cards[1] === "A") {
			return `${type_cards[1]}, ${type_cards[0]}`;
		} else if (type_cards[0] === "A") {
			return `${type_cards[0]}, ${type_cards[1]}`;
		} else {
			let val = parseInt(type_cards[0]) + parseInt(type_cards[1]);
			if (val > 18) val = 18;
			return `${val}`;
		}
	}
}

function getAceAction(player_cards, dealer_card){
	const action_table = {
		13: {
			2: "H",
			3: "H",
			4: "H",
			5: "H",
			6: "D",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "H",
		},
		14: {
			2: "H",
			3: "H",
			4: "H",
			5: "D",
			6: "D",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "H",
		},
		15: {
			2: "H",
			3: "H",
			4: "H",
			5: "D",
			6: "D",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "H",
		},
		16: {
			2: "H",
			3: "H",
			4: "D",
			5: "D",
			6: "D",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "H",
		},
		17: {
			2: "H",
			3: "D",
			4: "D",
			5: "D",
			6: "D",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "H",
		},
		18: {
			2: "S",
			3: "D",
			4: "D",
			5: "D",
			6: "D",
			7: "S",
			8: "S",
			9: "H",
			10: "H",
			11: "S",
		},
		19: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "D",
			7: "S",
			8: "S",
			9: "S",
			10: "S",
			11: "S",
		},
		20: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "S",
			8: "S",
			9: "S",
			10: "S",
			11: "S",
		},
		21: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "S",
			8: "S",
			9: "S",
			10: "S",
			11: "S",
		},
	};

	return action_table[player_cards][dealer_card];

}

function getAction(player_cards, dealer_card) {
	const action_table = {
		"2, 2": {
			2: "SP",
			3: "SP",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "SP",
			8: "H",
			9: "H",
			10: "H",
			A: "H",
		},
		"3, 3": {
			2: "H",
			3: "SP",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "SP",
			8: "SP",
			9: "H",
			10: "H",
			A: "SR",
		},
		"4, 4": {
			2: "H",
			3: "H",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "H",
		},
		"5, 5": {
			2: "D",
			3: "D",
			4: "D",
			5: "D",
			6: "D",
			7: "D",
			8: "D",
			9: "D",
			10: "H",
			A: "H",
		},
		"6, 6": {
			2: "SP",
			3: "SP",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "SP",
			8: "H",
			9: "H",
			10: "H",
			A: "SR",
		},
		"7, 7": {
			2: "SP",
			3: "SP",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "SP",
			8: "SP",
			9: "H",
			10: "SRS",
			A: "SR",
		},
		"8, 8": {
			2: "SP",
			3: "SP",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "SP",
			8: "SP",
			9: "SP",
			10: "SRS",
			A: "SR",
		},
		"9, 9": {
			2: "SP",
			3: "SP",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "S",
			8: "SP",
			9: "SP",
			10: "S",
			A: "S",
		},
		"10, 10": {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "S",
			8: "S",
			9: "S",
			10: "S",
			A: "S",
		},
		"A, A": {
			2: "SP",
			3: "SP",
			4: "SP",
			5: "SP",
			6: "SP",
			7: "SP",
			8: "SP",
			9: "SP",
			10: "SP",
			A: "SP",
		},
		5: {
			2: "H",
			3: "H",
			4: "H",
			5: "H",
			6: "H",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "SR",
		},
		6: {
			2: "H",
			3: "H",
			4: "H",
			5: "H",
			6: "H",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "SR",
		},
		7: {
			2: "H",
			3: "H",
			4: "H",
			5: "H",
			6: "H",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "SR",
		},
		8: {
			2: "H",
			3: "H",
			4: "H",
			5: "D",
			6: "D",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "H",
		},
		9: {
			2: "D",
			3: "D",
			4: "D",
			5: "D",
			6: "D",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "H",
		},
		10: {
			2: "D",
			3: "D",
			4: "D",
			5: "D",
			6: "D",
			7: "D",
			8: "D",
			9: "D",
			10: "H",
			A: "H",
		},
		11: {
			2: "D",
			3: "D",
			4: "D",
			5: "D",
			6: "D",
			7: "D",
			8: "D",
			9: "D",
			10: "H",
			A: "H",
		},
		12: {
			2: "H",
			3: "H",
			4: "S",
			5: "S",
			6: "S",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "SR",
		},
		13: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			A: "SR",
		},
		14: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "H",
			8: "H",
			9: "H",
			10: "SR",
			A: "SR",
		},
		15: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "H",
			8: "H",
			9: "H",
			10: "SR",
			A: "SR",
		},
		16: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "H",
			8: "H",
			9: "H",
			10: "SRS",
			A: "SR",
		},
		17: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "S",
			8: "S",
			9: "S",
			10: "S",
			A: "SRS",
		},
		18: {
			2: "S",
			3: "S",
			4: "S",
			5: "S",
			6: "S",
			7: "S",
			8: "S",
			9: "S",
			10: "S",
			A: "S",
		},
	};

	return action_table[player_cards][dealer_card];
}

function casinoGameLoaded() {
	let promise = new Promise((resolve) => {
		let counter = 0;
		let checker = setInterval(() => {
			if (doc.find(".startGame")) {
				resolve(true);
				return clearInterval(checker);
			} else if (counter > 100) {
				resolve(false);
				return clearInterval(checker);
			}
		}, 100);
	});

	return promise.then((data) => data);
}
