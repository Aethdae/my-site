//#region Comments/plans
/*
#TODO: Add in cookie/local storage support for loading from last scene. 
Should be as simple as saving from click, and reloading that scene and inventory?
Never say it'll be simple though. 

It may be better to do CSS animations instead of using transition/transform, although
it has been working fine for the moment. May cause issues later, especially
instantiating item cards if I go that route instead.

Going forward I think adding additional objects to the json,
indicating where in the scenemap to go would be a better idea
than hard-coding it in the transitions, that way it's more
expandable in case more things get added/replaced/reorganized

It likely would also be better to migrate parts of this to different files
i.e. inventory for dealing with items, story/main for dealing with scenes,
UI for buttons/actions, etc Not necessary for this particular app, but useful for later.
*/
//#endregion

//#endregion

//#region Variables
const doc = document;
var initialized = false;
var inventory = new Map();
const jsonUrl = "./data.json"
var jsonData;

const randomNames = ["Sylas", "Meridiel", "Winston", "Jordan" ];
var playerName;

const gameStates = [];
var currentState = "";


const choiceOne = doc.getElementById("choiceOne");
const choiceTwo = doc.getElementById("choiceTwo");
const choiceThree = doc.getElementById("choiceThree");
const choiceFour = doc.getElementById("choiceFour");

const restartButton = doc.getElementById("restartButton");
const exitButton = doc.getElementById("exitButton");

const choiceButtons = { 
    fff: choiceOne, two: choiceTwo, three: choiceThree, four: choiceFour
};

const optionButtons = { 
    one: restartButton, two: exitButton
}

const headerTop = doc.getElementById("top");
const titleCard = doc.getElementById("titleCard");
const topScreen = doc.getElementById("topScreen");
const bottomScreen = doc.getElementById("bottomScreen");
const mainParagraph = doc.getElementById("mainParagraph");

const leftColumn = doc.getElementById("leftColumn");
const rightColumn = doc.getElementById("rightColumn");
const nameEntry = doc.getElementById("nameEntry");
const textEntryHolder = doc.getElementById("textEntryHolder");
//#endregion


startUp();

/**
 * Launch to initialize state and animations
 */
async function startUp()
{
    await getJson();
    
    let initCards = doc.getElementsByClassName("initCard");
    
    for (let x = 0; x < initCards.length; x++)
    {
        animateCardsLoad(initCards[x].id);
    }
    console.log("Cards are animating...");

    if (!initialized)
    {
        initialized = true;
        assignButtons();
        animateSideColumn("leftColumn");
        animateSideColumn("rightColumn");
        console.log("Columns are animating...");
        setupInventory();
        setupGameStates();
    }
    displayBeginning();
}

/**
 * Creates eventhandlers for each button.
 */
function assignButtons()
{
    console.log("Assigning Buttons...");
    let buttons = Object.values(choiceButtons);
    let oButtons = Object.values(optionButtons);

    buttons.forEach((button) => {
        button.addEventListener("click", () => buttonClicked(button));

        //option to disable buttons at certain points, currently always active
        button.setAttribute("active", "false");
    });
    oButtons.forEach((button) => {
        button.addEventListener("click", () => resourceButtonClicked(button));
    });

    //#region Failed attempts/deprecated
    /* other attempts
    for (let button in buttons)
    {
        //button.onclick = () => buttonClicked(button);
    }

    for (let optionButton in optionButtons)
    {
        addEventListener("click", () => resourceButtonClicked(optionButton));
        //optionButton.onclick = () => resourceButtonClicked(optionButton.id)
    }
    */

    //original
    /*
    choiceButtonIDs.forEach((id) => {
        doc.getElementById(id).onclick = () => buttonClicked(id);
    });
    optionButtonIDs.forEach((id) => {
        doc.getElementById(id).onclick = () => resourceButtonClicked(id);
    });
    */
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
    console.log("Assigning new Inventory...");

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
    element.style.backgroundColor = "#888888FF";
}

/**
 * Plays through intro, asks for name entry;
*/
function displayBeginning()
{
    setTimeout(() => {
        animateText("titleCard", jsonData.pregameHeaderText[0], 2.0)
    }, 50);
    setTimeout(() => {animateText( "titleCard", jsonData.pregameHeaderText[1], 2.0)}, 4050);
    setTimeout(() => {
        setGameState(gameStates[0]);
        showNameEntry();
        console.log(getCurrentGameState());
        transitionToScene("beginning");
    }, 8050);
}

/**
 * Bring up text box for name entry.
 */
function showNameEntry()
{
    mainParagraph.style.textAlign = "center";
    mainParagraph.style.fontSize = "4rem";
    textEntryHolder.hidden = false;
    textEntryHolder.style.transition = "1.5s background-color 0.0s ease-in-out";
    textEntryHolder.addEventListener("transitionend", () => { nameEntry.hidden = textEntryHolder.hidden });
    textEntryHolder.style.backgroundColor = "rgba(9, 9, 9, 1.0)";
}

/**
 * Sets player name into memory.
 * @param {string} nameString string from nameEntry textBox
 */
function submitName(nameString)
{
    console.log("Submitting name");
    mainParagraph.style.textAlign = "left";
    mainParagraph.style.fontSize = "1.5rem";
    playerName = nameString;

    textEntryHolder.hidden = true;
    textEntryHolder.style.transition = ".5s background-color 0.0s ease-in";
    textEntryHolder.style.backgroundColor = "rgba(176, 176, 176, 0)";
}

/**
 * Removes the current text, then animates the string as typed out.
 * @param {string} id ID of HTML element to animate text on.
 * @param {string} string Text to animate.
 * @param {number} multiplier Speed multiplier of text animation.
 */
function animateText(id, string, multiplier = 1.0)
{
    let element = document.getElementById(id);
    element.innerHTML = "";
    let splitString = string.split("");
    //timer, loops over string adding one char at a time?
    for(let x = 0; x < splitString.length * 50 / multiplier; x += 50 / multiplier)
    {
        setTimeout(() => {element.append(splitString[x/(50/multiplier)])}, x);
    }
}


/**
 * Emulates button clicks via eventListening.
 * @param {HTMLElement} element Button as HTML element.
 */
function buttonClicked(element)
{
    let scenes = Object.values(jsonData.scenes);
    let state = getCurrentGameState();
    let buttons = Object.values(choiceButtons);

    if (element.getAttribute("active") === "true")
    {
        switch (state)
        {
            //beginning
            case gameStates[0]:
            {
                switch (element)
                {
                    case buttons[0]:
                        let nameString = nameEntry.value;
                        submitName(nameString);
                        transitionToScene(jsonData.scenes[gameStates[0]].toScene[0]);
                        break;
                    case buttons[1]:
                        let randNumber = Math.floor(Math.random() * 4);
                        submitName(randomNames[randNumber]);
                        transitionToScene(jsonData.scenes[gameStates[0]].toScene[1]);
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[0]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[0]].toScene[3]);
                        break;
                }
            }
            break;

            //start
            case gameStates[1]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[1]].toScene[0]);
                        break;
                    case buttons[1]:
                        transitionToScene(jsonData.scenes[gameStates[1]].toScene[1]);
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[1]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[1]].toScene[3]);
                        break;
                }
            }
            break;

            //explore
            case gameStates[2]:
            {
                switch (element)
                {
                    case buttons[0]:
                        //add axe
                        getItem("Axe");
                        element.innerHTML = "Axe grabbed";
                        transitionToScene(jsonData.scenes[gameStates[2]].toScene[0]);
                        break;
                    case buttons[1]:
                        getItem("Torch");
                        element.innerHTML = "Torch grabbed";
                        transitionToScene(jsonData.scenes[gameStates[2]].toScene[1]);
                        //add torch
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[2]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[2]].toScene[3]);
                        break;
                }
            }
            break;

            //mountain
            case gameStates[3]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[3]].toScene[0]);
                        break;
                    case buttons[1]:
                        transitionToScene(jsonData.scenes[gameStates[3]].toScene[1]);
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[3]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[3]].toScene[3]);
                        break;
                }
            }
            break;

            //startReturn
            case gameStates[4]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[4]].toScene[0]);
                        break;
                    case buttons[1]:
                        transitionToScene(jsonData.scenes[gameStates[4]].toScene[1]);
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[4]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[4]].toScene[3]);
                        break;
                }
            }
            break;

            //fightOne
            case gameStates[5]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[5]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Axe"))
                        {
                            transitionToScene(jsonData.scenes[gameStates[5]].toScene[1]);
                            removeItem("Axe");
                        }
                        else{
                            console.warn("Axe not in inventory.");
                        }
                        break;
                    case buttons[2]:
                        if (inventory.get("Torch"))
                        {
                            removeItem("Torch");
                        transitionToScene(jsonData.scenes[gameStates[5]].toScene[2]);
                        }
                        else{
                            console.warn("Torch not in inventory.");
                        }
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[5]].toScene[3]);
                        break;
                }
            }
            break;
            
            //stealthFight
            case gameStates[6]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[6]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Axe"))
                        {
                            transitionToScene(jsonData.scenes[gameStates[6]].toScene[1]);
                            removeItem("Axe");
                        }
                        else{
                            console.warn("Axe not in inventory.");
                        }
                        break;
                    case buttons[2]:
                        if (inventory.get("Torch"))
                        {
                            removeItem("Torch");
                            transitionToScene(jsonData.scenes[gameStates[6]].toScene[2]);
                        }
                        else{
                            console.warn("Torch not in inventory.");
                        }
                        break;
                    case buttons[3]:
                        getItem("Dagger");
                        transitionToScene(jsonData.scenes[gameStates[6]].toScene[3]);
                        break;
                }
            }
            break;

            //fightSuccessRock
            case gameStates[7]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[7]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Axe"))
                        {
                            transitionToScene(jsonData.scenes[gameStates[7]].toScene[1]);
                            removeItem("Axe");
                        }
                        else{
                            console.warn("Axe not in inventory.");
                        }
                        break;
                    case buttons[2]:
                        if (inventory.get("Torch"))
                        {
                            removeItem("Torch");
                            transitionToScene(jsonData.scenes[gameStates[7]].toScene[2]);
                        }
                        else{
                            console.warn("Torch not in inventory.");
                        }
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[7]].toScene[3]);
                        break;
                }
            }
            break;

            //fightSuccessAxe
            case gameStates[8]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[8]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Torch"))
                        {
                            removeItem("Torch");
                            transitionToScene(jsonData.scenes[gameStates[8]].toScene[1]);
                        }
                        else{
                            console.warn("Torch not in inventory.");
                        }
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[8]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[8]].toScene[3]);
                        break;
                }
            }
            break;

            //fightSuccessTorch
            case gameStates[9]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[9]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Axe"))
                        {
                            transitionToScene(jsonData.scenes[gameStates[9]].toScene[1]);
                            removeItem("Axe");
                        }
                        else{
                            console.warn("Axe not in inventory.");
                        }
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[9]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[9]].toScene[3]);
                        break;
                }
            }
            break;

            //fightFailure
            case gameStates[10]:
            {
                switch (element)
                {
                    case buttons[0]:
                        resetGame();
                        break;
                    case buttons[1]:
                        break;
                    case buttons[2]:
                        break;
                    case buttons[3]:
                        break;
                }
            }
            break;

            //daggerSuccess
            case gameStates[11]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[11]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Axe"))
                        {
                            transitionToScene(jsonData.scenes[gameStates[11]].toScene[1]);
                            removeItem("Axe");
                        }
                        else{
                            console.warn("Axe not in inventory.");
                        }
                        break;
                    case buttons[2]:
                        if (inventory.get("Torch"))
                        {
                            removeItem("Torch");
                            transitionToScene(jsonData.scenes[gameStates[11]].toScene[2]);
                        }
                        else{
                            console.warn("Torch not in inventory.");
                        }
                        break;
                    case buttons[3]:
                        if (inventory.get("Dagger"))
                        {
                            transitionToScene(jsonData.scenes[gameStates[11]].toScene[3]);
                        }
                        else{
                            console.warn("Dagger not in inventory.");
                        }
                        break;
                }
            }
            break;

            //bossFightLoss
            case gameStates[12]:
            {
                switch (element)
                {
                    case buttons[0]:
                        resetGame();
                        break;
                    case buttons[1]:
                        break;
                    case buttons[2]:
                        break;
                    case buttons[3]:
                        break;
                }
            }
            break;
            
            //bossFightAxe
            case gameStates[13]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[13]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Torch"))
                        {
                            transitionToScene(jsonData.scenes[gameStates[13]].toScene[1]);
                            removeItem("Torch");
                        }
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[13]].toScene[2]);
                        break;
                    case buttons[3]:
                        if (inventory.get("Dagger"))
                        {
                            removeItem("Dagger");
                            transitionToScene(jsonData.scenes[gameStates[13]].toScene[3]);
                        }
                        break;
                }
            }
            break;

            //bossFightTorch
            case gameStates[14]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[14]].toScene[0]);
                        break;
                    case buttons[1]:
                        transitionToScene(jsonData.scenes[gameStates[14]].toScene[1]);
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[14]].toScene[2]);
                        break;
                    case buttons[3]:
                        if (inventory.get("Dagger"))
                        {
                            removeItem("Dagger");
                            transitionToScene(jsonData.scenes[gameStates[14]].toScene[3]);
                        }
                        break;
                }
            }
            break;

            //bossFightDagger
            case gameStates[15]:
            {
                switch (element)
                {
                    case buttons[0]:
                        if (inventory.get("Dagger"))
                        {
                            removeItem("Dagger");
                            transitionToScene(jsonData.scenes[gameStates[15]].toScene[0]);
                        }
                        break;
                    case buttons[1]:
                        if (inventory.get("Dagger"))
                        {
                            removeItem("Dagger");
                            transitionToScene(jsonData.scenes[gameStates[15]].toScene[1]);
                        }
                        break;
                    case buttons[2]:
                        if (inventory.get("Axe"))
                        {
                            removeItem("Axe");
                            transitionToScene(jsonData.scenes[gameStates[15]].toScene[2]);
                        }
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[15]].toScene[3]);
                        break;
                }
            }
            break;

            //bossFightDisarmed
            case gameStates[16]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[16]].toScene[0]);
                        break;
                    case buttons[1]:
                        if (inventory.get("Dagger"))
                        {
                            removeItem("Dagger");
                            transitionToScene(jsonData.scenes[gameStates[16]].toScene[1]);
                        }
                        break;
                    case buttons[2]:
                        if (inventory.get("Torch"))
                        {
                            removeItem("Torch");
                            transitionToScene(jsonData.scenes[gameStates[16]].toScene[2]);
                        }
                        break;
                    case buttons[3]:
                        if (inventory.get("Axe"))
                        {
                            removeItem("Axe");
                            transitionToScene(jsonData.scenes[gameStates[16]].toScene[3]);
                        }
                        break;
                }
            }
            break;

            //victory
            case gameStates[17]:
            {
                switch (element)
                {
                    case buttons[0]:
                        transitionToScene(jsonData.scenes[gameStates[17]].toScene[0]);
                        break;
                    case buttons[1]:
                        transitionToScene(jsonData.scenes[gameStates[17]].toScene[1]);
                        break;
                    case buttons[2]:
                        transitionToScene(jsonData.scenes[gameStates[17]].toScene[2]);
                        break;
                    case buttons[3]:
                        transitionToScene(jsonData.scenes[gameStates[17]].toScene[3]);
                        break;
                }
            }
            break;

        }
    }
}

/**
 * Events for the two buttons at the bottom.
 * @param {HTMLElement} element The HTMLElement of the button
 */
function resourceButtonClicked(element)
{
    if (element.getAttribute("Active") == "true")
    {
        let buttons = Object.values(optionButtons);
        switch (element)
        {
            case buttons[0]:
                resetGame();
                break;
            case buttons[1]:
                //close();
                break;
        }
    }
}

/**
 * Adds the Game States to the array from jsonData Object
 */
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

    //push adds to back to array, basically .add from C#
    Object.keys(jsonData.scenes).forEach((key) => {
        gameStates.push(jsonData.scenes[key].state);
    });
    console.log(`Gamestates set up as: ${gameStates}`);
}

/**
 * 
 * @returns state as a String
 */
function getCurrentGameState(){
    return currentState;
}

/**
 * Changes GameState to newState
 * @param {string} newState state to change to.
 */
function setGameState(newState){
    currentState = newState;
}

/**
 * 
 * @param {string} sceneName New scene name as string from Json Object; 
 */
function transitionToScene(sceneName)
{
    if (sceneName != "")
    {
        clearButtons();
        lockButtons();

        let scenes = Object.keys(jsonData.scenes);
        
        setGameState(jsonData.scenes[sceneName].state);

        //additional required logic per scene, i.e. animations, color change, etc.
        switch (sceneName)
        {
            //beginning
            case scenes[0]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                break;
            //start
            case scenes[1]:
                updateHeaderText(jsonData.scenes[sceneName].headerText, playerName);
                break;
            //explore
            case scenes[2]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                break;
            //mountain
            case scenes[3]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                break;
            //startReturn
            case scenes[4]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                break;
            //fightOne
            case scenes[5]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " axeReq";
                choiceThree.className += " torchReq";
                break;
            //stealthFight
            case scenes[6]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " axeReq";
                choiceThree.className += " torchReq";
                break;
            //fightSuccessRock
            case scenes[7]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " axeReq";
                choiceThree.className += " torchReq";
                break;
            //fightSuccaxe
            case scenes[8]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " torchReq";
                break;
            //fightSucctorch
            case scenes[9]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " axeReq";
                break;
            //fightFailure
            case scenes[10]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                break;
            //daggerSuccess
            case scenes[11]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " axeReq";
                choiceThree.className += " torchReq";
                choiceFour.className += " daggerReq";
                break;
            //bossFightLoss
            case scenes[12]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                break;
            //bossFightAxe
            case scenes[13]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " torchReq"
                choiceFour.className += " daggerReq";
                break;
            //bossFightTorch
            case scenes[14]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceFour.className += " daggerReq";
                break;
            //bossFightDagger
            case scenes[15]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceOne.className += " daggerReq";
                choiceTwo.className += " daggerReq";
                choiceThree.className += " axeReq";
                break;
            //bossFightDisarmed
            case scenes[16]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                choiceTwo.className += " daggerReq";
                choiceThree.className += " torchReq";
                choiceFour.className += " axeReq";
                break;
            //victory
            case scenes[17]:
                updateHeaderText(jsonData.scenes[sceneName].headerText);
                break;
        }

        transitionHeaderColor(jsonData.scenes[sceneName].headerColor);

        updateMainText(jsonData.scenes[sceneName].bodyText);
        for (let x = 0; x < 4; x++)
        {
            updateButtonText(Object.values(choiceButtons)[x], 
            jsonData.scenes[sceneName].choiceTexts[x], 
            getTextDelay(jsonData.scenes[sceneName].bodyText, 1.0));
        }
    }
}

function lockButtons()
{
    for (let x = 0; x < 4; x++)
    {
        Object.values(choiceButtons)[x].setAttribute("active", "false");
    }
    for (let y = 0; y < 2; y++)
    {
        Object.values(optionButtons)[y].setAttribute("active", "false");
    }
}

function clearButtons()
{
    let buttons = Object.values(choiceButtons);
    for (let x = 0; x < buttons.length; x++)
    {

        buttons[x].className = " choiceCard initCard";
        buttons[x].innerHTML = "";
    }
}

function transitionHeaderColor(string)
{
    headerTop.style.background = string;
    headerTop.style.transition = "background 2.25s 0s ease-out";
}

/**
 * 
 * @param {HTMLElement} button button element to change
 * @param {string} newText new Text to display
 * @param {number} delay MS to wait before beginning animation
 */
function updateButtonText(button, newText, delay = 0)
{
    setTimeout(function() 
    {
        animateText(button.id, newText);
        activateButton(button.id);
        activateButton(restartButton.id);
        activateButton(exitButton.id);
    }, delay);
}

function activateButton(id)
{
    doc.getElementById(id).setAttribute("active", "true");
}
/**
 * 
 * @param {string} sceneName From jsonObject of transition function
 * @param {string} extraText Current workaround for adding player name into json string
 */
function updateHeaderText(newText, extraText = ""){
    if (extraText != "")
    {
        animateText("titleCard", newText + ` ${extraText}.`);
    }
    else{
        animateText("titleCard", newText);
    }
}

/**
 * 
 * @param {string} newText From jsonObject of transition function
 */
function updateMainText(newText, extraText = ""){
    animateText("mainParagraph", newText);
}

/**
 * 
 * @param {string} string 
 * @param {number} multiplier
 * @returns {number} MS of time that string will take to animate, modified by multiplier
 */
function getTextDelay(string, multiplier)
{
    let splitString = string.split("");
    return (splitString.length * 50 / multiplier);
}

/**
 * Add an item into inventory Map via string name;
 * @param {string} itemName 
 */
function getItem(itemName)
{
    if (inventory.has(itemName))
    {
        if (!inventory.get(itemName))
        {
            inventory.set(itemName, true);
            createItemCard(itemName);

            //implemented
            //maybe instead of display block add a way to add a whole card from js instead? 
            // not hardcoded that way and allows more flexible inventory
            //doc.getElementById(itemName).style.display = "block";
        }
    }
    else{
        console.error("Item not in map");
    }
}

function removeItem(itemName)
{
    inventory.set(itemName, false);
    removeItemCard(itemName);
}
function removeItemCard(itemName)
{
    doc.getElementById(itemName).remove();
}

function createItemCard(itemName){

    let newDiv = doc.createElement("div");
    newDiv.className = "itemCard";
    newDiv.id = itemName;
    let newImg = doc.createElement("img");
    newImg.alt = `pixel art of a ${itemName}`;
    newImg.src = `./images/${itemName.toLowerCase()}.png`

    newDiv.appendChild(newImg);
    if (leftColumn.children.length < 3)
    {
        leftColumn.appendChild(newDiv);
    }
    else if (rightColumn.children.length < 3)
    {
        rightColumn.appendChild(newDiv);
    }
    else{
        console.error(`Too many items for inventory due to ${itemName}. How did this happen?`);
    }
}

function resetGame()
{
    playerName = "";
    setupInventory();
    clearInventoryCards();
    clearButtons();
    displayBeginning();
    submitName("");
    mainParagraph.innerHTML = "";
    resetStyle();
}

function clearInventoryCards()
{
    let items = inventory.keys();
    items.forEach((item) => {
        if (doc.getElementById(item) != null)
        {
            doc.getElementById(item).remove();
        }
    });
}

function resetStyle()
{
    transitionHeaderColor("linear-gradient(.25turn, black, #222, black)");
}

//#region Deprecated
//const choiceButtonIDs = ["choiceOne", "choiceTwo", "choiceThree", "choiceFour"];
//const optionButtonIDs = ["restartButton", "exitButton"];
//#endregion
