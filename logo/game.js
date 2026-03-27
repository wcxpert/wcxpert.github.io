let allTeams=[]
let gameTeams=[]
let current=0
let mistakes=0
let maxMistakes=1
let total=10

const slider=document.getElementById("logoSlider")
const countText=document.getElementById("logoCount")

slider.oninput=()=>{
countText.innerText=slider.value
}

function startGame(){

total=slider.value

allTeams=[...premierLeague]

shuffle(allTeams)

gameTeams=allTeams.slice(0,total)

document.getElementById("home").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")

showLogo()
}

function shuffle(arr){
arr.sort(()=>Math.random()-0.5)
}

function showLogo(){

let team=gameTeams[current]

document.getElementById("logoImage").src=team.hidden
document.getElementById("progressText").innerText=`${current+1} / ${total}`
document.getElementById("guessInput").value=""
document.getElementById("message").innerText=""
}

function submitGuess(){

let guess=document.getElementById("guessInput").value.toLowerCase()

let team=gameTeams[current]

if(team.answers.includes(guess)){

showPopup(true)

}else{

mistakes++

if(mistakes>maxMistakes){
showPopup(false)
}else{
document.getElementById("message").innerText="Try again (1 mistake allowed)"
}

}

}

function showPopup(correct){

let team=gameTeams[current]

document.getElementById("revealedLogo").src=team.revealed

document.getElementById("popupProgress").innerText=`${current+1} / ${total}`

document.getElementById("popup").classList.remove("hidden")

}

function nextLogo(){

document.getElementById("popup").classList.add("hidden")

current++

if(current>=total){
alert("Game complete!")
location.reload()
}else{
showLogo()
}

}

function quitGame(){
location.reload()
}