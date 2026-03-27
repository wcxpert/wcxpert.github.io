let allTeams=[]
let gameTeams=[]
let current=0
let score=0
let mistakes=0
let maxMistakes=1
let total=10
let timer
let timeLeft=15
let activeConfetti = 0

const slider=document.getElementById("logoSlider")
const logoCount=document.getElementById("logoCount")

slider.oninput=()=>logoCount.innerText=slider.value


function shuffle(arr){
return arr.sort(()=>Math.random()-0.5)
}


function collectSelectedLeagues(){

allTeams=[]

document.querySelectorAll("#home input[type=checkbox]").forEach(box=>{

if(!box.checked) return

if(box.value==="premier") allTeams.push(...premierLeague)

if(box.value==="laliga") allTeams.push(...laliga)

if(box.value==="bundesliga") allTeams.push(...bundesliga)

if(box.value==="random"){
allTeams.push(...premierLeague,...laliga,...bundesliga)
}

})

}


function startGame(){

collectSelectedLeagues()

if(allTeams.length===0){
alert("Select at least one league!")
return
}

total=parseInt(slider.value)

if(allTeams.length<total){
alert("Not enough clubs in selected leagues for "+total+" logos.")
return
}

gameTeams=shuffle([...allTeams]).slice(0,total)

document.getElementById("home").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")

current=0
score=0

nextRound()

}

function startDaily(){

let seed=new Date().getDate()

allTeams=[...premierLeague,...laLiga,...bundesliga]

allTeams.sort(()=>Math.sin(seed++)*10000)

gameTeams=allTeams.slice(0,5)

total=5

document.getElementById("home").classList.add("hidden")
document.getElementById("game").classList.remove("hidden")

current=0
score=0

nextRound()

}


function nextRound(){

mistakes=0

document.getElementById("guessInput").value=""
document.getElementById("message").innerText=""

let team=gameTeams[current]

let logo=document.getElementById("logo")

logo.src=team.hidden

let blurEnabled=document.getElementById("blurToggle").checked

logo.className=blurEnabled ? "blur" : ""

updateProgress()

startTimer()

}
function updateProgress(){

let percent=((current+1)/total)*100

document.getElementById("progressFill").style.width=percent+"%"

document.getElementById("progressText").innerText=
`${current+1}/${total}`

}

function startTimer(){

clearInterval(timer)

timeLeft=15

document.getElementById("timer").innerText=timeLeft

timer=setInterval(()=>{

timeLeft--

document.getElementById("timer").innerText=timeLeft

if(timeLeft<=0){
clearInterval(timer)
showPopup(false)
}

},1000)

}


function submitGuess(){

let input=document.getElementById("guessInput")

let guess=input.value.toLowerCase().trim()

let team=gameTeams[current]

input.blur()

if(team.answers.includes(guess)){

score+=100

confetti()

showPopup(true)

}else{

mistakes++

if(mistakes>maxMistakes){
showPopup(false)
}else{
document.getElementById("message").innerText="Try again!"
}

}

}


function showPopup(correct){

clearInterval(timer)

let team=gameTeams[current]

document.getElementById("popup").classList.remove("hidden")

document.getElementById("revealedLogo").src=team.revealed

if(correct){

document.getElementById("resultStatus").innerText="Correct!"
document.getElementById("resultText").innerText="Answer: "+team.name
document.getElementById("points").innerText="+100 Points"

}else{

document.getElementById("resultStatus").innerText="Wrong!"
document.getElementById("resultText").innerText="Answer: "+team.name
document.getElementById("points").innerText="+0 Points"

}

document.getElementById("popupProgress").innerText=`${current+1}/${total}`

document.getElementById("score").innerText=score

}


function nextLogo(){

document.getElementById("popup").classList.add("hidden")

current++

if(current>=total){
alert("Game Complete! Score: "+score)
location.reload()
}else{
    updateProgress()
nextRound()

setTimeout(()=>{
document.getElementById("guessInput").focus()
},100)
}

}


function quitGame(){
location.reload()
}


function openExtras(){
document.getElementById("extrasPopup").classList.remove("hidden")
}

function closeExtras(){
document.getElementById("extrasPopup").classList.add("hidden")
}

function confetti(){

if(activeConfetti>=3) return

activeConfetti++

for(let i=0;i<40;i++){

let conf=document.createElement("div")

conf.style.position="fixed"
conf.style.width="6px"
conf.style.height="6px"
conf.style.background="white"
conf.style.left=Math.random()*100+"%"
conf.style.top="-10px"

let type=document.getElementById("confettiType").value

if(type==="circles"){
conf.style.borderRadius="50%"
}

if(type==="mix"){
if(Math.random()>0.5) conf.style.borderRadius="50%"
}

document.body.appendChild(conf)

let fall=setInterval(()=>{

conf.style.top=parseFloat(conf.style.top)+5+"px"

if(parseFloat(conf.style.top)>window.innerHeight){
clearInterval(fall)
conf.remove()
}

},20)

}

setTimeout(()=>{
activeConfetti--
},1200)

}

document.getElementById("guessInput").addEventListener("keydown", function(e){

if(e.key !== "Enter") return

e.preventDefault()

let popupOpen = !document.getElementById("popup").classList.contains("hidden")

if(popupOpen){

// ENTER = Next logo when result popup is visible
nextLogo()

}else{

// ENTER = Submit guess during game
submitGuess()

}

})