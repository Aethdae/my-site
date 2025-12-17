const doc = document;
const potentialItems = ["Pickaxe", "Torch", "Sword", "Axe", "Gun"];
const introStrings = ["Greetings!", "Welcome to the journey.", "What is your name?"]
var inventory = new Map();



/**
 * Launch to initialize state and animations
 * TODO: Add loading from cookies? JS? Json? LocalFile?
 */
function startUp()
{
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
    console.log(`card is animating!`);
    doc.getElementById(id).style.transition = "transform ease-in-out 1.2s 0.0s";
    doc.getElementById(id).style.transform = "scale(10000%)";
}

function animateSideColumn(id)
{
    doc.getElementById(id).style.height = "800px";
    doc.getElementById(id).style.transition = "background-color ease-in-out 2.6s 0.0s";
    doc.getElementById(id).style.backgroundColor = "#888888FF"
}

startUp();
setupInventory();