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
		} else{
			var hasPair = false;
		}
	} else{
		var hasPair = false;
	}

	if (aceInPlay && !hasPair){
		var action = getAceAction(parseInt(playerCardValue), parseInt(dealerCardValue));
	} else if (aceInPlay && hasPair){
		var action = "SP"
	} else if (hasPair){
		var action = getPairAction(parseInt(playerCardValue), parseInt(dealerCardValue));
	} else {
		if (parseInt(playerCardValue)>17) playerCardValue = 18;
		var action = getAction(parseInt(playerCardValue), parseInt(dealerCardValue));
	}

	//let player_cards = getCards("player");
	//let dealer_card = getCards("dealer");

	console.log("player:", playerCardValue,  "ace in play:", aceInPlay, "pair:", hasPair);
	console.log("dealer:", dealerCardValue);

	//let action = getAction(player_cards, dealer_card);

	const action_options = {
		S: "Stand",
		P: "Split",
		D: "Double if possible, otherwise hit",
		H: "Hit",
		R: "Surrender if possible, otherwise hit",
		Rs: "  Surrender if Possible, Otherwise Stand",
		S3: "Stand with 2-3 Cards, Hit with 4 Cards",
		S4: "Stand with 2-4 Cards, Hit with 5 Cards", 
		DS3: "Double if Possible, Otherwise S3",
		DS4: "Double if Possible, Otherwise S4",
	};

	// display action
	console.log(action_options[action]);
	let span = doc.new("span");
	span.setClass("tt-blackjack-action");
	span.style.display = "block";
	span.innerText = action_options[action];

	doc.find(".player-cards").appendChild(span);
}

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
			2: "3",
			3: "DS3",
			4: "DS3",
			5: "DS3",
			6: "DS3",
			7: "S4",
			8: "S3",
			9: "H",
			10: "H",
			11: "S3",
		},
		19: {
			2: "S4",
			3: "S4",
			4: "S4",
			5: "S4",
			6: "DS4",
			7: "S4",
			8: "S4",
			9: "S4",
			10: "S4",
			11: "S4",
		},
		20: {
			2: "S4",
			3: "S4",
			4: "S4",
			5: "S4",
			6: "S4",
			7: "S4",
			8: "S4",
			9: "S4",
			10: "S4",
			11: "S4",
		},
		21: {
			2: "S4",
			3: "S4",
			4: "S4",
			5: "S4",
			6: "S4",
			7: "S4",
			8: "S4",
			9: "S4",
			10: "S4",
			11: "S4",
		},
	};

	return action_table[player_cards][dealer_card];

}

function getPairAction(player_cards, dealer_card){
	const action_table = {
		4: {
			2: "P",
			3: "P",
			4: "P",
			5: "P",
			6: "P",
			7: "P",
			8: "H",
			9: "H",
			10: "H",
			11: "H",
		},
		6: {
			2: "H",
			3: "P",
			4: "P",
			5: "P",
			6: "P",
			7: "P",
			8: "P",
			9: "H",
			10: "H",
			11: "R",
		},
		8: {
			2: "H",
			3: "H",
			4: "P",
			5: "P",
			6: "P",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "H",
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
			11: "H",
		},
		12: {
			2: "P",
			3: "P",
			4: "P",
			5: "P",
			6: "P",
			7: "P",
			8: "H",
			9: "H",
			10: "H",
			11: "R",
		},
		14: {
			2: "P",
			3: "P",
			4: "P",
			5: "P",
			6: "P",
			7: "P",
			8: "P",
			9: "H",
			10: "Rs",
			11: "R",
		},
		16: {
			2: "P",
			3: "P",
			4: "P",
			5: "P",
			6: "P",
			7: "P",
			8: "P",
			9: "P",
			10: "Rs",
			11: "R",
		},
		18: {
			2: "P",
			3: "P",
			4: "P",
			5: "P",
			6: "P",
			7: "S",
			8: "P",
			9: "P",
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
	}
}
function getAction(player_cards, dealer_card) {
	const action_table = {
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
			11: "R",
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
			11: "R",
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
			11: "R",
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
			11: "H",
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
			11: "H",
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
			11: "H",
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
			11: "H",
		},
		12: {
			2: "H",
			3: "H",
			4: "S4",
			5: "S4",
			6: "S4",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "R",
		},
		13: {
			2: "S4",
			3: "S4",
			4: "S4",
			5: "S4",
			6: "S4",
			7: "H",
			8: "H",
			9: "H",
			10: "H",
			11: "R",
		},
		14: {
			2: "S4",
			3: "S4",
			4: "S4",
			5: "S4",
			6: "S4",
			7: "H",
			8: "H",
			9: "H",
			10: "R",
			11: "4R",
		},
		15: {
			2: "S4",
			3: "S4",
			4: "S",
			5: "S",
			6: "S",
			7: "H",
			8: "H",
			9: "H",
			10: "R",
			11: "R",
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
			10: "Rs",
			11: "R",
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
			11: "Rs",
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
			11: "S",
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
