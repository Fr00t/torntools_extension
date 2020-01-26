const chrome = browser;
window.onload = () => {
	console.log("TornTools", "forums");
	initialize();
	Main();
}

function Main(){
	chrome.storage.local.get(["settings"], function(data){
		const forums = data["settings"]["other"]["forums"];
		const firstScrollTop = data["settings"]["other"]["forumsScrollTop"];
		let done = false;

		let mainLoop = setInterval(function(){
			if(done){
				clearInterval(mainLoop);
				let subLoop = setInterval(function(){
					subMain(forums);
				}, 10000)
			} else {
				done = subMain(forums);
				if(done){
					if(firstScrollTop){
						scrollToTop();	
					} else {
						console.log("FIRST SCROLL TOP TURNED OFF")
					}
				}
			}
		}, 1000);
	});
}

function subMain(forums){
	// INPUT FRAME
	const frame = document.querySelector("iframe");
	if(frame){
		if(forums){
			frame.setAttribute("style", `
				height: 700px;
				max-height: 1000px;
				display: block;
				width: 100%;
			`);
			
			// BACK UP ARROW
			if(!document.querySelector("#ttbackUpArrow")){
				let upArrow = document.createElement("div");
				upArrow.setAttribute("style", `
					width: 40px;
					height: 30px;
					background-color: gray;
					font-size: 17px;
					color: white;
					position: fixed;
					top: 20px;
					right: 10px;
					font-weight: 600;
					text-align: center;
					line-height: 30px;
					cursor: pointer;
				`)
				upArrow.innerText = "UP";
				upArrow.id = "ttbackUpArrow";
				
				upArrow.addEventListener("click", function(){
					scrollToTop(true);
				})
				
				document.body.appendChild(upArrow);
			}
		} else {
			console.log("FORUMS HELPER OFF");
		}
		return true;
	}
	return false
}

//////////////////////////////
// FUNCTIONS
//////////////////////////////

function initialize(){
	chrome.storage.local.get(["update"], function(data){
		const update = data["update"];
		
		if(update){
			const headers = document.querySelectorAll(".header___30pTh.desktop___vemcY");
			const version = chrome.runtime.getManifest().version;
			
			var container;
			for(let header of headers){
				if(header.innerText === "Areas"){
					container = header.parentElement.children[1];
				}
			}
			const nextElement = document.querySelector("#nav-home");

			let div = document.createElement("div");
			let innerDiv = document.createElement("div");
			let link = document.createElement("a");
			let span = document.createElement("span");
			let icon = document.createElement("div");

			div.classList.add("area-desktop___29MUo");
			innerDiv.classList.add("area-row___51NLj");
			innerDiv.style.backgroundColor = "#8eda53b0";

			link.addEventListener("click", function(){
				chrome.runtime.sendMessage({"action": "openOptionsPage"});
			});

			span.innerHTML = `Torn<span style="font-weight:600;margin:0;line-height:7px;">Tools</span>  v${version}`;
			span.setAttribute("style", `
				height: 20px;
				line-height: 20px;
			`);

			const src = chrome.extension.getURL("images/icon50.png");
			icon.setAttribute("style", `
				width: 15px;
				height: 15px;
				background-size: cover;
				background-image: url(${src});
				margin-top: 2px;
				margin-left: 10px;
				margin-right: 6px;
				float: left;
			`)

			link.appendChild(icon)
			link.appendChild(span);
			innerDiv.appendChild(link);
			div.appendChild(innerDiv);
			container.insertBefore(div, nextElement);
		}

		// functions
		capitalize();
	});
}

async function get_api(http, api_key) {
//  	console.log("START");

	// chrome.storage.local.get(["api_count", "api_limit"], function(data){

	// 	console.log("CURRENT API COUNT 1", api_count)
	// 	console.log("CURRENT API LIMIT 1", api_limit)

	// 	localStorage.setItem("api_count", parseInt(data["api_count"]));
	// 	localStorage.setItem("api_limit", parseInt(data["api_limit"]));
	// });

	// const api_count = parseInt(localStorage.getItem("api_count"));
	// const api_limit = parseInt(localStorage.getItem("api_limit"));
	// console.log("CURRENT API COUNT 2", api_count)
	// console.log("CURRENT API LIMIT 2", api_limit)

	// if(api_count >= api_limit){
	// 	console.log("API limit exceeded.");
	// } else {
	// 	await increaseApiCount(api_count)
	// 	const response = await fetch(http + "&key=" + api_key)
	// 	const result = await response.json()
	// 	console.log("HERE4", result)
	// 	return result
	// }

	// function increaseApiCount(api_count){
	// 	chrome.storage.local.set({"api_count": parseInt(api_count+1)}, function(){
	// 		console.log("Api count set.", parseInt(api_count+1))
	// 	})
	// }
	const response = await fetch(http + "&key=" + api_key)
	const result = await response.json()
	return result;
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function compare(a,b) {
  if (a.cost < b.cost)
    return -1;
  if (a.cost > b.cost)
    return 1;
  return 0;
}

function getLowest(lists){
	var lowest;

	for(let list in lists){
		for(let id in lists[list]){
			let price = parseInt(lists[list][id]["cost"]);

			if(!lowest){
				lowest = price;
			} else if(price < lowest){
				lowest = price
			}
		}
	}
	return lowest;
}

function days(x){
	return Math.floor(x/60/60/24); // seconds, minutes, hours
}

function hours(x){
	return Math.floor(x/60/60); // seconds, minutes
}

function countPerks(perks){
	let total = 0;

	for(let perklist of perks){
		for(let perk of perklist){
			total++;
		}
	}

	return total
}

function displayNetworth(x){
	const container = document.querySelector("#item4741013");
	const innerBox = container.children[1].children[0].children[0];
	const last = innerBox.children[innerBox.children.length-1];

	last.removeAttribute("class");

	let li = document.createElement("li");
	let spanL = document.createElement("span");
	let spanName = document.createElement("span");
	let spanR = document.createElement("span");
	let i = document.createElement("i");

	li.classList.add("last");
	li.style.backgroundColor = "#65c90069";
	spanL.classList.add("divider");
	spanR.classList.add("desc");
	i.classList.add("networth-info-icon");
	i.setAttribute("title", "Torn Tools: Your networth is fetched from Torn's API which may have a small delay. It is fetched every 1 minute.");
	spanName.style.backgroundColor = "rgba(0,0,0,0)";

	spanName.innerText = "Networth"
	spanR.innerText = "$" + String(numberWithCommas(x));
	spanR.style.paddingLeft = "12px";
	
	spanL.appendChild(spanName);
	spanR.appendChild(i);
	li.appendChild(spanL);
	li.appendChild(spanR);
	innerBox.appendChild(li);
}

function cleanNr(x){
	return String(parseInt(x).toFixed())
}

function capitalize(){
	String.prototype.capitalize = function () {
	  	return this.replace(/^./, function (match) {
	    	return match.toUpperCase();
	  	});
	};
}

function scrollToTop(smoothe){
	if(smoothe){
		(function smoothscroll(){
		    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
		    if(currentScroll > 0) {
		         window.requestAnimationFrame(smoothscroll);
		         window.scrollTo(0,currentScroll - (currentScroll/25));
		    }
		})();
	} else {
		window.scrollTo(0, 0);
	}
}