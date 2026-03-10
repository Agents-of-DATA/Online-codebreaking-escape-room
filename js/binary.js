const words = [
"KEY","HASH","DATA","CODE","BYTE","NODE","LINK","FILE","USER"
];

const binaryValues = [
"01001011 01000101 01011001",
"01001000 01000001 01010011 01001000",
"01000100 01000001 01010100 01000001",
"01000011 01001111 01000100 01000101",
"01000010 01011001 01010100 01000101",
"01001110 01001111 01000100 01000101",
"01001100 01001001 01001110 01001011",
"01000110 01001001 01001100 01000101",
"01010101 01010011 01000101 01010010"
];

let currentBinaryChallenge = null;
let currentIndex = 0;

/* ---------- Page system ---------- */

const pages = [
{
type: "info",
content: `
<h2>Info Page</h2>
<p>This challenge shows a word encoded in ASCII Binary.</p>
<p>Convert each 8-bit binary value into a letter.</p>
`
},
{
type: "question",
content: `<h2>Question Page</h2>`
}
];

function updateContent(){

const page = pages[currentIndex];
document.getElementById("page_content").innerHTML = page.content;

const controls = document.getElementById("binary_controls");

if(page.type === "question"){

controls.style.display = "block";
displayBinary();

}else{

controls.style.display = "none";

}

}

/* ---------- Random helper ---------- */

function randomInt(min,max){

return Math.floor(Math.random()*(max-min+1))+min;

}

/* ---------- Binary Challenge ---------- */

function displayBinary(){

if(!currentBinaryChallenge){

const index = randomInt(0,words.length-1);

currentBinaryChallenge = {
word: words[index],
binary: binaryValues[index]
};

}

document.getElementById("binary_message").innerHTML = `
<h3>Decode the Binary</h3>
<p><strong>Binary:</strong> ${currentBinaryChallenge.binary}</p>
`;

}

/* ---------- Answer Checking ---------- */

function compareBinaryInput(){

const userInput =
document.getElementById("binary_input")
.value
.trim()
.toUpperCase();

const feedback = document.getElementById("word_feedback");

if(userInput === currentBinaryChallenge.word){

feedback.innerHTML =
`<p style="color:green;">Correct! The word is ${currentBinaryChallenge.word}</p>`;

setTimeout(()=>{

const index = randomInt(0,words.length-1);

currentBinaryChallenge = {
word: words[index],
binary: binaryValues[index]
};

document.getElementById("binary_input").value="";
displayBinary();

},1000);

}
else{

feedback.innerHTML =
`<p style="color:red;">Try again!</p>`;

}

}

/* ---------- Navigation ---------- */

document.getElementById("back_btn").addEventListener("click",()=>{

currentIndex =
(currentIndex>0) ? currentIndex-1 : pages.length-1;

updateContent();

});

document.getElementById("forward_btn").addEventListener("click",()=>{

currentIndex =
(currentIndex<pages.length-1) ? currentIndex+1 : 0;

updateContent();

});

/* ---------- Submit Button ---------- */

document
.getElementById("answer_btn")
.addEventListener("click",compareBinaryInput);

/* ---------- Start Page ---------- */

updateContent();