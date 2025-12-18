const doc = document;
const potentialItems = ["Pickaxe", "Torch", "Sword", "Axe", "Gun"];
const introStrings = ["Greetings!", "Welcome to the journey.", "What is your name?"]
var inventory = new Map();
const jsonUrl = "./data.json"
var jsonData;
var playerName;

/**
 * Launch to initialize state and animations
 * TODO: Add loading from cookies? JS? Json? LocalFile?
 */
async function startUp()
{
    await getJson();
    
    let initCards = doc.getElementsByClassName("initCard");
    //html elements still don't have foreach
    //initCards.forEach((card) => animateCards(card));

    for (let x = 0; x < initCards.length; x++)
    {
        animateCardsLoad(initCards[x].id);
    }
    console.log("Cards are animating!");

    animateSideColumn("leftColumn");
    animateSideColumn("rightColumn");
    console.log("Columns are animating");
    setupInventory();

    displayBeginning();
}

/**
 * Populates the data variable with global information to use.
 */
async function getJson()
{
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok)
        {
            throw new Error(`Response: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);
        jsonData = result;
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Parse players inventory from map (dictionary) and displays it.
 */
function setupInventory()
{
    for (let x = 0; x < potentialItems.length; x++)
    {
        inventory.set(potentialItems[x], false);
    }
    
    console.log("Inventory has: ", inventory.entries());
}

/**
 * Animates cards on the intro of the site.
@param {string} id
*/
function animateCardsLoad(id)
{
    let element = doc.getElementById(id);
    console.log(`card is animating!`);
    element.style.transition = "transform ease-in-out 1.2s 0.0s";
    element.style.transform = "scale(10000%)";
}

/**
 * Animates columns on the intro of the site.
@param {string} id
*/
function animateSideColumn(id)
{
    let element = doc.getElementById(id);

    element.style.height = "800px";
    element.style.transition = "background-color ease-in-out 2.6s 0.0s";
    element.style.backgroundColor = "#888888FF"
}

/**
 * Plays through intro, asks for name entry;
*/
function displayBeginning()
{
    let nameEntry = doc.getElementById("nameEntry");
    setTimeout(() => {
        animateText("titleCard", jsonData.pregameHeaderText[0])
    }, 50);
    setTimeout(() => {animateText( "titleCard", jsonData.pregameHeaderText[1])}, 4050);
    setTimeout(() => {animateText( "titleCard", jsonData.pregameHeaderText[2])}, 8050);
    //animateText("titleCard", jsonData.pregameHeaderText[0]);
    nameEntry.hidden = false;
}

/**
 * Removes the current text, then animates the string as typed out.
 * @param {string} id ID of HTML element to animate text on.
 * @param {string} string Text to animate
 */
function animateText(id, string)
{
    console.log("Text is animating.")
    let element = document.getElementById(id);
    element.innerHTML = "";
    let splitString = string.split("");
    //timer, loops over string adding one char at a time?
    for(let x = 0; x < splitString.length * 50; x+=50)
    {
        setTimeout(() => {element.append(splitString[x/50])}, x);
    }
}

startUp();

