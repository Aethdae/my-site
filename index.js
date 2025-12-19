const doc = document;
const choiceButtonIDs = ["choiceOne", "choiceTwo", "choiceThree", "choiceFour"];
const optionButtonIDs = ["restartButton", "exitButton"];
var inventory = new Map();
const jsonUrl = "./data.json"
var jsonData;
var playerName;

const gameStates = [];
var currentState = "";

const choiceOne = doc.getElementById("choiceOne");
const choiceTwo = doc.getElementById("choiceTwo");
const choiceThree = doc.getElementById("choiceThree");
const choiceFour = doc.getElementById("choiceFour");

class ChoiceObject {
    constructor(choiceOne, choiceTwo, choiceThree, choiceFour) {
        this.choice1 = choiceOne;
        this.choice2 = choiceTwo;
        this.choice3 = choiceThree;
        this.choice4 = choiceFour;
    }
}
const choiceButtons = new ChoiceObject({choiceOne, choiceTwo, 
    choiceThree, choiceFour,

    get choice1() {
        return this.choice1;
    },
    get choice2() {
        return this.choice2;
    },
    get choice3() {
        return this.choice3;
    },
    get choice4() {
        return this.choice4;
    }
});

const restartButton = doc.getElementById("restartButton");
const exitButton = doc.getElementById("exitButton");

const titleCard = doc.getElementById("titleCard");
const topScreen = doc.getElementById("topScreen");
const bottomScreen = doc.getElementById("bottomScreen");

const leftColumn = doc.getElementById("leftColumn");
const rightColumn = doc.getElementById("rightColumn");

class enumStorage
{
    //maybe expand gamestate to here instead?
}

startUp();

/**
 * Launch to initialize state and animations
 * TODO: Add loading from cookies? JS? Json? LocalFile?
 */
async function startUp()
{
    await getJson();
    
    let initCards = doc.getElementsByClassName("initCard");
    
    //html elements still don't have foreach
    for (let x = 0; x < initCards.length; x++)
    {
        animateCardsLoad(initCards[x].id);
    }
    console.log("Cards are animating!");

    assignButtons();
    animateSideColumn("leftColumn");
    animateSideColumn("rightColumn");
    console.log("Columns are animating");
    setupInventory();
    setupGameStates();

    displayBeginning();
}

/**
 * Creates eventhandlers for each button.
 */
function assignButtons()
{
    choiceButtonIDs.forEach((id) => {
        doc.getElementById(id).onclick = () => buttonClicked(id);
    });
    optionButtonIDs.forEach((id) => {
        doc.getElementById(id).onclick = () => resourceButtonClicked(id);
    });
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
    for (let x = 0; x < jsonData.potentialItems.length; x++)
    {
        inventory.set(jsonData.potentialItems[x], false);
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
    setTimeout(() => {
        animateText("titleCard", jsonData.pregameHeaderText[0])
    }, 50);
    setTimeout(() => {animateText( "titleCard", jsonData.pregameHeaderText[1])}, 1050);
    setTimeout(() => {
        animateText( "titleCard", jsonData.pregameHeaderText[2])
        showNameEntry();
        updateGameState(gameStates[0]);
        console.log(getCurrentGameState());
        transitionToScene("beginning");
    }, 2050);
}

/**
 * Bring up text box for name entry.
 */
function showNameEntry()
{
    console.log("Showing name");
    element = doc.getElementById("textEntryHolder");
    doc.getElementById("nameEntry").hidden = false;
    element.hidden = false;
    element.style.transition = "1.5s background-color 0.0s ease-out";
    element.style.backgroundColor = "rgba(176, 176, 176, 1.0)";
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


/**
 * Emulates button clicks via eventListening.
 * @param {string} id String of HTML element's ID.
 */
function buttonClicked(id)
{
    let state = getCurrentGameState();
    console.log(`${id} is pressed at ${state} gameState`);

    switch (state)
    {
        case gameStates[0]:
        {
            switch (id)
            {
                case choiceButtonIDs[0]:
                    break;
                case choiceButtonIDs[1]:
                    break;
                case choiceButtonIDs[2]:
                    break;
                case choiceButtonIDs[3]:
                    break;
            }
        }
        case gameStates[1]:
        {
            switch (id)
            {
                case choiceButtonIDs[0]:
                    break;
                case choiceButtonIDs[1]:
                    break;
                case choiceButtonIDs[2]:
                    break;
                case choiceButtonIDs[3]:
                    break;
            }
        }
        case gameStates[2]:
        {
            switch (id)
            {
                case choiceButtonIDs[0]:
                    break;
                case choiceButtonIDs[1]:
                    break;
                case choiceButtonIDs[2]:
                    break;
                case choiceButtonIDs[3]:
                    break;
            }
        }
        case gameStates[3]:
        {
            switch (id)
            {
                case choiceButtonIDs[0]:
                    break;
                case choiceButtonIDs[1]:
                    break;
                case choiceButtonIDs[2]:
                    break;
                case choiceButtonIDs[3]:
                    break;
            }
        }
        case gameStates[4]:
        {
            switch (id)
            {
                case choiceButtonIDs[0]:
                    break;
                case choiceButtonIDs[1]:
                    break;
                case choiceButtonIDs[2]:
                    break;
                case choiceButtonIDs[3]:
                    break;
            }
        }
        case gameStates[5]:
        {
            switch (id)
            {
                case choiceButtonIDs[0]:
                    break;
                case choiceButtonIDs[1]:
                    break;
                case choiceButtonIDs[2]:
                    break;
                case choiceButtonIDs[3]:
                    break;
            }
        }
        case gameStates[6]:
        {
            switch (id)
            {
                case choiceButtonIDs[0]:
                    break;
                case choiceButtonIDs[1]:
                    break;
                case choiceButtonIDs[2]:
                    break;
                case choiceButtonIDs[3]:
                    break;
            }
        }
    }
}

/**
 * Events for the two buttons at the bottom.
 * @param {string} id The ID of the button
 */
function resourceButtonClicked(id)
{
    switch (id)
    {
        case optionButtonIDs[0]:
            startUp();
            break;
        case optionButtonIDs[1]:
            //close();
            break;
    }
}


function setupGameStates()
{
    /*
    //for (let x = 0; x < jsonData.sections.length; x++)
    for (let x = 0; x < Object.keys(jsonData.sections).length; x++)
    {
        console.log(gameStates);
        gameStates.push(Object.keys(jsonData.sections)[x].state);
        // gameStates.push(jsonData.sections[x]['state']);
    }
    */

    Object.keys(jsonData.scenes).forEach((key) => {
        gameStates.push(jsonData.scenes[key].state);
    });
    console.log(gameStates);
}

/**
 * 
 * @returns state as a String
 */
function getCurrentGameState(){
    return currentState;
}

function updateGameState(newState){
    currentState = newState;
}

function transitionToScene(sceneName)
{
    let scenes = Object.keys(jsonData.scenes);
    console.log(scenes);
    switch (sceneName)
    {
        case scenes[0]:
            break;
        case scenes[1]:
            break;
    }
        
    
    updateButtonText(choiceButtons.choice1, jsonData.scenes[sceneName].choiceTexts[0]);
    updateButtonText(choiceButtons.choice2, jsonData.scenes[sceneName].choiceTexts[1]);
    updateButtonText(choiceButtons.choice3, jsonData.scenes[sceneName].choiceTexts[2]);
    updateButtonText(choiceButtons.choice4, jsonData.scenes[sceneName].choiceTexts[3]);
    
}

/**
 * 
 * @param {HTMLElement} button 
 * @param {string} newText 
 */
function updateButtonText(button, newText)
{
    button.innerHTML = newText;
}


